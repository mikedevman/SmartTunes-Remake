import React, { useState } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Play, Pause, Shuffle, Heart, ChevronLeft,
  Clock, Loader2, AlertCircle, ExternalLink, Music2,
  Disc3, Users,
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useArtist } from '../mock/mockData';
import { formatDuration } from '../mock/mockData';
import { usePlayer } from '../components/PlayerContext';

// ─── Gradient palette cycled by artistId ─────────────────────────────────────

const GRADIENTS = [
  'from-violet-600 via-purple-700 to-indigo-900',
  'from-rose-600 via-pink-700 to-purple-900',
  'from-cyan-600 via-blue-700 to-indigo-900',
  'from-amber-500 via-orange-600 to-rose-800',
  'from-emerald-500 via-teal-600 to-cyan-900',
  'from-fuchsia-600 via-pink-700 to-rose-900',
];

// ─── Top Song Row ─────────────────────────────────────────────────────────────

const SongRow = ({ track, index, onPlay }) => {
  const { currentTrack, isPlaying, togglePlayPause } = usePlayer();
  const isActive = currentTrack?.trackId === track.trackId;

  return (
    <div
      onClick={() => isActive ? togglePlayPause() : onPlay(index)}
      className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all cursor-pointer group ${
        isActive ? 'bg-primary/10 border border-primary/20' : 'hover:bg-white/5'
      }`}
    >
      {/* Index / play */}
      <div className="w-6 h-6 flex items-center justify-center flex-shrink-0 relative">
        <span className={`text-sm font-bold tabular-nums absolute transition-opacity ${
          isActive ? 'opacity-0' : 'text-textMuted group-hover:opacity-0'
        }`}>{index + 1}</span>
        {isActive && isPlaying
          ? <Pause className="w-4 h-4 text-primary fill-current absolute" />
          : <Play className={`w-4 h-4 fill-current absolute transition-opacity ${
              isActive ? 'opacity-100 text-primary' : 'text-white opacity-0 group-hover:opacity-100'
            }`} />
        }
      </div>

      {/* Artwork */}
      <img
        src={track.artworkUrl100}
        alt={track.trackName}
        className="w-10 h-10 rounded-lg object-cover flex-shrink-0 shadow-md"
        loading="lazy"
      />

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className={`text-sm font-semibold truncate transition-colors ${
          isActive ? 'text-primary' : 'group-hover:text-primary'
        }`}>{track.trackName}</p>
        <p className="text-xs text-textMuted truncate">{track.collectionName}</p>
      </div>

      {/* Genre pill */}
      {track.primaryGenreName && (
        <span className="hidden sm:block text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-textMuted flex-shrink-0">
          {track.primaryGenreName}
        </span>
      )}

      {/* Duration */}
      <span className="text-xs text-textMuted tabular-nums flex-shrink-0">
        {formatDuration(track.trackTimeMillis)}
      </span>
    </div>
  );
};

// ─── Album card ───────────────────────────────────────────────────────────────

const AlbumCard = ({ album }) => {
  const navigate = useNavigate();
  const year = album.releaseDate ? new Date(album.releaseDate).getFullYear() : '';

  return (
    <div
      onClick={() => navigate(`/album/${album.collectionId}`)}
      className="group cursor-pointer card-hover"
    >
      <div className="relative aspect-square rounded-2xl overflow-hidden mb-3 shadow-lg shadow-black/40">
        <img
          src={album.artworkUrl100}
          alt={album.collectionName}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
          onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=400&q=80'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-3 right-3 w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <Play className="w-4 h-4 text-background fill-current ml-0.5" />
        </div>
      </div>
      <h3 className="font-display font-bold text-sm truncate group-hover:text-primary transition-colors">
        {album.collectionName}
      </h3>
      <p className="text-xs text-textMuted mt-0.5">{year}{album.primaryGenreName ? ` · ${album.primaryGenreName}` : ''}</p>
    </div>
  );
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const Skeleton = ({ className }) => (
  <div className={`bg-white/5 animate-pulse rounded-xl ${className}`} />
);

// ─── Main page ────────────────────────────────────────────────────────────────

export const ArtistPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { artist, topSongs, albums, loading, error } = useArtist(id);
  const { playQueue, currentTrack, isPlaying, togglePlayPause } = usePlayer();
  const [liked, setLiked] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const gradient = GRADIENTS[parseInt(id ?? '0', 10) % GRADIENTS.length];

  const isArtistPlaying =
    isPlaying && topSongs.some((t) => t.trackId === currentTrack?.trackId);

  const handlePlay = () => {
    if (isArtistPlaying) { togglePlayPause(); return; }
    if (topSongs.length > 0) playQueue(topSongs, 0);
  };

  const handleShuffle = () => {
    const shuffled = [...topSongs].sort(() => Math.random() - 0.5);
    playQueue(shuffled, 0);
  };

  const displayedSongs = showAll ? topSongs : topSongs.slice(0, 10);

  return (
    <div className="bg-background text-textMain font-sans antialiased min-h-screen">
      <Navbar />

      {loading ? (
        /* ── Skeleton ─────────────────────────────────────────────────────── */
        <div className="pt-20 animate-pulse">
          <div className={`h-64 bg-gradient-to-b ${gradient} opacity-30`} />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
            <div className="flex items-end gap-6 mb-10">
              <div className="w-32 h-32 rounded-full bg-white/10 flex-shrink-0" />
              <div className="space-y-3 pb-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-12 w-56" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
            <div className="space-y-2">
              {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
            </div>
          </div>
        </div>
      ) : error ? (
        /* ── Error ────────────────────────────────────────────────────────── */
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-textMuted pt-20">
          <AlertCircle className="w-12 h-12 text-red-400" />
          <p className="text-lg font-semibold">Couldn't load this artist</p>
          <p className="text-sm">{error.message}</p>
          <button onClick={() => navigate(-1)} className="mt-4 btn-primary px-6 py-2 text-sm">Go back</button>
        </div>
      ) : (
        <>
          {/* ── Hero ────────────────────────────────────────────────────────── */}
          <div className="relative pt-20">
            {/* Gradient backdrop */}
            <div className={`absolute inset-0 bg-gradient-to-b ${gradient} opacity-20 pointer-events-none`} />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/70 to-background pointer-events-none" />

            {/* Subtle texture orbs */}
            <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-10 right-1/3 w-64 h-64 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
              {/* Back */}
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1.5 text-sm text-textMuted hover:text-white transition-colors mb-8 group"
              >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                Back
              </button>

              <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-end">
                {/* Artist avatar — fallback to initials if no artwork */}
                <div className={`w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden bg-gradient-to-br ${gradient} flex items-center justify-center shadow-2xl shadow-black/60 flex-shrink-0 border-4 border-white/10`}>
                  {artist?.avatar ? (
                    <img
                      src={artist.avatar}
                      alt={artist.artistName}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-5xl sm:text-6xl font-display font-black text-white select-none">
                      {(artist?.artistName ?? '?').charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Meta */}
                <div className="flex-1 min-w-0 text-center sm:text-left pb-2">
                  <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-2">Artist</p>
                  <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-black leading-none mb-3 truncate">
                    {artist?.artistName ?? 'Unknown Artist'}
                  </h1>

                  <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 text-sm text-textMuted mb-6">
                    {artist?.primaryGenreName && (
                      <span className="px-3 py-1 rounded-full bg-white/8 border border-white/10 text-xs font-medium">
                        {artist.primaryGenreName}
                      </span>
                    )}
                    {albums.length > 0 && (
                      <span className="flex items-center gap-1.5">
                        <Disc3 className="w-3.5 h-3.5" />
                        {albums.length} albums
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex justify-center sm:justify-start items-center gap-4">
                    <button
                      onClick={handlePlay}
                      disabled={topSongs.length === 0}
                      className="w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-xl shadow-primary/40 hover:scale-105 hover:bg-primaryHover transition-all disabled:opacity-50"
                      aria-label={isArtistPlaying ? 'Pause' : 'Play top songs'}
                    >
                      {isArtistPlaying
                        ? <Pause className="w-6 h-6 text-background fill-current" />
                        : <Play className="w-6 h-6 text-background fill-current ml-1" />
                      }
                    </button>
                    <button
                      onClick={handleShuffle}
                      disabled={topSongs.length === 0}
                      className="p-3 rounded-full text-textMuted hover:text-white hover:bg-white/5 transition-all disabled:opacity-50"
                      aria-label="Shuffle"
                    >
                      <Shuffle className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setLiked((v) => !v)}
                      className={`p-3 rounded-full transition-all ${
                        liked ? 'text-pink-400 bg-pink-400/10' : 'text-textMuted hover:text-white hover:bg-white/5'
                      }`}
                      aria-label={liked ? 'Unlike' : 'Like artist'}
                    >
                      <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-40 space-y-16">

            {/* ── Top Songs ───────────────────────────────────────────────── */}
            {topSongs.length > 0 && (
              <section aria-label="Top songs">
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <p className="text-primary font-semibold text-xs uppercase tracking-widest mb-1">Popular</p>
                    <h2 className="font-display text-2xl sm:text-3xl font-bold">Top Songs</h2>
                  </div>
                  {topSongs.length > 10 && (
                    <button
                      onClick={() => setShowAll((v) => !v)}
                      className="text-sm font-semibold text-textMuted hover:text-white transition-colors"
                    >
                      {showAll ? 'Show less' : `See all ${topSongs.length}`}
                    </button>
                  )}
                </div>

                {/* Column headers */}
                <div className="flex items-center gap-4 px-4 py-2 border-b border-white/5 text-xs font-semibold uppercase tracking-widest text-textMuted mb-1">
                  <span className="w-6">#</span>
                  <span className="w-10 flex-shrink-0" />
                  <span className="flex-1">Title</span>
                  <span className="hidden sm:block text-right">
                    <Clock className="w-3.5 h-3.5 inline" />
                  </span>
                </div>

                <div className="space-y-0.5">
                  {displayedSongs.map((track, i) => (
                    <SongRow
                      key={track.trackId ?? i}
                      track={track}
                      index={i}
                      onPlay={(idx) => playQueue(showAll ? topSongs : topSongs.slice(0, 10), idx)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* ── Discography ─────────────────────────────────────────────── */}
            {albums.length > 0 && (
              <section aria-label="Discography">
                <p className="text-primary font-semibold text-xs uppercase tracking-widest mb-1">Discography</p>
                <h2 className="font-display text-2xl sm:text-3xl font-bold mb-6">Albums</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                  {albums.map((album) => (
                    <AlbumCard key={album.collectionId} album={album} />
                  ))}
                </div>
              </section>
            )}

            {/* Empty state */}
            {!loading && topSongs.length === 0 && albums.length === 0 && (
              <div className="py-24 text-center text-textMuted">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium">No data available for this artist</p>
              </div>
            )}
          </div>
        </>
      )}

      <Footer />
    </div>
  );
};
