import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { SHEETS } from '../mock/mockData';
import { Music, ArrowLeft } from 'lucide-react';
import { Image } from '../components/Image';

export const PlayAlongSelection = () => {
  const navigate = useNavigate();

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

          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-full bg-blue-400/20 flex items-center justify-center">
              <Music className="w-6 h-6 text-blue-400" />
            </div>
            <h1 className="font-display text-4xl font-bold">Play Along Library</h1>
          </div>
          <p className="text-textMuted mb-10 ml-16">Select a sheet music and play along with your instrument!</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SHEETS.map((sheet) => (
              <div 
                key={sheet.id} 
                onClick={() => navigate(`/games/playalong/${sheet.id}`)}
                className="group cursor-pointer bg-black/40 border border-white/5 rounded-2xl overflow-hidden hover:bg-white/5 transition-all duration-300 hover:border-blue-400/50 hover:shadow-[0_0_30px_-10px_rgba(96,165,250,0.3)] hover:-translate-y-1"
              >
                <div className="aspect-square relative overflow-hidden">
                  <Image 
                    src={sheet.image} 
                    alt={sheet.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-blue-400 text-black font-bold px-6 py-2 rounded-full">
                      Play Now
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-display font-bold text-lg mb-1 text-white truncate">{sheet.title}</h3>
                  <p className="text-textMuted text-sm">{sheet.composer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
