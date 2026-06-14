import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { KARAOKE_TRACKS } from '../mock/mockData';
import { Mic, ArrowLeft, Loader2, Plus, Upload } from 'lucide-react';

export const KaraokeSelection = () => {
  const navigate = useNavigate();
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKaraoke = async () => {
      try {
        // 1. Find a healthy instance
        const instancesRes = await fetch('https://api.invidious.io/instances.json?sort_by=health');
        const instances = await instancesRes.json();
        const best = instances.find(i => i[1].type === 'https' && i[1].api === true);
        
        if (!best) throw new Error("No healthy instances found");
        
        const apiUrl = best[1].uri;

        // 2. Fetch 12 karaoke videos
        const searchRes = await fetch(`${apiUrl}/api/v1/search?q=karaoke&type=video`);
        if (!searchRes.ok) throw new Error("Search failed");
        
        const data = await searchRes.json();
        
        if (data && data.length > 0) {
          const mapped = data.slice(0, 12).map(video => {
            // Find highest res thumbnail
            const thumb = video.videoThumbnails?.find(t => t.quality === 'maxresdefault') 
              || video.videoThumbnails?.find(t => t.quality === 'sddefault')
              || video.videoThumbnails?.[0];

            return {
              id: video.videoId,
              title: video.title,
              artist: video.author,
              thumbnail: thumb ? thumb.url : `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`
            };
          });
          setTracks(mapped);
        } else {
          setTracks(KARAOKE_TRACKS); // fallback
        }
      } catch (err) {
        console.error("Failed to fetch dynamic karaoke tracks, falling back to mock data:", err);
        setTracks(KARAOKE_TRACKS);
      } finally {
        setLoading(false);
      }
    };

    fetchKaraoke();
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    navigate('/games/karaoke/local', { state: { videoUrl: url, title: file.name.replace(/\.[^/.]+$/, "") } });
  };

  return (
    <div className="bg-background text-textMain font-sans min-h-screen flex flex-col selection:bg-primary selection:text-black">
      <Navbar />

      <main className="pt-28 pb-12 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button 
            onClick={() => navigate('/games')}
            className="flex items-center gap-2 text-textMuted hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Arcade
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Mic className="w-6 h-6 text-primary" />
              </div>
              <h1 className="font-display text-4xl font-bold">Karaoke Selection</h1>
            </div>
            
            <label className="flex items-center gap-2 bg-primary text-black font-bold px-6 py-3 rounded-full cursor-pointer hover:scale-105 transition-transform shadow-[0_0_20px_rgba(29,185,84,0.3)]">
              <Upload className="w-5 h-5" />
              Add Karaoke (MP4)
              <input 
                type="file" 
                accept="video/mp4" 
                className="hidden" 
                onChange={handleFileUpload} 
              />
            </label>
          </div>
          <p className="text-textMuted mb-10 sm:ml-16">Select a track, or upload your own MP4 video to sing!</p>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
              <p className="text-textMuted">Loading fresh karaoke tracks from YouTube...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {tracks.map((track) => (
                <div 
                  key={track.id} 
                  onClick={() => navigate(`/games/karaoke/${track.id}`, { state: { title: track.title, artist: track.artist } })}
                  className="group cursor-pointer bg-black/40 border border-white/5 rounded-2xl overflow-hidden hover:bg-white/5 transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_30px_-10px_rgba(29,185,84,0.3)] hover:-translate-y-1 flex flex-col"
                >
                  <div className="aspect-video relative overflow-hidden bg-[#111]">
                    <img 
                      src={track.thumbnail} 
                      alt={track.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-display font-bold text-lg mb-1 text-white line-clamp-2 leading-tight" title={track.title}>{track.title}</h3>
                    <p className="text-xs text-textMuted/60 mt-1 truncate">
                      Uploaded by <span className="text-white/80 hover:text-white transition-colors">@{track.artist}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

