import { useState, useEffect } from 'react';
import { searchTracks, fetchTopSongs, fetchNewMusic, fetchNewReleases, fetchAlbum, fetchArtist } from '../utils/itunesApi';

// ─── Generic async data hook ─────────────────────────────────────────────────

function useAsyncFetch(fetcher, deps) {
  const [data,    setData]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    fetcher()
      .then((d)  => { if (alive) setData(d); })
      .catch((e) => { if (alive) setError(e); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, deps);

  return { data, loading, error };
}

// ─── Public hooks ────────────────────────────────────────────────────────────

/** iTunes top-songs chart */
export const useTopSongs = (limit = 10) =>
  useAsyncFetch(() => fetchTopSongs(limit), [limit]);

/** iTunes new-releases feed */
export const useNewReleases = (limit = 8) =>
  useAsyncFetch(() => fetchNewReleases(limit), [limit]);

/** iTunes new-music feed */
export const useNewMusic = (limit = 8) =>
  useAsyncFetch(() => fetchNewMusic(limit), [limit]);

/** Single-genre search — used for artwork covers */
export const useGenreSearch = (query, limit = 1) =>
  useAsyncFetch(() => searchTracks(query, limit), [query, limit]);

/**
 * Debounced live search — fires 400ms after the user stops typing.
 * Returns [] immediately when query is blank.
 */
export function useTrackSearch(query, limit = 20) {
  const [tracks,  setTracks]  = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    const q = query.trim();
    if (!q) { setTracks([]); setLoading(false); return; }

    let alive = true;
    setLoading(true);
    setError(null);

    const timer = setTimeout(() => {
      searchTracks(q, limit)
        .then((r)  => { if (alive) setTracks(r); })
        .catch((e) => { if (alive) setError(e); })
        .finally(() => { if (alive) setLoading(false); });
    }, 400);

    return () => { alive = false; clearTimeout(timer); };
  }, [query, limit]);

  return { tracks, loading, error };
}

/**
 * Fetch a full album (info + track list) by any iTunes track or collection ID.
 * Returns { album, tracks, loading, error }.
 */
export function useAlbum(id) {
  const [album,   setAlbum]   = useState(null);
  const [tracks,  setTracks]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!id) return;
    let alive = true;
    setLoading(true);
    setError(null);
    fetchAlbum(id)
      .then(({ album, tracks }) => {
        if (alive) { setAlbum(album); setTracks(tracks); }
      })
      .catch((e) => { if (alive) setError(e); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [id]);

  return { album, tracks, loading, error };
}

/**
 * Fetch artist info + top songs + albums by artistId.
 * Returns { artist, topSongs, albums, loading, error }.
 */
export function useArtist(artistId) {
  const [artist,   setArtist]   = useState(null);
  const [topSongs, setTopSongs] = useState([]);
  const [albums,   setAlbums]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    if (!artistId) return;
    let alive = true;
    setLoading(true);
    setError(null);
    fetchArtist(artistId)
      .then(({ artist, topSongs, albums }) => {
        if (alive) { setArtist(artist); setTopSongs(topSongs); setAlbums(albums); }
      })
      .catch((e) => { if (alive) setError(e); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [artistId]);

  return { artist, topSongs, albums, loading, error };
}
