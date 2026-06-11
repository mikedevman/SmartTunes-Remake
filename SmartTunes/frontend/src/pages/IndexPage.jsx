import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Play, Pause, SkipBack, SkipForward, Heart, Shuffle,
  ChevronLeft, ChevronRight, ArrowRight, Check, Star,
  Headphones, Music, Zap, Shield, Loader2, X,
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useTopSongs, useGenreSearch } from '../hooks/useItunesData';
import { usePlayer } from '../components/PlayerContext';
import { GLOW_COLORS, FALLBACK_COVERS, PLAYLIST_META, FEATURES, TESTIMONIALS } from '../data/mockData';

// ─── Small components ────────────────────────────────────────────────────────

const Tag = ({ children }) => (
  <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-black/40 text-white/80 border border-white/10 backdrop-blur-sm">
    {children}
  </span>
);

const SkeletonBox = ({ className }) => (
  <div className={`bg-white/5 animate-pulse rounded-2xl ${className}`} />
);

// ─── Playlist card ───────────────────────────────────────────────────────────

const PlaylistCard = ({ playlist, coverUrl, tracks, loading, onClick }) => {
  const { play, playQueue } = usePlayer();

  return (
  <div className="group cursor-pointer card-hover" onClick={() => onClick({ ...playlist, coverUrl, tracks })}>
    <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 shadow-lg shadow-black/40">
      {loading ? (
        <SkeletonBox className="w-full h-full rounded-none" />
      ) : (
        <img
          src={coverUrl || playlist.fallback}
          alt={playlist.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
          onError={(e) => { e.currentTarget.src = playlist.fallback; }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      <div className="absolute inset-0 flex items-end justify-between p-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <Tag>{playlist.tag}</Tag>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (tracks && tracks.length > 0) playQueue(tracks, 0);
          }}
          className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-xl shadow-primary/40 transform translate-y-3 group-hover:translate-y-0 transition-all duration-300 hover:scale-110 hover:bg-primaryHover"
          aria-label={`Play ${playlist.title}`}
        >
          <Play className="w-5 h-5 text-background fill-current ml-0.5" />
        </button>
      </div>
    </div>
    <h3 className="font-display font-bold text-base group-hover:text-primary transition-colors duration-200 truncate">{playlist.title}</h3>
    <p className="text-sm text-textMuted mt-0.5">{playlist.description}</p>
    <p className="text-xs text-textMuted/60 mt-1">{playlist.tracks}</p>
  </div>
  );
};

// ─── Trending track row ───────────────────────────────────────────────────────

const TrendingRow = ({ track, rank, queueTracks = [], index = 0 }) => {
  const { play, playQueue, currentTrack, isPlaying, togglePlayPause } = usePlayer();
  const isThisTrack = currentTrack?.trackId === track.trackId;

  return (
  <div
    className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group"
    onClick={() => {
      if (isThisTrack) togglePlayPause();
      else if (queueTracks.length > 0) playQueue(queueTracks, index);
      else play(track);
    }}
  >
    <div className="relative w-5 h-5 flex items-center justify-center flex-shrink-0">
      <span className={`text-sm font-bold text-center transition-opacity ${isThisTrack ? 'opacity-0' : 'text-textMuted group-hover:opacity-0'}`}>{rank}</span>
      {isThisTrack && isPlaying ? <Pause className="w-4 h-4 text-primary fill-current absolute" /> : <Play className={`w-4 h-4 text-white fill-current absolute transition-opacity ${isThisTrack ? 'opacity-100 text-primary' : 'opacity-0 group-hover:opacity-100'}`} />}
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
    {track.primaryGenreName && (
      <span className="hidden sm:block text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-textMuted flex-shrink-0">
        {track.primaryGenreName}
      </span>
    )}
  </div>
  );
};

// ─── Main page ────────────────────────────────────────────────────────────────

export const IndexPage = () => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying,        setIsPlaying]        = useState(false);
  const [progress,         setProgress]         = useState(33);
  const [isLiked,          setIsLiked]          = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  // ── API data ──
  const { data: topSongs,  loading: topLoading  } = useTopSongs(8);
  const { data: ambient  } = useGenreSearch('ambient focus instrumental', 20);
  const { data: cityPop  } = useGenreSearch('city pop japanese 80s funk', 20);
  const { data: workout  } = useGenreSearch('workout gym energy hits', 20);
  const { data: jazz     } = useGenreSearch('smooth jazz saxophone night', 20);
  
  const playlistDataList = [ambient, cityPop, workout, jazz];

  // ── Derived data ──
  const carouselSongs = topSongs.length >= 3
    ? topSongs.slice(0, 3).map((t, i) => ({
        ...t,
        title:  t.trackName,
        artist: t.artistName,
        album:  t.collectionName,
        cover:  t.artworkUrl100,
        color:  GLOW_COLORS[i % GLOW_COLORS.length],
      }))
    : [
        { title: 'Midnight City',  artist: 'M83',       album: "Hurry Up, We're Dreaming", cover: FALLBACK_COVERS[0], color: GLOW_COLORS[0] },
        { title: 'Starboy',        artist: 'The Weeknd', album: 'Starboy',                   cover: FALLBACK_COVERS[1], color: GLOW_COLORS[1] },
        { title: 'Levitating',     artist: 'Dua Lipa',  album: 'Future Nostalgia',           cover: FALLBACK_COVERS[2], color: GLOW_COLORS[2] },
      ];

  const genreCovers = playlistDataList.map(data => data[0]?.artworkUrl100);

  const trendingTracks = topSongs.slice(3, 8); // songs 4-8 for trending strip

  // ── Carousel auto-advance ──
  useEffect(() => {
    const id = setInterval(() => setCurrentSongIndex(p => (p + 1) % carouselSongs.length), 5000);
    return () => clearInterval(id);
  }, [carouselSongs.length]);

  const nextSong = () => setCurrentSongIndex(p => (p + 1) % carouselSongs.length);
  const prevSong = () => setCurrentSongIndex(p => (p - 1 + carouselSongs.length) % carouselSongs.length);
  const currentSong = carouselSongs[currentSongIndex] ?? carouselSongs[0];
  
  const { play, playQueue, currentTrack, isPlaying: globalIsPlaying, togglePlayPause, progress: globalProgress, seek } = usePlayer();
  const isCurrentSongPlaying = currentTrack?.trackId && currentSong?.trackId === currentTrack?.trackId;

  const formatTime = (pct, total = 30) => {
    const s = Math.round((pct / 100) * total);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  };

  return (
    <div className="bg-background text-textMain font-sans antialiased min-h-screen">
      <Navbar />

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section id="hero" className="relative min-h-screen flex items-center pt-20 overflow-hidden" aria-label="Hero section">
        {/* Dynamic glow that matches current song */}
        <div
          className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-[140px] -z-10 pointer-events-none transition-colors duration-1000"
          style={{ backgroundColor: currentSong?.color ?? GLOW_COLORS[0] }}
        />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent/15 rounded-full blur-[120px] -z-10 pointer-events-none animate-pulse-slow" style={{ animationDelay: '2s' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid lg:grid-cols-2 gap-16 items-center py-16">

          {/* Left: copy */}
          <div className="space-y-8 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Now streaming · 100M+ songs
            </div>
            <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight">
              Feel the<br />
              <span className="text-gradient">Rhythm.</span>
            </h1>
            <p className="text-xl text-textMuted max-w-lg leading-relaxed">
              Stream in high-fidelity audio. Read and play interactive sheet music.
              Discover new favorites — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <RouterLink to="/auth" className="btn-primary px-8 py-4 text-lg flex items-center justify-center gap-2 group" id="hero-cta-start">
                Start Listening Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </RouterLink>
              <RouterLink to="/scores" className="btn-ghost px-8 py-4 text-lg flex items-center justify-center gap-2 text-white" id="hero-cta-scores">
                <Music className="w-5 h-5 text-primary" />
                Explore Scores
              </RouterLink>
            </div>
            {/* Social proof */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex -space-x-3">
                {TESTIMONIALS.map((t, i) => (
                  <img key={i} src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full border-2 border-background object-cover" />
                ))}
              </div>
              <div>
                <p className="text-sm text-textMuted"><span className="text-white font-bold">10M+</span> active listeners</p>
                <div className="flex items-center gap-1 mt-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />)}
                  <span className="text-xs text-textMuted ml-1">4.9/5</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: player card */}
          <div className="relative animate-float" aria-label="Demo music player">
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-primary to-accent rounded-full blur-2xl opacity-30 pointer-events-none" />
            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-accent/20 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center gap-3 mb-5">
              <span className="flex-1 h-px bg-white/10" />
              <p className="text-xs font-semibold uppercase tracking-widest text-white/40 px-2">
                {topLoading ? 'Loading chart…' : 'Top charts right now'}
              </p>
              <span className="flex-1 h-px bg-white/10" />
            </div>

            {/* Player card */}
            <div className="glass-panel rounded-3xl p-6 shadow-2xl shadow-black/60 min-w-[300px] max-w-[400px] mx-auto">
              {/* Album art */}
              <div className="relative group rounded-2xl overflow-hidden mb-5 shadow-xl aspect-square">
                {topLoading ? (
                  <SkeletonBox className="w-full h-full rounded-none" />
                ) : (
                  <div className="flex transition-transform duration-500 ease-in-out h-full" style={{ transform: `translateX(-${currentSongIndex * 100}%)` }}>
                    {carouselSongs.map((song, i) => (
                      <div key={i} className="min-w-full h-full">
                        <img
                          src={song.cover}
                          alt={song.title}
                          className={`w-full h-full object-cover transition-transform duration-700 ${i === currentSongIndex ? 'group-hover:scale-105' : ''}`}
                          onError={(e) => { e.currentTarget.src = FALLBACK_COVERS[i % FALLBACK_COVERS.length]; }}
                        />
                      </div>
                    ))}
                  </div>
                )}
                {/* Arrow controls */}
                <div className="absolute inset-0 flex items-center justify-between px-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={prevSong} className="p-2 rounded-full bg-black/60 text-white hover:bg-white/20 transition-all backdrop-blur-sm" aria-label="Previous"><ChevronLeft className="w-4 h-4" /></button>
                  <button onClick={nextSong} className="p-2 rounded-full bg-black/60 text-white hover:bg-white/20 transition-all backdrop-blur-sm" aria-label="Next"><ChevronRight className="w-4 h-4" /></button>
                </div>
                {/* Dots */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {carouselSongs.map((_, i) => (
                    <button key={i} onClick={() => setCurrentSongIndex(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${i === currentSongIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/30 hover:bg-white/50'}`}
                      aria-label={`Song ${i + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Track info */}
              <div className="flex justify-between items-start mb-5 min-h-[56px]">
                <div className="animate-in" key={currentSongIndex}>
                  {topLoading ? (
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-white/10 rounded animate-pulse" />
                      <div className="h-3 w-20 bg-white/5 rounded animate-pulse" />
                    </div>
                  ) : (
                    <>
                      <h3 className="font-display font-bold text-xl mb-0.5 truncate max-w-[200px]">{currentSong?.title}</h3>
                      <p className="text-textMuted text-sm">{currentSong?.artist}</p>
                      <p className="text-textMuted/60 text-xs truncate max-w-[200px]">{currentSong?.album}</p>
                    </>
                  )}
                </div>
                <button
                  onClick={() => setIsLiked(v => !v)}
                  className={`p-2 rounded-full transition-all duration-200 ${isLiked ? 'text-accentPink scale-110' : 'text-textMuted hover:text-white hover:scale-110'}`}
                  aria-label={isLiked ? 'Unlike' : 'Like'}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Progress bar */}
              <div className="mb-5">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-textMuted tabular-nums min-w-[32px] text-right">{formatTime(isCurrentSongPlaying ? globalProgress : 0, currentSong?.trackTimeMillis ? Math.min(30, currentSong.trackTimeMillis / 1000) : 30)}</span>
                  <div
                    className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden cursor-pointer group/bar relative"
                    onClick={(e) => {
                      if (!isCurrentSongPlaying) return;
                      const rect = e.currentTarget.getBoundingClientRect();
                      seek(Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)));
                    }}
                  >
                    <div className="h-full bg-primary rounded-full relative transition-all duration-100" style={{ width: `${isCurrentSongPlaying ? globalProgress : 0}%` }}>
                      <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full opacity-0 group-hover/bar:opacity-100 transition-opacity shadow-md" />
                    </div>
                  </div>
                  <span className="text-xs text-textMuted tabular-nums min-w-[32px]">0:30</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <button className="text-textMuted hover:text-white transition-colors p-1" aria-label="Shuffle"><Shuffle className="w-4 h-4" /></button>
                <button onClick={prevSong} className="text-white hover:text-primary transition-colors p-1" aria-label="Previous"><SkipBack className="w-7 h-7 fill-current" /></button>
                <button
                  onClick={() => {
                    if (isCurrentSongPlaying) togglePlayPause();
                    else if (currentSong) play(currentSong);
                  }}
                  className="w-14 h-14 bg-white text-background rounded-full flex items-center justify-center hover:scale-110 hover:bg-primary transition-all duration-200 shadow-lg shadow-white/10"
                  aria-label={isCurrentSongPlaying && globalIsPlaying ? 'Pause' : 'Play'}
                >
                  {isCurrentSongPlaying && globalIsPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
                </button>
                <button onClick={nextSong} className="text-white hover:text-primary transition-colors p-1" aria-label="Next"><SkipForward className="w-7 h-7 fill-current" /></button>
                <button className="text-textMuted hover:text-white transition-colors p-1" aria-label="Queue">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h10v2H4z" /></svg>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-textMuted/40 animate-bounce pointer-events-none">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <ChevronRight className="w-4 h-4 rotate-90" />
        </div>
      </section>

      {/* ── Trending Now strip ──────────────────────────────────────────── */}
      {(topLoading || trendingTracks.length > 0) && (
        <section id="trending" className="py-12 border-b border-white/5" aria-label="Trending now">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <h2 className="font-display font-bold text-xl">Trending Right Now</h2>
                {topLoading && <Loader2 className="w-4 h-4 text-textMuted animate-spin" />}
              </div>
              <RouterLink to="/discover" className="text-sm text-textMuted hover:text-white transition-colors flex items-center gap-1 group">
                See all <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </RouterLink>
            </div>

            {topLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 px-4 py-3 rounded-xl">
                    <div className="w-5 h-5 bg-white/5 rounded animate-pulse" />
                    <div className="w-10 h-10 bg-white/5 rounded-lg animate-pulse flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-white/5 rounded animate-pulse w-3/4" />
                      <div className="h-2 bg-white/5 rounded animate-pulse w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
                {trendingTracks.map((track, i) => (
                  <TrendingRow key={track.trackId} track={track} rank={i + 4} queueTracks={trendingTracks} index={i} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Curated Playlists ─────────────────────────────────────────── */}
      <section id="playlists" className="py-24 bg-surface relative overflow-hidden" aria-label="Curated playlists">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle at 25% 50%, #a78bfa 0%, transparent 50%), radial-gradient(circle at 75% 50%, #ec4899 0%, transparent 50%)'
        }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="text-primary font-semibold text-xs uppercase tracking-widest mb-2">Handpicked for you</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold">Curated For You</h2>
              <p className="text-textMuted mt-2 text-lg">Hand-picked playlists based on your vibe.</p>
            </div>
            <RouterLink to="/discover" className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-white hover:text-primary transition-colors group">
              View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </RouterLink>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {PLAYLIST_META.map((playlist, i) => (
              <PlaylistCard
                key={playlist.title}
                playlist={{ ...playlist, fallback: FALLBACK_COVERS[i] }}
                coverUrl={genreCovers[i]}
                tracks={playlistDataList[i]}
                loading={!genreCovers[i]}
                onClick={setSelectedPlaylist}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Artist Spotlight ─────────────────────────────────────────── */}
      <section id="spotlight" className="py-24 relative overflow-hidden" aria-label="Artist spotlight">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=2000&q=80" alt="" className="w-full h-full object-cover opacity-25" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            <p className="text-primary font-bold tracking-widest uppercase mb-4 text-sm">Artist Spotlight</p>
            <h2 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight">The Weeknd</h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Experience the new era of pop. Listen to the exclusive release of &quot;After Hours&quot; in spatial audio — only on SmartTunes.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="btn-primary px-8 py-3 flex items-center gap-2"><Play className="w-5 h-5 fill-current" />Play Latest Album</button>
              <button className="btn-ghost px-8 py-3 text-white">Follow Artist</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────── */}
      <section id="features" className="py-24 bg-surface" aria-label="Features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">Why SmartTunes</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">Everything you need</h2>
            <p className="text-textMuted text-lg max-w-xl mx-auto">Built for music lovers and musicians alike.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, description, color, bg }) => (
              <div key={title} className="glass-panel rounded-2xl p-6 card-hover group border border-white/5 hover:border-white/10">
                <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <h3 className="font-display font-bold text-lg mb-2">{title}</h3>
                <p className="text-sm text-textMuted leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────────── */}
      <section id="testimonials" className="py-24 relative overflow-hidden" aria-label="Testimonials">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">Loved by listeners</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold">What people say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="glass-panel rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all duration-300 card-hover">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => <Star key={j} className="w-4 h-4 text-yellow-400 fill-current" />)}
                </div>
                <p className="text-textMuted text-sm leading-relaxed mb-6 italic">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-textMuted">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Premium CTA ───────────────────────────────────────────────── */}
      <section id="premium" className="py-24 bg-black relative overflow-hidden" aria-label="Premium plan">
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-accent/8 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="glass-panel rounded-3xl p-10 md:p-20 text-center relative overflow-hidden border border-white/8 max-w-4xl mx-auto">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-6">
              <Zap className="w-3 h-3" />Limited Time Offer
            </div>
            <h2 className="font-display text-4xl md:text-6xl font-bold mb-5">Unlock Premium Sound</h2>
            <p className="text-xl text-textMuted max-w-2xl mx-auto mb-10 leading-relaxed">
              Ad-free listening, offline playback, and high-fidelity audio. Cancel anytime.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-10 mb-12">
              {['Ad-free music', 'Offline playback', 'Hi-Fi Audio', 'Sheet Music'].map(feat => (
                <div key={feat} className="flex items-center gap-2 text-sm font-medium">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-primary" strokeWidth={3} />
                  </div>
                  {feat}
                </div>
              ))}
            </div>
            <RouterLink to="/auth" className="inline-flex items-center gap-2 btn-primary px-12 py-4 text-lg" id="premium-cta">
              Get 3 Months Free <ArrowRight className="w-5 h-5" />
            </RouterLink>
            <p className="mt-4 text-xs text-textMuted">Individual plan only. $9.99/month after. Terms apply.</p>
          </div>
        </div>
      </section>

      <Footer />

      {/* ── Playlist Modal ──────────────────────────────────────────────── */}
      {selectedPlaylist && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedPlaylist(null)}
        >
          <div
            className="bg-[#111113] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="relative p-6 border-b border-white/5 flex flex-col sm:flex-row gap-6 items-start sm:items-end shrink-0 bg-gradient-to-b from-white/5 to-transparent rounded-t-2xl">
              <button
                onClick={() => setSelectedPlaylist(null)}
                className="absolute top-4 right-4 p-2 bg-black/40 rounded-full text-textMuted hover:text-white hover:bg-black/60 transition-all"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={selectedPlaylist.coverUrl || selectedPlaylist.fallback}
                alt={selectedPlaylist.title}
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-xl object-cover shadow-xl shadow-black/50 flex-shrink-0"
              />
              <div className="flex-1 min-w-0 pr-8">
                <Tag>{selectedPlaylist.tag}</Tag>
                <h2 className="font-display text-2xl sm:text-3xl font-bold mt-2 mb-1">{selectedPlaylist.title}</h2>
                <p className="text-textMuted text-sm">{selectedPlaylist.description}</p>
                <div className="flex items-center gap-4 mt-4">
                  <button
                    onClick={() => {
                      if (selectedPlaylist.tracks?.length > 0) playQueue(selectedPlaylist.tracks, 0);
                    }}
                    className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-xl hover:scale-105 hover:bg-primaryHover transition-all"
                    aria-label={`Play ${selectedPlaylist.title}`}
                  >
                    <Play className="w-5 h-5 text-background fill-current ml-0.5" />
                  </button>
                  <span className="text-xs font-semibold tracking-widest uppercase text-textMuted/60">
                    {selectedPlaylist.tracks?.length || 0} tracks
                  </span>
                </div>
              </div>
            </div>

            {/* Track list */}
            <div className="flex-1 overflow-y-auto p-2">
              {selectedPlaylist.tracks && selectedPlaylist.tracks.length > 0 ? (
                selectedPlaylist.tracks.map((track, i) => (
                  <TrendingRow key={track.trackId || i} track={track} rank={i + 1} queueTracks={selectedPlaylist.tracks} index={i} />
                ))
              ) : (
                <div className="p-12 flex flex-col items-center justify-center text-center text-textMuted">
                  <Loader2 className="w-8 h-8 animate-spin mb-4 text-white/20" />
                  <p>Loading tracks…</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
