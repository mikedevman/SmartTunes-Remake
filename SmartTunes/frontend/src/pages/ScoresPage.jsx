import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../components/PlayerContext';
import { localScorePath } from '../components/SheetMusicViewer';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { BookOpen, Play, Upload } from 'lucide-react';
import { SHEETS } from '../mock/mockData';
import * as Tone from 'tone';

export const ScoresPage = () => {
  const { currentTrack, isPlaying } = usePlayer();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try { await Tone.start(); } catch (e) { console.error('Tone.start failed', e); }
    
    const url = URL.createObjectURL(file);
    const customSheet = {
      id: 'custom-' + Date.now(),
      title: file.name.replace(/\.[^/.]+$/, ""),
      composer: 'Local Upload',
      image: 'https://loremflickr.com/400/500/piano,classical?lock=99',
      scoreUrl: url,
      diff: 'Custom',
      uploadedBy: '@you'
    };

    navigate(`/mockScores/custom`, { state: { customSheet } });
    
    // Reset file input so the same file can be uploaded again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-background text-textMain font-sans antialiased min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-24 relative overflow-hidden">
        {/* Background ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-6">
              <BookOpen className="w-4 h-4" /> Interactive Sheet Music
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
              Play along with <span className="text-gradient">Classics</span>
            </h1>
            <p className="text-xl text-textMuted leading-relaxed mb-8">
              Explore our curated library of interactive sheet music. Play back, slow down, and follow the score in real-time.
            </p>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".mscz,.mxl,.musicxml,.xml" 
              onChange={handleFileUpload} 
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-8 py-3.5 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors shadow-xl shadow-white/10 flex items-center gap-2 mx-auto"
            >
              <Upload className="w-5 h-5" />
              Upload Your Score (.mscz / .mxl)
            </button>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SHEETS.map((sheet) => {
              const isActive = currentTrack?.id === sheet.id;
              return (
                <div 
                  key={sheet.id} 
                  className="group cursor-pointer card-hover" 
                  onClick={async () => {
                    try { await Tone.start(); } catch (e) { console.error('Tone.start failed', e); }
                    navigate(`/mockScores/${sheet.id}`);
                  }}
                >
                  <div className={`relative aspect-[4/5] rounded-2xl overflow-hidden mb-4 shadow-xl ${isActive ? 'ring-2 ring-primary shadow-primary/20' : 'shadow-black/40'}`}>
                    <img 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      src={sheet.image} 
                      alt={sheet.title} 
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                    {/* Difficulty tag */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 text-[10px] font-bold uppercase tracking-wider text-white">
                      {sheet.diff}
                    </div>

                    {/* Active State Equalizer */}
                    {isActive && isPlaying && (
                      <div className="absolute bottom-4 right-4 flex items-end gap-1 h-4">
                        {[...Array(3)].map((_, i) => (
                          <span
                            key={i}
                            className="w-1 bg-primary rounded-full"
                            style={{
                              animation: `eq-bar 0.${6 + i}s ease-in-out infinite alternate`,
                              animationDelay: `${i * 0.1}s`
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="px-1 mt-2">
                    <h3 className={`font-display font-bold text-lg leading-tight truncate transition-colors ${isActive ? 'text-primary' : 'group-hover:text-primary'}`}>
                      {sheet.title}
                    </h3>
                    <p className="text-sm text-textMuted mt-0.5 truncate">{sheet.composer}</p>
                    <p className="text-xs text-textMuted/60 mt-1 truncate">
                      Uploaded by <span className="text-white/80 hover:text-white transition-colors">{sheet.uploadedBy}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </main>

      <Footer />
      <style>{`
        @keyframes eq-bar {
          0% { height: 4px; }
          100% { height: 16px; }
        }
      `}</style>
    </div>
  );
};
