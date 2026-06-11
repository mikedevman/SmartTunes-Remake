import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Upload, Play, Pause, Trash2, Music2, MoreHorizontal,
  TrendingUp, Clock, Disc3, Settings, LogOut, Plus,
  Edit2, ExternalLink, Mic2, BarChart2, Heart, Eye,
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { useArtist } from '../components/ArtistContext';
import { usePlayer } from '../components/PlayerContext';
import { formatDuration } from '../utils/itunesApi';

// ─── Stat card ────────────────────────────────────────────────────────────────

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="glass-panel rounded-2xl p-5 border border-white/8">
    <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
      <Icon className="w-5 h-5" />
    </div>
    <p className="text-2xl font-display font-black">{value}</p>
    <p className="text-sm text-textMuted mt-0.5">{label}</p>
  </div>
);

// ─── Song row ─────────────────────────────────────────────────────────────────

const SongRow = ({ song, index, onDelete }) => {
  const { play, currentTrack, isPlaying, togglePlayPause } = usePlayer();
  const [menuOpen, setMenuOpen] = useState(false);
  const isActive = currentTrack?.trackId === song.id || currentTrack?.previewUrl === song.audioUrl;

  const handlePlay = () => {
    if (isActive) { togglePlayPause(); return; }
    play({
      trackId:      song.id,
      trackName:    song.title,
      artistName:   song.artistName,
      artworkUrl100: song.coverUrl || `https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=400&q=80`,
      previewUrl:   song.audioUrl,
      primaryGenreName: song.genre,
    });
  };

  return (
    <div className={`group flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${
      isActive ? 'bg-primary/10 border border-primary/20' : 'hover:bg-white/5'
    }`}>
      {/* Index / play button */}
      <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 relative cursor-pointer" onClick={handlePlay}>
        <span className={`text-sm font-bold text-textMuted absolute transition-opacity ${isActive ? 'opacity-0' : 'group-hover:opacity-0'}`}>
          {index + 1}
        </span>
        {isActive && isPlaying
          ? <Pause className="w-4 h-4 text-primary fill-current" />
          : <Play className={`w-4 h-4 fill-current absolute transition-opacity ${isActive ? 'opacity-100 text-primary' : 'text-white opacity-0 group-hover:opacity-100'}`} />
        }
      </div>

      {/* Cover */}
      {song.coverUrl ? (
        <img src={song.coverUrl} alt={song.title} className="w-11 h-11 rounded-lg object-cover flex-shrink-0 shadow-md" />
      ) : (
        <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center flex-shrink-0">
          <Music2 className="w-5 h-5 text-primary" />
        </div>
      )}

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className={`font-semibold text-sm truncate ${isActive ? 'text-primary' : ''}`}>{song.title}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-textMuted">{song.genre}</span>
          {song.isExplicit && (
            <span className="text-[10px] font-bold bg-textMuted/20 text-textMuted px-1.5 py-0.5 rounded">E</span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="hidden sm:flex items-center gap-6 text-xs text-textMuted flex-shrink-0">
        <span className="flex items-center gap-1">
          <Eye className="w-3.5 h-3.5" />{song.plays ?? 0}
        </span>
        <span className="flex items-center gap-1">
          <Heart className="w-3.5 h-3.5" />{song.likes ?? 0}
        </span>
        <span className="flex items-center gap-1 text-xs">
          <Clock className="w-3.5 h-3.5" />
          {new Date(song.uploadedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      </div>

      {/* Menu */}
      <div className="relative flex-shrink-0">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="p-2 rounded-full text-textMuted hover:text-white hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 top-full mt-1 w-40 glass-panel rounded-xl border border-white/10 shadow-xl z-20 overflow-hidden">
              <button
                onClick={() => { handlePlay(); setMenuOpen(false); }}
                className="w-full flex items-center gap-2.5 px-4 py-3 text-sm hover:bg-white/5 transition-colors text-left"
              >
                <Play className="w-4 h-4" /> Play
              </button>
              <button
                onClick={() => { onDelete(song.id); setMenuOpen(false); }}
                className="w-full flex items-center gap-2.5 px-4 py-3 text-sm hover:bg-red-500/10 text-red-400 transition-colors text-left"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ─── Main page ────────────────────────────────────────────────────────────────

export const ArtistDashboard = () => {
  const navigate = useNavigate();
  const { artist, songs, isArtist, deleteSong, deregister } = useArtist();

  if (!isArtist) {
    navigate('/artist-register', { replace: true });
    return null;
  }

  const totalPlays = songs.reduce((s, t) => s + (t.plays ?? 0), 0);
  const totalLikes = songs.reduce((s, t) => s + (t.likes ?? 0), 0);

  return (
    <div className="bg-background text-textMain font-sans antialiased min-h-screen">
      <Navbar />

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-primary/8 to-transparent" />
        <div className="absolute top-40 right-1/4 w-80 h-80 bg-primary/8 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-28">

        {/* ── Header ────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-10">
          <div className="flex items-center gap-5">
            {artist.avatar ? (
              <img src={artist.avatar} alt="avatar" className="w-20 h-20 rounded-full object-cover shadow-xl border-2 border-primary/30" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl border-2 border-primary/30">
                <span className="text-3xl font-black text-white">{artist.stageName?.[0]?.toUpperCase()}</span>
              </div>
            )}
            <div>
              <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-0.5">Artist Dashboard</p>
              <h1 className="font-display text-3xl font-bold">{artist.stageName}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">{artist.genre}</span>
                <span className="text-xs text-textMuted">joined {new Date(artist.joinedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
          </div>

          <div className="sm:ml-auto flex items-center gap-3">
            <button
              onClick={() => navigate('/upload-song')}
              className="btn-primary flex items-center gap-2 px-5 py-2.5"
            >
              <Plus className="w-4 h-4" /> Upload Song
            </button>
            <button
              onClick={() => { if (window.confirm('Remove your artist profile? Your songs will be deleted.')) { deregister(); navigate('/home'); } }}
              className="p-2.5 rounded-xl border border-white/10 text-textMuted hover:text-red-400 hover:border-red-500/30 transition-all"
              title="Leave artist program"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Stats ─────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <StatCard icon={Music2}     label="Songs"       value={songs.length}                    color="bg-primary/20 text-primary" />
          <StatCard icon={Eye}        label="Total Plays"  value={totalPlays.toLocaleString()}     color="bg-blue-500/20 text-blue-400" />
          <StatCard icon={Heart}      label="Total Likes"  value={totalLikes.toLocaleString()}     color="bg-pink-500/20 text-pink-400" />
          <StatCard icon={TrendingUp} label="Trending"     value={songs.length > 0 ? '🔥 Rising' : '—'} color="bg-orange-500/20 text-orange-400" />
        </div>

        {/* ── Artist Bio ─────────────────────────────────────────────────── */}
        {artist.bio && (
          <div className="glass-panel rounded-2xl p-6 border border-white/8 mb-8">
            <h2 className="font-display font-bold text-lg mb-2">About</h2>
            <p className="text-textMuted text-sm leading-relaxed">{artist.bio}</p>
            {(artist.website || artist.instagram) && (
              <div className="flex gap-3 mt-4 flex-wrap">
                {artist.website && (
                  <a href={artist.website} target="_blank" rel="noopener noreferrer"
                    className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-textMuted hover:text-white transition-colors">
                    <ExternalLink className="w-3 h-3" /> Website
                  </a>
                )}
                {artist.instagram && (
                  <a href={`https://instagram.com/${artist.instagram}`} target="_blank" rel="noopener noreferrer"
                    className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-textMuted hover:text-white transition-colors">
                    @{artist.instagram}
                  </a>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Song list ──────────────────────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-2xl">Your Songs</h2>
            {songs.length > 0 && (
              <button onClick={() => navigate('/upload-song')} className="text-sm font-semibold text-primary hover:text-primaryHover transition-colors flex items-center gap-1">
                <Plus className="w-4 h-4" /> Add more
              </button>
            )}
          </div>

          {songs.length === 0 ? (
            <div className="glass-panel rounded-2xl border border-dashed border-white/15 py-20 flex flex-col items-center gap-5 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Mic2 className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="font-display font-bold text-xl mb-1">No songs yet</p>
                <p className="text-textMuted text-sm">Upload your first track and start building your audience</p>
              </div>
              <button onClick={() => navigate('/upload-song')} className="btn-primary flex items-center gap-2 px-6 py-3">
                <Upload className="w-4 h-4" /> Upload your first song
              </button>
            </div>
          ) : (
            <>
              {/* Headers */}
              <div className="flex items-center gap-4 px-4 py-2 border-b border-white/5 text-xs font-semibold uppercase tracking-widest text-textMuted mb-1">
                <span className="w-8">#</span>
                <span className="w-11 flex-shrink-0" />
                <span className="flex-1">Title</span>
                <span className="hidden sm:flex items-center gap-6 text-right">
                  <span className="w-12 text-center">Plays</span>
                  <span className="w-12 text-center">Likes</span>
                  <span className="w-20">Uploaded</span>
                </span>
                <span className="w-8" />
              </div>
              <div className="space-y-0.5">
                {songs.map((song, i) => (
                  <SongRow key={song.id} song={song} index={i} onDelete={deleteSong} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
