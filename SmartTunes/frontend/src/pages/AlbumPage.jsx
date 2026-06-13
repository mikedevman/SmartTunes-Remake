import React, { useState } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Play, Pause, Shuffle, Heart, MoreHorizontal,
  ChevronLeft, Clock, Loader2, AlertCircle, ExternalLink,
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useAlbum } from '../mock/mockData';
import { formatDuration, formatReleaseDate } from '../mock/mockData';
import { usePlayer } from '../components/PlayerContext';

// ─── Track row ────────────────────────────────────────────────────────────────

const TrackRow = ({ track, index, onPlay }) => {
  const { currentTrack, isPlaying, togglePlayPause } = usePlayer();
  const isActive = currentTrack?.trackId === track.trackId;

  return (
    <div
      onClick={() => {
        if (isActive) togglePlayPause();
        else onPlay(index);
      }}
      className={`grid grid-cols-[40px_1fr_auto] sm:grid-cols-[40px_1fr_180px_70px] items-center px-4 py-3 rounded-xl transition-all duration-150 cursor-pointer group ${
        isActive ? 'bg-primary/10 border border-primary/20' : 'hover:bg-white/5'
      }`}
    >
      {/* Number / play indicator */}
      <div className="w-6 h-6 flex items-center justify-center flex-shrink-0 relative">
        <span className={`text-sm font-bold tabular-nums transition-opacity absolute ${
          isActive ? 'opacity-0' : 'text-textMuted group-hover:opacity-0'
        }`}>
          {track.trackNumber ?? index + 1}
        </span>
        {isActive && isPlaying
          ? <Pause className="w-4 h-4 text-primary fill-current absolute" />
          : <Play className={`w-4 h-4 fill-current absolute transition-opacity ${
              isActive ? 'opacity-100 text-primary' : 'text-white opacity-0 group-hover:opacity-100'
            }`} />
        }
      </div>

      {/* Title + artist */}
      <div className="min-w-0 pr-4">
        <p className={`font-semibold text-sm truncate transition-colors ${
          isActive ? 'text-primary' : 'group-hover:text-primary'
        }`}>
          {track.trackName}
        </p>
        <p className="text-xs text-textMuted truncate mt-0.5">{track.artistName}</p>
      </div>

      {/* Album name (desktop) */}
      <span className="hidden sm:block text-xs text-textMuted truncate pr-4">
        {track.collectionName}
      </span>

      {/* Duration */}
      <span className="text-xs text-textMuted tabular-nums text-right">
        {formatDuration(track.trackTimeMillis)}
      </span>
    </div>
  );
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const SkeletonAlbum = () => (
  <div className="animate-pulse">
    <div className="h-[340px] bg-white/5 w-full mb-0" />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
      <div className="flex flex-col sm:flex-row gap-8 items-end mb-10">
        <div className="w-52 h-52 bg-white/10 rounded-2xl shadow-2xl flex-shrink-0" />
        <div className="space-y-3 flex-1 pb-2">
          <div className="h-3 w-20 bg-white/10 rounded" />
          <div className="h-10 w-64 bg-white/10 rounded" />
          <div className="h-4 w-40 bg-white/10 rounded" />
          <div className="h-3 w-32 bg-white/5 rounded" />
        </div>
      </div>
      <div className="space-y-2">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3">
            <div className="w-5 h-4 bg-white/5 rounded" />
            <div className="flex-1 h-3 bg-white/5 rounded" />
            <div className="w-10 h-3 bg-white/5 rounded" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── Main page ────────────────────────────────────────────────────────────────

export const AlbumPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { album, tracks, loading, error } = useAlbum(id);
  const { play, playQueue, currentTrack, isPlaying, togglePlayPause } = usePlayer();
  const [liked, setLiked] = useState(false);
  const [shuffleActive, setShuffleActive] = useState(false);

  const isAlbumPlaying =
    isPlaying && tracks.some((t) => t.trackId === currentTrack?.trackId);

  const handlePlayAll = () => {
    if (isAlbumPlaying) { togglePlayPause(); return; }
    playQueue(tracks, 0);
  };

  const handleShuffle = () => {
    setShuffleActive(true);
    const shuffled = [...tracks].sort(() => Math.random() - 0.5);
    playQueue(shuffled, 0);
  };

  const handleTrackPlay = (index) => {
    playQueue(tracks, index);
  };

  const year = album?.releaseDate
    ? new Date(album.releaseDate).getFullYear()
    : '';

  const totalDuration = tracks.reduce(
    (sum, t) => sum + (t.trackTimeMillis ?? 0),
    0
  );
  const totalMin = Math.round(totalDuration / 60000);

  return (
    <div className="bg-background text-textMain font-sans antialiased min-h-screen">
      <Navbar />

      {loading ? (
        <SkeletonAlbum />
      ) : error ? (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-textMuted pt-20">
          <AlertCircle className="w-12 h-12 text-red-400" />
          <p className="text-lg font-semibold">Couldn't load this album</p>
          <p className="text-sm">{error.message}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 btn-primary px-6 py-2 text-sm"
          >
            Go back
          </button>
        </div>
      ) : album ? (
        <>
          {/* ── Hero ──────────────────────────────────────────────────────── */}
          <div className="relative pt-20">
            {/* Blurred artwork background */}
            <div
              className="absolute inset-0 bg-cover bg-center blur-3xl scale-110 opacity-25 pointer-events-none"
              style={{ backgroundImage: `url(${album.artworkUrl100})` }}
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
              {/* Back button */}
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1.5 text-sm text-textMuted hover:text-white transition-colors mb-8 group"
              >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                Back
              </button>

              <div className="flex flex-col sm:flex-row gap-8 items-end">
                {/* Album art */}
                <div className="flex-shrink-0">
                  <img
                    src={album.artworkUrl100}
                    alt={album.collectionName}
                    className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl shadow-2xl shadow-black/70 object-cover"
                  />
                </div>

                {/* Meta */}
                <div className="flex-1 min-w-0 pb-2">
                  <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-2">
                    {album.primaryGenreName ?? 'Album'}
                  </p>
                  <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-3 truncate">
                    {album.collectionName}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-textMuted mb-6">
                    <RouterLink
                      to={tracks[0]?.artistId ? `/artist/${tracks[0].artistId}` : `/discover`}
                      className="font-semibold text-white hover:text-primary transition-colors"
                    >
                      {album.artistName}
                    </RouterLink>
                    {year && <><span>·</span><span>{year}</span></>}
                    {tracks.length > 0 && (
                      <><span>·</span><span>{tracks.length} songs</span></>
                    )}
                    {totalMin > 0 && (
                      <><span>·</span><span>{totalMin} min</span></>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handlePlayAll}
                      className="w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-xl shadow-primary/40 hover:scale-105 hover:bg-primaryHover transition-all"
                      aria-label={isAlbumPlaying ? 'Pause' : 'Play album'}
                    >
                      {isAlbumPlaying
                        ? <Pause className="w-6 h-6 text-background fill-current" />
                        : <Play className="w-6 h-6 text-background fill-current ml-1" />
                      }
                    </button>
                    <button
                      onClick={handleShuffle}
                      className={`p-3 rounded-full transition-all ${
                        shuffleActive
                          ? 'text-primary bg-primary/10'
                          : 'text-textMuted hover:text-white hover:bg-white/5'
                      }`}
                      aria-label="Shuffle"
                    >
                      <Shuffle className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setLiked((v) => !v)}
                      className={`p-3 rounded-full transition-all ${
                        liked
                          ? 'text-pink-400 bg-pink-400/10'
                          : 'text-textMuted hover:text-white hover:bg-white/5'
                      }`}
                      aria-label={liked ? 'Unlike' : 'Like album'}
                    >
                      <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                    </button>
                    {album.collectionViewUrl && (
                      <a
                        href={album.collectionViewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-full text-textMuted hover:text-white hover:bg-white/5 transition-all"
                        aria-label="Open in iTunes"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Track list ────────────────────────────────────────────────── */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-40">
            {/* Column headers */}
            <div className="grid grid-cols-[40px_1fr_auto] sm:grid-cols-[40px_1fr_180px_70px] items-center px-4 py-2 mb-2 border-b border-white/5 text-xs font-semibold uppercase tracking-widest text-textMuted">
              <span>#</span>
              <span>Title</span>
              <span className="hidden sm:block">Album</span>
              <span className="flex items-center justify-end gap-1">
                <Clock className="w-3.5 h-3.5" />
              </span>
            </div>

            {tracks.length > 0 ? (
              <div className="space-y-0.5 mt-2">
                {tracks.map((track, i) => (
                  <TrackRow
                    key={track.trackId ?? i}
                    track={track}
                    index={i}
                    onPlay={handleTrackPlay}
                  />
                ))}
              </div>
            ) : loading ? (
              <div className="py-20 text-center text-textMuted">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-white/20" />
                <p>Loading tracks…</p>
              </div>
            ) : (
              <div className="py-20 text-center text-textMuted">
                <p className="text-lg font-medium mb-2">No tracks available</p>
                <p className="text-sm">iTunes doesn't have a track list for this album.</p>
              </div>
            )}

            {/* Copyright / label info */}
            {album.copyright && (
              <p className="text-xs text-textMuted/40 mt-8 px-4">{album.copyright}</p>
            )}
          </div>
        </>
      ) : null}

      <Footer />
    </div>
  );
};
