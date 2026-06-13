import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Music, Trophy } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { LeaderboardStore } from '../mock/mockData';
import { Text } from '../components/Text';

export const GameHub = () => {
  const navigate = useNavigate();
  const [topScores, setTopScores] = useState([]);

  useEffect(() => {
    setTopScores(LeaderboardStore.getGlobalTop(10));
  }, []);

  return (
    <div className="bg-background text-textMain font-sans antialiased min-h-screen flex flex-col selection:bg-primary selection:text-black">
      <Navbar />
      
      <main className="pt-28 pb-12 flex-grow flex flex-col items-center">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <h1 className="font-display text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              SmartTunes Arcade
            </h1>
            <p className="text-xl text-textMuted max-w-2xl mx-auto">
              Test your musical skills. Sing your heart out or plug in your instrument to play along with interactive scores.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-20 max-w-5xl mx-auto">
            {/* Karaoke Card */}
            <div 
              onClick={() => navigate('/games/karaoke')}
              className="group relative cursor-pointer overflow-hidden rounded-3xl bg-black/40 border border-white/10 p-8 hover:border-primary/50 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(29,185,84,0.3)] hover:-translate-y-2"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Mic className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-3xl font-display font-bold mb-4 text-white">Karaoke Mode</h2>
                <p className="text-textMuted">
                  Warm up your vocal cords. Sing along to your favorite hits and get scored on your pitch accuracy in real-time.
                </p>
              </div>
            </div>

            {/* Play-Along Card */}
            <div 
              onClick={() => navigate('/games/playalong')}
              className="group relative cursor-pointer overflow-hidden rounded-3xl bg-black/40 border border-white/10 p-8 hover:border-blue-400/50 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(96,165,250,0.3)] hover:-translate-y-2"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-blue-400/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Music className="w-10 h-10 text-blue-400" />
                </div>
                <h2 className="text-3xl font-display font-bold mb-4 text-white">Play Along</h2>
                <p className="text-textMuted">
                  Plug in your MIDI keyboard or acoustic instrument. Follow the interactive sheet music and hit the right notes.
                </p>
              </div>
            </div>
          </div>

          {/* Global Leaderboard */}
          <div className="max-w-3xl mx-auto bg-black/50 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
              <Trophy className="w-6 h-6 text-yellow-500" />
              <h3 className="text-2xl font-bold font-display text-white">Global Top Players</h3>
            </div>
            
            {topScores.length === 0 ? (
              <p className="text-center text-textMuted py-8">No scores yet. Be the first to play!</p>
            ) : (
              <div className="space-y-4">
                {topScores.map((score, idx) => (
                  <div key={score.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-8 text-center font-bold text-textMuted">#{idx + 1}</div>
                      <div>
                        <div className="font-bold text-white text-lg">{score.username}</div>
                        <div className="text-xs text-textMuted capitalize">{score.gameMode} Mode</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-display font-bold text-2xl text-primary">{Math.round(score.score)}</div>
                      <div className="text-xs text-textMuted">Points</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};
