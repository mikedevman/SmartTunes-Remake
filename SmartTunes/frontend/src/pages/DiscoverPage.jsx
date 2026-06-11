import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Play, Pause, Search, TrendingUp, Clock, ChevronRight,
  Flame, Sparkles, Radio, Disc3, Guitar, Piano,
  Music2, Heart, MoreHorizontal, Loader2, X,
  ExternalLink,
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useTopSongs, useNewReleases, useTrackSearch, useGenreSearch } from '../hooks/useItunesData';
import { formatDuration, formatReleaseDate } from '../utils/itunesApi';
import { usePlayer } from '../components/PlayerContext';
import { GENRES, MOODS, RADIO_STATIONS } from '../data/mockData';
import { AlbumPage } from './AlbumPage';
// ─── Sub-components ───────────────────────────────────────────────────────────

// ─── Sub-components ───────────────────────────────────────────────────────────

const SectionHeader = ({ label, title, linkTo, linkText }) => (
  <div className="flex items-end justify-between mb-10">
    <div>
      <p className="text-primary font-semibold text-xs uppercase tracking-widest mb-2">{label}</p>
      <h2 className="font-display text-3xl md:text-4xl font-bold">{title}</h2>
    </div>
    {linkTo && (
      <RouterLink to={linkTo} className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-textMuted hover:text-white transition-colors group">
        {linkText ?? 'See All'}
        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </RouterLink>
    )}
  </div>
);

const SkeletonRow = () => (
  <div className="grid grid-cols-[40px_1fr_auto_auto] sm:grid-cols-[40px_1fr_160px_80px_80px] items-center px-4 py-3 border-b border-white/5">
    <div className="w-4 h-4 bg-white/5 rounded animate-pulse" />
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-white/5 rounded-lg animate-pulse flex-shrink-0" />
      <div className="space-y-2">
        <div className="h-3 w-32 bg-white/5 rounded animate-pulse" />
        <div className="h-2 w-20 bg-white/5 rounded animate-pulse" />
      </div>
    </div>
    <div className="hidden sm:block h-2 w-24 bg-white/5 rounded animate-pulse" />
    <div className="hidden sm:block h-2 w-8 bg-white/5 rounded animate-pulse" />
    <div className="h-2 w-10 bg-white/5 rounded animate-pulse ml-auto" />
  </div>
);

const SkeletonCard = () => (
  <div>
    <div className="aspect-square rounded-2xl bg-white/5 animate-pulse mb-3" />
    <div className="h-3 w-3/4 bg-white/5 rounded animate-pulse mb-2" />
    <div className="h-2 w-1/2 bg-white/5 rounded animate-pulse mb-2" />
    <div className="flex gap-2"><div className="h-5 w-12 bg-white/5 rounded-full animate-pulse" /><div className="h-2 w-16 bg-white/5 rounded animate-pulse" /></div>
  </div>
);

