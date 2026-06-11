import React from 'react';
import { Image } from '../components/Image';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../components/PlayerContext';
import { localScorePath } from '../components/SheetMusicViewer';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

import * as Tone from 'tone';

export const SHEETS = [
  { id: 1, title: 'Moonlight Sonata', composer: 'Ludwig van Beethoven', image: 'https://images.unsplash.com/photo-1507838871-4439c5b1ef28?auto=format&fit=crop&w=400&q=80', scoreUrl: localScorePath('mariage-damour.mxl') },
  { id: 2, title: 'Für Elise in A Minor', composer: 'Ludwig van Beethoven', image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&w=400&q=80', scoreUrl: localScorePath('fr-elise--beethoven.mxl') },
  { id: 3, title: 'Für Elise', composer: 'Ludwig van Beethoven', image: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&w=400&q=80', scoreUrl: localScorePath('c-major.mxl') },
  { id: 4, title: 'Carmen Prelude', composer: 'Georges Bizet', image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=400&q=80', scoreUrl: localScorePath('c-minor.mxl') },
  { id: 5, title: 'Prelude in E Minor', composer: 'Frédéric Chopin', image: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?auto=format&fit=crop&w=400&q=80', scoreUrl: localScorePath('5.musicxml') },
  { id: 6, title: 'Gymnopédie No. 1', composer: 'Erik Satie', image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&q=80', scoreUrl: localScorePath('6.musicxml') },
  { id: 7, title: 'Nocturne Op. 9 No. 2', composer: 'Frédéric Chopin', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80', scoreUrl: localScorePath('7.musicxml') },
  { id: 8, title: 'Waltz of the Flowers', composer: 'Pyotr Ilyich Tchaikovsky', image: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?auto=format&fit=crop&w=400&q=80', scoreUrl: localScorePath('8.musicxml') },
];

export const ScoresPage = ({ className, children, variant, contentKey, ...props }) => {
  const { currentTrack, isPlaying } = usePlayer();
  const navigate = useNavigate();

  return (
    <div className="bg-background text-textMain font-sans antialiased selection:bg-primary selection:text-black min-h-screen flex flex-col">
      <>
        <Navbar />

        {/* Sheet Music Grid */}
        <main className="pt-28 pb-12 flex-grow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-display text-5xl font-bold mb-2">Music Score Library</h1>
            <p className="text-textMuted mb-8">Browse and explore our collection of sheet music.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {SHEETS.map((sheet) => {
                const isActive = currentTrack?.id === sheet.id;
                return (
                  <div key={sheet.id} className="group cursor-pointer" onClick={async () => {
                    try { await Tone.start(); } catch (e) { console.error('Tone.start failed', e); }
                    navigate(`/scores/${sheet.id}`);
                  }}>
                    <div
                      className="relative aspect-square rounded-lg overflow-hidden mb-4 shadow-lg hover:shadow-xl transition-shadow"
                      style={isActive ? { boxShadow: '0 0 0 2px #1db954, 0 8px 24px rgba(29,185,84,0.3)' } : {}}
                    >
                      <Image variant="cover" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" src={sheet.image} alt={sheet.title} />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <div>
                          </div>
                        </div>
                      </div>
                      {isActive && isPlaying && (
                        <div style={{ position: 'absolute', bottom: '10px', left: '10px', display: 'flex', alignItems: 'flex-end', gap: '3px', height: '20px' }}>
                          {[1, 2, 3].map(i => (
                            <div key={i} style={{
                              width: '3px', background: '#1db954', borderRadius: '2px',
                              animation: `eq-bar-${i} 0.8s ease-in-out infinite alternate`,
                              height: i === 1 ? '12px' : i === 2 ? '20px' : '8px',
                            }} />
                          ))}
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors" style={isActive ? { color: '#1db954' } : {}}>{sheet.title}</h3>
                    <p className="text-sm text-textMuted">{sheet.composer}</p>
                  </div>
                );
              })}
            </div>
            <style>{`
              @keyframes eq-bar-1 { from { height: 6px; } to { height: 16px; } }
              @keyframes eq-bar-2 { from { height: 16px; } to { height: 8px; } }
              @keyframes eq-bar-3 { from { height: 4px; } to { height: 20px; } }
            `}</style>
          </div>
        </main>

        <Footer />
      </>
    </div>
  );
};
