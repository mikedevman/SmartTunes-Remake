import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { SOCIAL_POSTS } from '../data/mockData';
import { usePlayer } from '../components/PlayerContext';
import { useArtist } from '../components/ArtistContext';
import { searchTracks, getLargeArtwork } from '../utils/itunesApi';
import {
  MessageSquare, Heart, Share2, Music2, Search,
  Play, Pause, X, Send, Clock, Loader2, Mic2, Plus
} from 'lucide-react';

const STORAGE_KEY = 'smarttunes_social_posts_v3';

const DEFAULT_ALBUM_ART = 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80';

const getHighResArt = (url) => {
  if (!url) return DEFAULT_ALBUM_ART;
  return getLargeArtwork(url, 600);
};

function loadPosts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  
  return SOCIAL_POSTS;
}

function savePosts(posts) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch (e) {}
}

const timeAgo = (dateStr) => {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

// ─── Attach Song Modal ────────────────────────────────────────────────────────

const AttachSongModal = ({ onClose, onAttach }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('search');
  const { songs: mySongs, isArtist } = useArtist();

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const tracks = await searchTracks(query, 10);
      setResults(tracks);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#13101f] w-full max-w-lg rounded-3xl border border-white/10 shadow-2xl flex flex-col max-h-[80vh] overflow-hidden">
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/5">
          <h3 className="font-display font-bold text-lg">Drop a Track</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <X className="w-5 h-5 text-textMuted" />
          </button>
        </div>
        
        {isArtist && (
          <div className="flex border-b border-white/10">
            <button 
              className={`flex-1 py-4 text-sm font-semibold transition-all ${tab === 'search' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-textMuted hover:text-white hover:bg-white/5'}`}
              onClick={() => setTab('search')}
            >
              Search World
            </button>
            <button 
              className={`flex-1 py-4 text-sm font-semibold transition-all ${tab === 'my-tracks' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-textMuted hover:text-white hover:bg-white/5'}`}
              onClick={() => setTab('my-tracks')}
            >
              My Studio
            </button>
          </div>
        )}

        <div className="p-5 flex-1 overflow-y-auto">
          {tab === 'search' ? (
            <>
              <div className="flex gap-3 mb-6">
                <div className="relative flex-1">
                  <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-textMuted" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search any song..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <button onClick={handleSearch} className="btn-primary px-5 py-3 text-sm rounded-2xl font-bold hover:scale-105 transition-transform">
                  Find
                </button>
              </div>

              {loading ? (
                <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
              ) : (
                <div className="space-y-3">
                  {results.map((track) => (
                    <div 
                      key={track.trackId} 
                      className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/10 cursor-pointer group transition-colors"
                      onClick={() => onAttach({
                        trackId: track.trackId,
                        trackName: track.trackName,
                        artistName: track.artistName,
                        artworkUrl100: track.artworkUrl100 || DEFAULT_ALBUM_ART,
                        previewUrl: track.previewUrl,
                        isLocal: false
                      })}
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-primary transition-colors">
                        <img src={track.artworkUrl100 || DEFAULT_ALBUM_ART} onError={(e) => e.target.src = DEFAULT_ALBUM_ART} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-sm text-white truncate">{track.trackName}</p>
                        <p className="text-xs text-textMuted truncate">{track.artistName}</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-colors">
                        <Plus className="w-4 h-4" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="space-y-3">
              {mySongs.map((song) => (
                <div 
                  key={song.id} 
                  className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/10 cursor-pointer group transition-colors"
                  onClick={() => onAttach({
                    trackId: song.id,
                    trackName: song.title,
                    artistName: song.artistName,
                    artworkUrl100: song.coverUrl || DEFAULT_ALBUM_ART,
                    previewUrl: song.audioUrl,
                    isLocal: true
                  })}
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-primary transition-colors">
                    <img src={song.coverUrl || DEFAULT_ALBUM_ART} onError={(e) => e.target.src = DEFAULT_ALBUM_ART} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-sm text-white truncate">{song.title}</p>
                    <p className="text-xs text-textMuted truncate">{song.artistName}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-colors">
                    <Plus className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export const SocialHub = () => {
  const [posts, setPosts] = useState(loadPosts);
  const [content, setContent] = useState('');
  const [attachedSong, setAttachedSong] = useState(null);
  const [showAttachModal, setShowAttachModal] = useState(false);
  
  const { artist } = useArtist();
  const { currentTrack, isPlaying, togglePlayPause, play, playQueue } = usePlayer();

  const handlePost = () => {
    if (!content.trim() && !attachedSong) return;
    
    const newPost = {
      id: `post_${Date.now()}`,
      author: { 
        name: artist ? artist.stageName : 'Guest User', 
        avatar: artist?.avatar || `https://i.pravatar.cc/150?u=guest_${Date.now()}`
      },
      content: content.trim(),
      song: attachedSong,
      timestamp: new Date().toISOString(),
      likes: 0,
      isLiked: false
    };

    const updated = [newPost, ...posts];
    setPosts(updated);
    savePosts(updated);
    setContent('');
    setAttachedSong(null);
  };

  const toggleLike = (postId) => {
    const updated = posts.map(p => {
      if (p.id === postId) {
        return { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 };
      }
      return p;
    });
    setPosts(updated);
    savePosts(updated);
  };

  const handlePlaySong = (song) => {
    if (!song) return;
    const isActive = currentTrack?.trackId === song.trackId || (song.isLocal && currentTrack?.previewUrl === song.previewUrl);
    if (isActive) {
      togglePlayPause();
    } else {
      const feedSongs = posts.map(p => p.song).filter(Boolean);
      const startIndex = feedSongs.findIndex(s => s.trackId === song.trackId || (s.isLocal && s.previewUrl === song.previewUrl));
      if (startIndex >= 0) {
        playQueue(feedSongs, startIndex);
      } else {
        play(song);
      }
    }
  };

  return (
    <div className="bg-[#0c0a14] text-textMain font-sans antialiased min-h-screen">
      <Navbar />

      {/* Abstract Background Elements */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] -translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-32">
        
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <h1 className="font-display text-5xl font-black text-white mb-2 tracking-tight">The Hub</h1>
            <p className="text-textMuted text-sm font-medium">Discover what the community is listening to</p>
          </div>
          <Music2 className="w-12 h-12 text-primary/20 hidden sm:block" />
        </div>

        {/* ── Create Post Box ── */}
        <div className="relative bg-white/5 rounded-3xl p-6 border border-white/10 shadow-2xl backdrop-blur-xl mb-12 group transition-all hover:bg-white/10">
          <div className="flex gap-4 mb-4">
            <img src={artist?.avatar} className="w-12 h-12 rounded-full object-cover border-2 border-white/10 flex-shrink-0" alt="avatar" />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What track is defining your mood today?"
              className="w-full bg-transparent border-none resize-none focus:outline-none text-white placeholder-white/30 text-lg min-h-[60px] pt-2 font-medium"
            />
          </div>

          {attachedSong && (
            <div className="mb-6 relative rounded-2xl overflow-hidden bg-black/40 border border-white/10 p-4 flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border border-white/20 animate-[spin_10s_linear_infinite]">
                <img src={attachedSong.artworkUrl100 || DEFAULT_ALBUM_ART} onError={(e) => e.target.src = DEFAULT_ALBUM_ART} className="w-full h-full object-cover" alt="" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white truncate">{attachedSong.trackName}</p>
                <p className="text-sm text-textMuted truncate">{attachedSong.artistName}</p>
              </div>
              <button 
                onClick={() => setAttachedSong(null)}
                className="w-8 h-8 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-white/10 pt-4">
            <button 
              onClick={() => setShowAttachModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-sm font-bold transition-colors text-white"
            >
              <Music2 className="w-4 h-4 text-primary" /> 
              {attachedSong ? 'Change Track' : 'Drop a Track'}
            </button>
            
            <button 
              onClick={handlePost}
              disabled={!content.trim() && !attachedSong}
              className="bg-primary text-black font-black flex items-center gap-2 px-6 py-2.5 rounded-full text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
            >
              Share Vibe <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Feed ── */}
        <div className="space-y-12">
          {posts.map((post) => {
            const isActive = post.song && (currentTrack?.trackId === post.song.trackId || (post.song.isLocal && currentTrack?.previewUrl === post.song.previewUrl));
            
            return (
              <div key={post.id} className="relative rounded-[2rem] overflow-hidden border border-white/10 glass-panel transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10">
                
                {/* Dynamic Background Blur */}
                {post.song && (
                  <div 
                    className="absolute inset-0 bg-cover bg-center blur-[100px] opacity-20 transition-opacity duration-700" 
                    style={{ backgroundImage: `url(${getHighResArt(post.song.artworkUrl100)})` }}
                  />
                )}
                
                <div className="relative z-10 p-6 sm:p-8">
                  
                  {/* Author Info */}
                  <div className="flex items-center gap-4 mb-6">
                    <img src={post.author.avatar} onError={(e) => e.target.src = DEFAULT_ALBUM_ART} className="w-12 h-12 rounded-full border-2 border-white/10 shadow-lg" alt="" />
                    <div>
                      <p className="text-sm font-semibold text-white flex items-center gap-2">
                        {post.author.name}
                        {post.song && <span className="text-textMuted font-normal text-xs">is vibing to</span>}
                      </p>
                      <p className="text-xs text-textMuted font-medium flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" /> {timeAgo(post.timestamp)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-8 sm:gap-12">
                    
                    {/* Text & Actions */}
                    <div className="flex-1 w-full text-center sm:text-left order-2 sm:order-1">
                      {post.content && (
                        <p className="text-xl sm:text-2xl font-display font-medium text-white/95 leading-relaxed mb-6 italic relative">
                          <span className="text-primary/40 text-4xl absolute -top-4 -left-3 font-serif">"</span>
                          {post.content}
                          <span className="text-primary/40 text-4xl absolute -bottom-6 font-serif ml-1">"</span>
                        </p>
                      )}
                      
                      {post.song && (
                        <div className="mt-8">
                          <h3 className="font-black text-lg text-white truncate">{post.song.trackName}</h3>
                          <p className="text-sm text-primary font-bold truncate">{post.song.artistName}</p>
                          
                          <div className="flex items-center justify-center sm:justify-start gap-3 mt-6">
                            <button 
                              onClick={() => handlePlaySong(post.song)}
                              className={`flex items-center gap-2 px-6 py-3 rounded-full font-black text-sm transition-all shadow-xl ${isActive && isPlaying ? 'bg-white text-black hover:scale-105' : 'bg-primary text-black hover:scale-105 shadow-primary/20'}`}
                            >
                              {isActive && isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                              {isActive && isPlaying ? 'Playing' : 'Play Track'}
                            </button>
                            
                            <button onClick={() => toggleLike(post.id)} className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors group">
                              <Heart className={`w-5 h-5 transition-transform group-hover:scale-110 ${post.isLiked ? 'fill-pink-500 text-pink-500' : 'text-textMuted group-hover:text-white'}`} />
                            </button>
                            
                            <button className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors group">
                              <MessageSquare className="w-5 h-5 text-textMuted group-hover:text-white transition-transform group-hover:scale-110" />
                            </button>
                          </div>
                          {post.likes > 0 && (
                            <p className="text-xs text-textMuted mt-4 font-semibold text-center sm:text-left">{post.likes} people vibed with this</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Vinyl Record Visual */}
                    {post.song && (
                      <div className="order-1 sm:order-2 flex-shrink-0">
                        <div 
                          onClick={() => handlePlaySong(post.song)}
                          className={`relative w-48 h-48 sm:w-56 sm:h-56 rounded-full border-[8px] border-[#111] shadow-2xl cursor-pointer ${isActive && isPlaying ? 'animate-[spin_4s_linear_infinite]' : 'transition-transform duration-500 hover:scale-105 hover:rotate-12'}`}
                        >
                          {/* Inner black border for realism */}
                          <div className="absolute inset-0 rounded-full border-2 border-black/50 z-10 pointer-events-none" />
                          
                          <img src={getHighResArt(post.song.artworkUrl100)} onError={(e) => e.target.src = DEFAULT_ALBUM_ART} className="absolute inset-0 w-full h-full object-cover rounded-full opacity-90" alt="" />
                          
                          {/* Grooves overlay */}
                          <div 
                            className="absolute inset-0 rounded-full opacity-60" 
                            style={{ 
                              backgroundImage: 'radial-gradient(transparent 30%, rgba(0,0,0,0.8) 32%, transparent 34%, transparent 40%, rgba(0,0,0,0.8) 42%, transparent 44%, transparent 50%, rgba(0,0,0,0.8) 52%, transparent 54%, transparent 60%, rgba(0,0,0,0.8) 62%, transparent 64%)',
                              mixBlendMode: 'overlay'
                            }} 
                          />
                          
                          {/* Center hole setup */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 bg-[#1a1a1a] rounded-full shadow-inner flex items-center justify-center border-4 border-white/5">
                              <div className="w-3 h-3 bg-white/20 rounded-full inset-shadow" />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showAttachModal && (
        <AttachSongModal 
          onClose={() => setShowAttachModal(false)}
          onAttach={(song) => {
            setAttachedSong(song);
            setShowAttachModal(false);
          }}
        />
      )}
    </div>
  );
};