/** Single search result row */
const SearchResultRow = ({ track, index }) => {
  const { play, currentTrack, isPlaying, togglePlayPause } = usePlayer();
  const isThisTrack = currentTrack?.trackId === track.trackId;

  return (
  <a
    href={track.trackViewUrl ?? '#'}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer"
  >
    <span className="text-textMuted text-sm w-5 text-center tabular-nums">{index + 1}</span>
    <img
      src={track.artworkUrl100}
      alt={track.trackName}
      className="w-10 h-10 rounded-lg object-cover flex-shrink-0 shadow-md"
      loading="lazy"
    />
    <div className="min-w-0 flex-1">
      <p className={`text-sm font-semibold truncate transition-colors ${isThisTrack ? 'text-primary' : 'group-hover:text-primary'}`}>{track.trackName}</p>
      <p className="text-xs text-textMuted truncate">{track.artistName} · {track.collectionName}</p>
    </div>
    <span className="hidden sm:block text-xs text-textMuted tabular-nums flex-shrink-0">
      {formatDuration(track.trackTimeMillis)}
    </span>
    {track.previewUrl && (
      <button
        onClick={(e) => {
          e.preventDefault();
          if (isThisTrack) togglePlayPause();
          else play(track);
        }}
        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${isThisTrack ? 'bg-primary text-background opacity-100' : 'bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-background opacity-0 group-hover:opacity-100'}`}
        aria-label="Preview"
      >
        {isThisTrack && isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
      </button>
    )}
    <ExternalLink className="w-3.5 h-3.5 text-textMuted opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
  </a>
  );
};

/** Trending chart table row */
const TrendingTableRow = ({ track, index }) => {
  const { play, currentTrack, isPlaying, togglePlayPause } = usePlayer();
  const navigate = useNavigate();
  const isThisTrack = currentTrack?.trackId === track.trackId;

  return (
  <div 
    onClick={() => {
      if (isThisTrack) togglePlayPause();
      else play(track);
    }}
    className="grid grid-cols-[40px_1fr_auto] sm:grid-cols-[40px_1fr_160px_80px] items-center px-4 py-3 border-b border-white/5 last:border-0 group hover:bg-white/3 transition-colors cursor-pointer"
  >
    <div className="relative w-5">
      <span className={`text-sm font-bold absolute inset-0 flex items-center transition-opacity ${isThisTrack ? 'opacity-0' : 'text-textMuted group-hover:opacity-0'}`}>{index + 1}</span>
      {isThisTrack && isPlaying ? <Pause className="w-4 h-4 text-primary fill-current" /> : <Play className={`w-4 h-4 text-white fill-current transition-opacity ${isThisTrack ? 'opacity-100 text-primary' : 'opacity-0 group-hover:opacity-100'}`} />}
    </div>
    <div className="flex items-center gap-3 min-w-0">
      <img src={track.artworkUrl100} alt={track.collectionName} className="w-10 h-10 rounded-lg object-cover flex-shrink-0 shadow-md" loading="lazy" onError={(e) => { e.currentTarget.style.display='none'; }} />
      <div className="min-w-0">
        <p className={`font-semibold text-sm truncate transition-colors ${isThisTrack ? 'text-primary' : 'group-hover:text-primary'}`}>{track.trackName}</p>
        <p className="text-xs text-textMuted mt-0.5 truncate">
          <RouterLink
            to={track.artistId ? `/artist/${track.artistId}` : `/discover`}
            className="hover:text-primary transition-colors"
          >
            {track.artistName}
          </RouterLink>
        </p>
      </div>
    </div>
    <span
      className="hidden sm:block text-xs text-textMuted truncate pr-4 cursor-pointer hover:text-white transition-colors"
      onClick={(e) => {
        e.stopPropagation();
        const albumId = track.collectionId ?? track.trackId;
        navigate(`/album/${albumId}`);
      }}
    >
      {track.collectionName}
    </span>
  </div>
  );
};

/** New release card */
const ReleaseCard = ({ track }) => {
  const navigate = useNavigate();
  const { play, currentTrack, isPlaying, togglePlayPause } = usePlayer();
  const isThisTrack = currentTrack?.trackId === track.trackId;

  return (
  <div className="group cursor-pointer card-hover" onClick={goToAlbum}>
    <div className="relative aspect-square rounded-2xl overflow-hidden mb-3 shadow-lg shadow-black/40">
      <img
        src={track.artworkUrl100}
        alt={track.trackName}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
        onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=400&q=80'; }}
      />
      <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-opacity ${isThisTrack ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (isThisTrack) togglePlayPause();
          else play(track);
        }}
        className={`absolute bottom-3 right-3 w-11 h-11 rounded-full flex items-center justify-center shadow-xl transform transition-all duration-300 hover:scale-110 ${isThisTrack ? 'bg-primary text-background translate-y-0 opacity-100' : 'bg-primary text-background translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0'}`}
        aria-label={`Play ${track.trackName}`}
      >
        {isThisTrack && isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
      </button>
    </div>
    <div className="flex items-start justify-between">
      <div className="min-w-0">
        <h3 className={`font-display font-bold text-sm truncate transition-colors ${isThisTrack ? 'text-primary' : 'group-hover:text-primary'}`}>{track.trackName}</h3>
        <p className="text-xs text-textMuted mt-0.5 truncate">
          <RouterLink
            to={track.artistId ? `/artist/${track.artistId}` : `/discover`}
            className="hover:text-primary transition-colors"
          >
            {track.artistName}
          </RouterLink>
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-xs px-2 py-0.5 rounded-full bg-white/8 border border-white/10 text-textMuted">{track.primaryGenreName}</span>
          {track.releaseDate && <span className="text-xs text-textMuted">{track.releaseDate}</span>}
        </div>
      </div>
      <button className="p-1 text-textMuted hover:text-white transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100">
        <MoreHorizontal className="w-4 h-4" />
      </button>
    </div>
  </div>
  );
};


/** Radio station card – fetches a queue of tracks and plays them in order */
const RadioStationCard = ({ station }) => {
  const { playQueue, currentTrack, isPlaying, togglePlayPause, queue } = usePlayer();
  const { data: tracks, loading } = useGenreSearch(station.query, 20);
  const [loadingPlay, setLoadingPlay] = useState(false);

  // A station is "active" if any track in queue belongs to the station's query context
  const isActive = queue.length > 0 && tracks.some(t => t.trackId === currentTrack?.trackId);

  const handlePlay = async (e) => {
    e.stopPropagation();
    if (isActive) { togglePlayPause(); return; }
    if (loading || tracks.length === 0) return;
    setLoadingPlay(true);
    // Shuffle the queue so each listen feels fresh
    const shuffled = [...tracks].sort(() => Math.random() - 0.5);
    await playQueue(shuffled, 0);
    setLoadingPlay(false);
  };

  return (
    <div
      className={`glass-panel rounded-2xl p-5 border transition-all duration-300 card-hover group cursor-pointer flex items-center gap-4 ${
        isActive ? 'border-primary/40 shadow-lg shadow-primary/10' : 'border-white/5 hover:border-white/10'
      }`}
      onClick={handlePlay}
    >
      <div className="relative flex-shrink-0">
        <img src={station.cover} alt={station.name} className="w-16 h-16 rounded-xl object-cover shadow-lg" loading="lazy" />
        {/* Animated equaliser bars when active */}
        {isActive && isPlaying && (
          <div className="absolute inset-0 rounded-xl bg-black/50 flex items-center justify-center gap-0.5">
            {[...Array(4)].map((_, i) => (
              <span
                key={i}
                className="w-1 rounded-full bg-primary"
                style={{
                  height: `${Math.random() * 12 + 6}px`,
                  animation: `equalizerBar 0.${6 + i}s ease-in-out infinite alternate`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        )}
        {station.live && !isActive && (
          <span className="absolute -top-1 -right-1 text-[9px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full uppercase tracking-wider leading-none">LIVE</span>
        )}
        {isActive && (
          <span className="absolute -top-1 -right-1 text-[9px] font-bold bg-primary text-background px-1.5 py-0.5 rounded-full uppercase tracking-wider leading-none">ON AIR</span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className={`font-display font-bold text-base truncate transition-colors ${
          isActive ? 'text-primary' : 'group-hover:text-primary'
        }`}>{station.name}</h3>
        <p className="text-xs text-textMuted mt-0.5 truncate">{station.genre}</p>
        <div className="flex items-center gap-1.5 mt-2">
          <span className={`w-1.5 h-1.5 rounded-full ${isActive && isPlaying ? 'bg-primary animate-pulse' : 'bg-white/30'}`} />
          <span className="text-xs text-textMuted">
            {isActive && isPlaying ? 'Playing now' : `${station.listeners} listening`}
          </span>
        </div>
        {isActive && currentTrack && (
          <p className="text-xs text-primary/80 truncate mt-1 font-medium">
            {currentTrack.trackName} – {currentTrack.artistName}
          </p>
        )}
      </div>

      <button
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
          isActive
            ? 'bg-primary text-background opacity-100 hover:scale-105'
            : 'bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-background opacity-0 group-hover:opacity-100'
        }`}
        aria-label={isActive && isPlaying ? `Pause ${station.name}` : `Play ${station.name}`}
        disabled={loading || loadingPlay}
      >
        {loadingPlay ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isActive && isPlaying ? (
          <Pause className="w-4 h-4 fill-current" />
        ) : (
          <Play className="w-4 h-4 fill-current ml-0.5" />
        )}
      </button>
    </div>
  );
};

/** Genre modal – fetches songs for a specific genre query */
const GenreModal = ({ genre, onClose }) => {
  const { play, currentTrack, isPlaying, togglePlayPause } = usePlayer();
  const { data: tracks, loading } = useGenreSearch(genre.query, 25);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const Icon = genre.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-[#111113] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`relative p-6 rounded-t-2xl flex items-end gap-5 bg-gradient-to-br ${genre.gradient} shrink-0`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/40 rounded-full text-white/80 hover:text-white hover:bg-black/60 transition-all"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-lg flex-shrink-0">
            <Icon className="w-8 h-8 text-white" />
          </div>
          <div>
            <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1">Genre</p>
            <h2 className="font-display text-3xl font-bold text-white">{genre.label}</h2>
            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={() => { if (tracks.length > 0) play(tracks[0]); }}
                className="flex items-center gap-2 bg-white text-black font-bold text-sm px-5 py-2 rounded-full hover:scale-105 hover:bg-primary hover:text-white transition-all shadow-lg"
              >
                <Play className="w-4 h-4 fill-current" /> Play All
              </button>
              <span className="text-white/60 text-xs">{tracks.length} tracks</span>
            </div>
          </div>
        </div>

        {/* Track list */}
        <div className="flex-1 overflow-y-auto p-2">
          {loading ? (
            [...Array(8)].map((_, i) => <SkeletonRow key={i} />)
          ) : tracks.length > 0 ? (
            tracks.map((track, i) => {
              const isThisTrack = currentTrack?.trackId === track.trackId;
              return (
                <div
                  key={track.trackId || i}
                  onClick={() => { if (isThisTrack) togglePlayPause(); else play(track); }}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group"
                >
                  <div className="relative w-5 h-5 flex items-center justify-center flex-shrink-0">
                    <span className={`text-sm font-bold transition-opacity ${isThisTrack ? 'opacity-0' : 'text-textMuted group-hover:opacity-0'}`}>{i + 1}</span>
                    {isThisTrack && isPlaying
                      ? <Pause className="w-4 h-4 text-primary fill-current absolute" />
                      : <Play className={`w-4 h-4 fill-current absolute transition-opacity ${isThisTrack ? 'opacity-100 text-primary' : 'text-white opacity-0 group-hover:opacity-100'}`} />
                    }
                  </div>
                  <img
                    src={track.artworkUrl100}
                    alt={track.trackName}
                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0 shadow-md"
                    loading="lazy"
                  />
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-semibold truncate transition-colors ${isThisTrack ? 'text-primary' : 'group-hover:text-primary'}`}>{track.trackName}</p>
                    <p className="text-xs text-textMuted truncate">{track.artistName}</p>
                  </div>
                  <span className="text-xs text-textMuted tabular-nums flex-shrink-0">{formatDuration(track.trackTimeMillis)}</span>
                </div>
              );
            })
          ) : (
            <div className="py-16 text-center text-textMuted">
              <p>No tracks found for this genre.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Main page ────────────────────────────────────────────────────────────────

export const DiscoverPage = () => {
  const [searchQuery,    setSearchQuery]    = useState('');
  const [activeMood,     setActiveMood]     = useState(null);
  const [selectedGenre,  setSelectedGenre]  = useState(null);

  // API hooks
  const { data: topSongs,  loading: topLoading  } = useTopSongs(10);
  const { data: newReleases, loading: newLoading  } = useNewReleases(8);
  const { tracks: searchResults, loading: searchLoading } = useTrackSearch(
    activeMood ? `${activeMood.toLowerCase()} music` : searchQuery,
    20
  );

  const isSearching = searchQuery.trim().length > 0 || activeMood !== null;

  return (
    <div className="bg-background text-textMain font-sans antialiased min-h-screen">
      <Navbar />

      {/* ── Hero / Search ──────────────────────────────────────────────── */}
      <section id="discover-hero" className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden" aria-label="Discover">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[130px] -z-10 pointer-events-none animate-pulse-slow" />
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[120px] -z-10 pointer-events-none animate-pulse-slow" style={{ animationDelay: '2s' }} />

        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3 h-3" />AI-powered discovery
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Discover your{' '}
            <span className="text-gradient">next obsession</span>
          </h1>
          <p className="text-xl text-textMuted max-w-xl mx-auto mb-10">
            Explore genres, trending hits, and new releases. Search 100M+ songs — live from iTunes.
          </p>

          {/* Live search bar */}
          <div className="relative max-w-xl mx-auto">
            {searchLoading && isSearching
              ? <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-textMuted animate-spin" />
              : <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-textMuted pointer-events-none" />
            }
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setActiveMood(null); }}
              placeholder="Search artists, songs, albums…"
              className="w-full pl-12 pr-10 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-white placeholder:text-white/30 text-sm shadow-xl shadow-black/30"
              aria-label="Search music"
              id="discover-search"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-textMuted hover:text-white transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Mood pills */}
          <div className="flex flex-wrap justify-center gap-2.5 mt-8" aria-label="Browse by mood">
            {MOODS.map(({ label, emoji, color }) => (
              <button
                key={label}
                onClick={() => { setActiveMood(activeMood === label ? null : label); setSearchQuery(''); }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 hover:scale-105 ${
                  activeMood === label
                    ? `${color} scale-105 shadow-lg`
                    : 'bg-white/5 text-textMuted border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20'
                }`}
              >
                <span>{emoji}</span>{label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Live Search Results ────────────────────────────────────────── */}
      {isSearching && (
        <section id="search-results" className="py-8 px-4 sm:px-6 lg:px-8 bg-surface" aria-label="Search results">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="font-display font-bold text-2xl">
                {activeMood ? `${activeMood} Music` : `Results for "${searchQuery}"`}
              </h2>
              {searchLoading && <Loader2 className="w-5 h-5 text-textMuted animate-spin" />}
              {!searchLoading && <span className="text-sm text-textMuted">({searchResults.length} tracks)</span>}
            </div>

            {searchLoading && searchResults.length === 0 ? (
              <div className="space-y-1">
                {[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}
              </div>
            ) : searchResults.length > 0 ? (
              <div className="glass-panel rounded-2xl overflow-hidden border border-white/5">
                {searchResults.slice(0, 15).map((track, i) => (
                  <SearchResultRow key={track.trackId} track={track} index={i} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-textMuted">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium">No results found</p>
                <p className="text-sm mt-1">Try a different search term</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Browse Genres ──────────────────────────────────────────────── */}
      <section id="genres" className="py-16 px-4 sm:px-6 lg:px-8 bg-surface" aria-label="Browse by genre">
        <div className="max-w-7xl mx-auto">
          <SectionHeader label="Explore" title="Browse by Genre" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {GENRES.map((genre) => {
              const { label, icon: Icon, gradient, image } = genre;
              return (
                <button
                  key={label}
                  onClick={() => setSelectedGenre(genre)}
                  className="relative rounded-2xl overflow-hidden aspect-[4/2.5] group cursor-pointer card-hover shadow-lg shadow-black/40"
                  aria-label={`Browse ${label}`}
                >
                  <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" aria-hidden="true" loading="lazy" />
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-70 group-hover:opacity-80 transition-opacity`} />
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="relative z-10 h-full flex flex-col items-start justify-between p-4">
                    <Icon className="w-6 h-6 text-white/80" />
                    <span className="font-display font-bold text-lg text-white">{label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Trending Chart ─────────────────────────────────────────────── */}
      <section id="trending" className="py-16 px-4 sm:px-6 lg:px-8" aria-label="Trending now">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-10">
            <div>
              <p className="text-primary font-semibold text-xs uppercase tracking-widest mb-2">Hot Hits</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold">Trending Now</h2>
            </div>
            {topLoading && <Loader2 className="w-5 h-5 text-textMuted animate-spin mt-5" />}
          </div>

          <div className="glass-panel rounded-2xl overflow-hidden border border-white/5">
            {/* Header row */}
            <div className="grid grid-cols-[40px_1fr_auto] sm:grid-cols-[40px_1fr_160px_80px] items-center px-4 py-3 border-b border-white/5 text-xs font-semibold uppercase tracking-widest text-textMuted">
              <span>#</span>
              <span>Title</span>
              <span className="hidden sm:block">Album</span>
            </div>

            {topLoading
              ? [...Array(8)].map((_, i) => <SkeletonRow key={i} />)
              : topSongs.map((track, i) => (
                  <TrendingTableRow key={track.trackId} track={track} index={i} />
                ))
            }
          </div>
        </div>
      </section>

      {/* ── New Releases ───────────────────────────────────────────────── */}
      <section id="new-releases" className="py-16 px-4 sm:px-6 lg:px-8 bg-surface" aria-label="New releases">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-10">
            <div>
              <p className="text-primary font-semibold text-xs uppercase tracking-widest mb-2">Just Dropped</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold">New Releases</h2>
            </div>
            {newLoading && <Loader2 className="w-5 h-5 text-textMuted animate-spin mt-5" />}
          </div>

          <div className="glass-panel rounded-2xl overflow-hidden border border-white/5">
            {/* Header row */}
            <div className="grid grid-cols-[40px_1fr_auto] sm:grid-cols-[40px_1fr_160px_80px] items-center px-4 py-3 border-b border-white/5 text-xs font-semibold uppercase tracking-widest text-textMuted">
              <span>#</span>
              <span>Title</span>
              <span className="hidden sm:block">Album</span>
            </div>

            {newLoading
              ? [...Array(8)].map((_, i) => <SkeletonRow key={i} />)
              : newReleases.map((track, i) => (
                  <TrendingTableRow key={track.trackId} track={track} index={i} />
                ))
            }
          </div>
        </div>
      </section>

      {/* ── Radio Stations (static) ─────────────────────────────────────── */}
      <section id="radio" className="py-16 px-4 sm:px-6 lg:px-8" aria-label="Radio stations">
        <div className="max-w-7xl mx-auto">
          <SectionHeader label="Always on" title="Radio Stations" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {RADIO_STATIONS.map((station) => (
              <RadioStationCard key={station.name} station={station} />
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {/* ── Genre Modal ─────────────────────────────────────────── */}
      {selectedGenre && (
        <GenreModal genre={selectedGenre} onClose={() => setSelectedGenre(null)} />
      )}
    </div>
  );
};
