/** iTunes Search API & RSS utilities — no API key required, CORS-safe */

const BASE = 'https://itunes.apple.com';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Upscale iTunes artwork URL to any size (default 500×500) */
export const getLargeArtwork = (url, size = 500) => {
  if (!url) return '';
  // Handles both "100x100bb" (Search API) and "170x170-75" (RSS) formats
  return url.replace(/\d+x\d+(?:bb|-\d+)?/, `${size}x${size}bb`);
};

/** Format milliseconds to m:ss */
export const formatDuration = (ms) => {
  if (!ms) return '--:--';
  const s = Math.round(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

/** Format a full ISO date to a short readable string, e.g. "Mar 2025" */
export const formatReleaseDate = (iso) => {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  } catch {
    return iso;
  }
};

// ─── Search API ──────────────────────────────────────────────────────────────

/**
 * Search iTunes for tracks.
 * @param {string} term - Search query
 * @param {number} limit - Max results (default 20)
 * @returns {Promise<iTunesTrack[]>}
 */
export async function searchTracks(term, limit = 20) {
  const url = new URL(`${BASE}/search`);
  url.searchParams.set('term', term);
  url.searchParams.set('media', 'music');
  url.searchParams.set('entity', 'song');
  url.searchParams.set('limit', String(limit));

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`iTunes search failed: ${res.status}`);
  const json = await res.json();

  return (json.results ?? []).map((t) => ({
    ...t,
    artworkUrl100: getLargeArtwork(t.artworkUrl100),
  }));
}

// ─── RSS Charts ──────────────────────────────────────────────────────────────

/** Normalize an iTunes RSS entry to a flat track-like object */
function normalizeRssEntry(entry) {
  const images = entry['im:image'] ?? [];
  const rawArt = images[2]?.label ?? images[0]?.label ?? '';
  return {
    trackId:           entry.id?.attributes?.['im:id'] ?? String(Math.random()),
    trackName:         entry['im:name']?.label ?? 'Unknown',
    artistName:        entry['im:artist']?.label ?? 'Unknown Artist',
    collectionId:      entry['im:collection']?.attributes?.['im:id'] ?? undefined,
    collectionName:    entry['im:collection']?.['im:name']?.label ?? '',
    artworkUrl100:     getLargeArtwork(rawArt),
    primaryGenreName:  entry.category?.attributes?.label ?? 'Music',
    releaseDate:       entry['im:releaseDate']?.label ?? '',
    previewUrl:        null,
    trackTimeMillis:   null,
  };
}

/**
 * Fetch the iTunes top-songs chart.
 * @param {number} limit - Up to 100
 */
export async function fetchTopSongs(limit = 10) {
  const res = await fetch(`${BASE}/us/rss/topsongs/limit=${limit}/json`);
  if (!res.ok) throw new Error(`iTunes top songs failed: ${res.status}`);
  const json = await res.json();
  return (json.feed?.entry ?? []).map(normalizeRssEntry);
}

/**
 * Fetch new/hot music using Apple's newer Marketing Tools RSS API.
 * Falls back to an iTunes keyword search if the primary feed fails.
 * @param {number} limit - Up to 100
 */
export async function fetchNewMusic(limit = 8) {
  try {
    // Apple's modern RSS API (replaces the old /us/rss/newmusic/ endpoint)
    const res = await fetch(
      `https://rss.applemarketingtools.com/api/v2/us/music/most-played/${limit}/songs.json`
    );
    if (!res.ok) throw new Error(`Apple RSS failed: ${res.status}`);
    const json = await res.json();
    const results = json?.feed?.results ?? [];
    if (results.length === 0) throw new Error('Empty results from Apple RSS');

    // Normalize to the same shape as iTunes Search API tracks
    return results.map((item) => ({
      trackId:          item.id ?? String(Math.random()),
      trackName:        item.name ?? 'Unknown',
      artistName:       item.artistName ?? 'Unknown Artist',
      collectionName:   item.albumName ?? '',
      artworkUrl100:    getLargeArtwork(item.artworkUrl100),
      primaryGenreName: item.genres?.[0]?.name ?? 'Music',
      releaseDate:      item.releaseDate ?? '',
      previewUrl:       null,
      trackTimeMillis:  null,
      trackViewUrl:     item.url ?? null,
    }));
  } catch (primaryErr) {
    console.warn('Primary new music feed failed, falling back to iTunes search:', primaryErr);
    // Fallback: search for recent pop/chart songs
    try {
      const res = await fetch(
        `https://itunes.apple.com/search?term=top+hits+2024+2025&media=music&entity=song&limit=${limit}&sort=recent`
      );
      if (!res.ok) throw new Error(`iTunes fallback failed: ${res.status}`);
      const json = await res.json();
      return (json.results ?? []).map((t) => ({
        ...t,
        artworkUrl100: getLargeArtwork(t.artworkUrl100),
      }));
    } catch (fallbackErr) {
      console.error('Both new music feeds failed:', fallbackErr);
      return [];
    }
  }
}

/**
 * Fetch the iTunes new-releases feed.
 * @param {number} limit - Up to 100
 */
export async function fetchNewReleases(limit = 8) {
  return fetchNewMusic(limit);
}

