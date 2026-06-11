import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { Button } from '../components/Button';
import { Text } from '../components/Text';
import { X, ArrowLeft, Download } from 'lucide-react';
import { usePlayer } from '../components/PlayerContext';
import { SheetMusicViewer } from '../components/SheetMusicViewer';
import { SHEETS } from './ScoresPage';

export const ScorePlayerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentTrack, isPlaying, progress, play } = usePlayer();

  const sheetId = parseInt(id, 10);
  const sheet = SHEETS.find((s) => s.id === sheetId);

  const [isCursorRendering, setIsCursorRendering] = useState(false);
  const sheetReadyRef = useRef(null);

  const autoPlayedIdRef = useRef(null);

  // Auto-play the sheet when page loads or ID changes
  useEffect(() => {
    if (sheet && autoPlayedIdRef.current !== sheet.id) {
      autoPlayedIdRef.current = sheet.id;
      
      if (currentTrack?.id !== sheet.id || !isPlaying) {
        play(sheet, () => new Promise((resolve) => {
          sheetReadyRef.current = resolve;
        }));
      }
    }
  }, [sheet, currentTrack, isPlaying, play]);

  // ── State Checker on console ────────────────────────────────────────────────
  useEffect(() => {
    const finalCursorRendering = sheet ? isCursorRendering : false;
    const isMusicPlaying = !!(isPlaying && sheet && currentTrack?.id === sheet.id);

    window.isCursorRendering = finalCursorRendering;
    window.isMusicPlaying = isMusicPlaying;

    console.log(`[State Checker] isCursorRendering: ${window.isCursorRendering}, isMusicPlaying: ${window.isMusicPlaying}`);
  }, [isCursorRendering, isPlaying, sheet, currentTrack]);

  useEffect(() => {
    // Reset cursor rendering when sheet changes
    setIsCursorRendering(false);
  }, [id]);

  useEffect(() => {
    return () => {
      delete window.isCursorRendering;
      delete window.isMusicPlaying;
    };
  }, []);

  if (!sheet) {
    return (
      <div className="min-h-screen bg-background text-textMain flex flex-col items-center justify-center p-4">
        <Text variant="bold" className="text-2xl mb-4">Score not found</Text>
        <RouterLink to="/scores">
          <Button variant="primary" className="bg-primary text-black px-6 py-2 rounded-full font-bold">
            Back to Library
          </Button>
        </RouterLink>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-textMain flex flex-col font-sans antialiased selection:bg-primary selection:text-black">
      {/* Navbar / Header */}
      <header className="fixed w-full z-50 top-0 bg-black/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/scores')}
                className="p-2 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center text-textMuted hover:text-white"
                title="Back to Scores Library"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight">{sheet.title}</h1>
                <p className="text-xs sm:text-sm text-textMuted">{sheet.composer}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={sheet.scoreUrl}
                download
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-black font-bold text-sm hover:bg-primaryHover hover:scale-105 transition-all duration-200"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download</span>
              </a>
              <button
                onClick={() => navigate('/scores')}
                className="p-2 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center text-textMuted hover:text-white"
                title="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pt-20 pb-24 flex flex-col min-h-0 bg-black/40">
        <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col min-h-0">
          <div className="flex-1 min-h-0 bg-black/50 rounded-xl border border-white/5 p-4 md:p-6 overflow-hidden flex flex-col shadow-2xl">
            <SheetMusicViewer
              scoreUrl={sheet.scoreUrl}
              isPlaying={isPlaying && currentTrack?.id === sheet.id}
              progress={currentTrack?.id === sheet.id ? progress : 0}
              onReady={(durationSeconds) => sheetReadyRef.current?.(durationSeconds)}
              onCursorRenderingChange={setIsCursorRendering}
            />
          </div>
        </div>
      </main>
    </div>
  );
};
