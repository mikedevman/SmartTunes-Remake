import React from 'react';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { Image } from '../components/Image';
import { Link } from '../components/Link';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Text } from '../components/Text';
import { usePlayer } from '../components/PlayerContext';
import { localScorePath } from '../components/SheetMusicViewer';

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
    <div className="bg-background text-textMain font-sans antialiased selection:bg-primary selection:text-black">
      <>
        {/* Navbar */}
        <header>
          <nav className="fixed w-full z-50 top-0 transition-all duration-300 bg-black/80 backdrop-blur-md border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-20">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Icon className="w-5 h-5 text-black fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></Icon>
                  </div>
                  <Text variant="bold" className="font-display font-bold text-2xl tracking-tight"> SmartTunes </Text>
                </div>
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-textMuted">
                  <RouterLink className="hover:text-white transition-colors" to="/"> Home </RouterLink>
                  <Link className="hover:text-white transition-colors" href="#discover"> Discover </Link>
                  <Link className="hover:text-white transition-colors" href="#playlists"> Playlists </Link>
                  <RouterLink className="hover:text-white transition-colors" to="/scores"> Scores </RouterLink>
                  <Link className="hover:text-white transition-colors" href="#premium"> Games </Link>
                </div>
                <div className="flex items-center gap-3 md:gap-4">
                  <Button variant="primary" className="md:hidden p-2 rounded-full text-textMuted hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary" id="mobile-menu-toggle"><Icon className="w-6 h-6" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></Icon></Button>
                  <RouterLink to="/auth">
                    <Button variant="primary" className="hidden md:block text-sm font-bold text-white hover:text-primary transition-colors"> Log In </Button>
                  </RouterLink>
                  <RouterLink to="/auth">
                    <Button variant="primary" contentKey="cta_23" className="bg-white text-black px-4 py-2 md:px-6 md:py-2.5 rounded-full text-sm font-bold hover:bg-primary hover:scale-105 transition-all duration-200 hidden md:block"> Sign Up </Button>
                  </RouterLink>
                </div>
              </div>
            </div>
          </nav>
        </header>

        {/* Sheet Music Grid */}
        <main className="pt-28 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-display text-5xl font-bold mb-2">Music Score Library</h1>
            <p className="text-textMuted mb-8">Browse and explore our collection of sheet music.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {SHEETS.map((sheet) => {
                const isActive = currentTrack?.id === sheet.id;
                return (
                  <div key={sheet.id} className="group cursor-pointer" onClick={() => navigate(`/scores/${sheet.id}`)}>
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

        {/* Footer */}
        <footer className="bg-surface py-12 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <Icon className="w-3 h-3 text-black fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></Icon>
                  </div>
                  <Text variant="bold" className="font-display font-bold text-lg"> StreamFlow </Text>
                </div>
                <div className="flex gap-4">
                  <Link className="text-textMuted hover:text-white" href="#"><Icon className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path></Icon></Link>
                </div>
              </div>
              <div>
                <h4 className="font-bold mb-4"> Company </h4>
                <ul className="space-y-2 text-sm text-textMuted">
                  <li><Link className="hover:text-white" href="#"> About </Link></li>
                  <li><Link className="hover:text-white" href="#"> Jobs </Link></li>
                  <li>
                    <Link className="hover:text-white" href="#"> For the Record </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4"> Communities </h4>
                <ul className="space-y-2 text-sm text-textMuted">
                  <li>
                    <Link className="hover:text-white" href="#"> For Artists </Link>
                  </li>
                  <li>
                    <Link className="hover:text-white" href="#"> Developers </Link>
                  </li>
                  <li>
                    <Link className="hover:text-white" href="#"> Advertising </Link>
                  </li>
                  <li>
                    <Link className="hover:text-white" href="#"> Investors </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4"> Useful Links </h4>
                <ul className="space-y-2 text-sm text-textMuted">
                  <li>
                    <Link className="hover:text-white" href="#"> Support </Link>
                  </li>
                  <li>
                    <Link className="hover:text-white" href="#"> Web Player </Link>
                  </li>
                  <li>
                    <Link className="hover:text-white" href="#"> Free Mobile App </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="text-xs text-textMuted pt-8 border-t border-white/5 flex justify-between">
              <p> © 2025 StreamFlow AB. </p>
              <div className="flex gap-4">
                <Link className="hover:text-white" href="#"> Legal </Link>
                <Link className="hover:text-white" href="#"> Privacy Center </Link>
                <Link className="hover:text-white" href="#"> Cookies </Link>
              </div>
            </div>
          </div>
        </footer>
      </>
    </div>
  );
};