// ─── Album Lookup ─────────────────────────────────────────────────────────────

/**
 * Given any iTunes track or collection ID, resolves the album and returns:
 *   { album, tracks }
 * Strategy:
 *  1. Try fetching as a collection directly (fastest path if id IS a collectionId)
 *  2. If no tracks found, lookup the ID to discover the real collectionId
 *  3. Retry the album fetch with the resolved collectionId
 */
export async function fetchAlbum(id) {
  if (!id) throw new Error('fetchAlbum: id is required');

  const doAlbumFetch = async (collId) => {
    const res = await fetch(`${BASE}/lookup?id=${collId}&entity=song&country=us`);
    if (!res.ok) return null;
    const json = await res.json();
    const all = json.results ?? [];
    const album = all.find((r) => r.wrapperType === 'collection');
    const tracks = all
      .filter((r) => r.wrapperType === 'track')
      .sort((a, b) => (a.trackNumber ?? 0) - (b.trackNumber ?? 0))
      .map((t) => ({ ...t, artworkUrl100: getLargeArtwork(t.artworkUrl100) }));
    return { album, tracks };
  };

  // ── Path A: try the id directly as a collection ───────────────────────────
  const directResult = await doAlbumFetch(id);
  if (directResult?.album && directResult.tracks.length > 0) {
    return {
      album: { ...directResult.album, artworkUrl100: getLargeArtwork(directResult.album.artworkUrl100) },
      tracks: directResult.tracks,
    };
  }

  // ── Path B: id might be a track/song id – look it up to get collectionId ──
  const lookupRes = await fetch(`${BASE}/lookup?id=${id}&country=us`);
  if (!lookupRes.ok) throw new Error(`iTunes lookup failed: ${lookupRes.status}`);
  const lookupJson = await lookupRes.json();
  const item = lookupJson.results?.[0];
  if (!item) throw new Error(`No iTunes result found for id: ${id}`);

  const collectionId = item.collectionId;
  if (!collectionId) {
    // Single / EP with no album — return the track itself as the only "album"
    const artUrl = getLargeArtwork(item.artworkUrl100);
    return {
      album: {
        collectionName: item.collectionName ?? item.trackName,
        artistName: item.artistName,
        artworkUrl100: artUrl,
        primaryGenreName: item.primaryGenreName,
        releaseDate: item.releaseDate,
        copyright: null,
        collectionViewUrl: item.trackViewUrl,
      },
      tracks: [{ ...item, artworkUrl100: artUrl }],
    };
  }

  // ── Path C: retry with the resolved collectionId ──────────────────────────
  const albumResult = await doAlbumFetch(collectionId);
  if (!albumResult) throw new Error(`Album fetch failed for collectionId: ${collectionId}`);

  const album = albumResult.album ?? {
    collectionName: item.collectionName ?? 'Unknown Album',
    artistName: item.artistName,
    artworkUrl100: getLargeArtwork(item.artworkUrl100),
    primaryGenreName: item.primaryGenreName,
    releaseDate: item.releaseDate,
  };

  return {
    album: { ...album, artworkUrl100: getLargeArtwork(album.artworkUrl100) },
    tracks: albumResult.tracks,
  };
}

// ─── Artist Lookup ────────────────────────────────────────────────────────────

/**
 * Fetch artist info + top songs + albums by artistId.
 * Returns { artist, topSongs, albums }
 */
export async function fetchArtist(artistId) {
  if (!artistId) throw new Error('fetchArtist: artistId is required');

  const [songsRes, albumsRes] = await Promise.all([
    fetch(`${BASE}/lookup?id=${artistId}&entity=song&limit=20&country=us`),
    fetch(`${BASE}/lookup?id=${artistId}&entity=album&limit=16&country=us`),
  ]);

  if (!songsRes.ok) throw new Error(`Artist songs lookup failed: ${songsRes.status}`);
  if (!albumsRes.ok) throw new Error(`Artist albums lookup failed: ${albumsRes.status}`);

  const [songsJson, albumsJson] = await Promise.all([songsRes.json(), albumsRes.json()]);

  const songResults  = songsJson.results  ?? [];
  const albumResults = albumsJson.results ?? [];

  // First result in each lookup is the artist object itself
  const artist = songResults.find((r) => r.wrapperType === 'artist')
    ?? albumResults.find((r) => r.wrapperType === 'artist')
    ?? null;

  const topSongs = songResults
    .filter((r) => r.wrapperType === 'track')
    .map((t) => ({ ...t, artworkUrl100: getLargeArtwork(t.artworkUrl100) }));

  const albums = albumResults
    .filter((r) => r.wrapperType === 'collection')
    .map((a) => ({ ...a, artworkUrl100: getLargeArtwork(a.artworkUrl100) }));

  return { artist, topSongs, albums };
}

/**
 * Search for an artist by name and return their artistId + basic info.
 */
export async function searchArtist(name) {
  const url = new URL(`${BASE}/search`);
  url.searchParams.set('term', name);
  url.searchParams.set('entity', 'musicArtist');
  url.searchParams.set('limit', '1');

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Artist search failed: ${res.status}`);
  const json = await res.json();
  return json.results?.[0] ?? null;
}
