import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SheetMusicViewer } from '../components/SheetMusicViewer';
import { SHEETS } from '../mock/mockData';
import { PitchDetector } from '../utils/PitchDetector';
import { MidiDetector } from '../utils/MidiDetector';
import { LeaderboardStore } from '../mock/mockData';
import { X, Music, Keyboard, Mic } from 'lucide-react';
import * as Tone from 'tone';

export const PlayAlongGame = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const sheet = SHEETS.find(s => s.id === parseInt(id, 10));

  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [activeInput, setActiveInput] = useState('none'); // 'midi' or 'mic'
  const [feedback, setFeedback] = useState('');

  const pitchDetectorRef = useRef(null);
  const midiDetectorRef = useRef(null);
  const timelineRef = useRef([]);
  const requestRef = useRef();

  const scoreRef = useRef(0);
  const currentNotePlayedRef = useRef(null);
  const hitNotesRef = useRef(new Set()); // To avoid multi-scoring the same note in the same window

  // Initialize Input Detectors
  useEffect(() => {
    pitchDetectorRef.current = new PitchDetector();
    midiDetectorRef.current = new MidiDetector(
      (note) => { currentNotePlayedRef.current = midiDetectorRef.current.noteToName(note); },
      (note) => { if (currentNotePlayedRef.current === midiDetectorRef.current.noteToName(note)) currentNotePlayedRef.current = null; }
    );

    return () => {
      if (pitchDetectorRef.current) pitchDetectorRef.current.stop();
      if (midiDetectorRef.current) midiDetectorRef.current.stop();
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const startMic = async () => {
    try {
      await pitchDetectorRef.current.start();
      setActiveInput('mic');
    } catch (err) {
      alert("Microphone access denied.");
    }
  };

  const startMidi = async () => {
    try {
      await midiDetectorRef.current.start();
      setActiveInput('midi');
    } catch (err) {
      alert("No MIDI device found or access denied.");
    }
  };

  const startGame = async () => {
    if (activeInput === 'none') {
      alert("Please select an input method first (Microphone or MIDI).");
      return;
    }
    await Tone.start();
    setIsPlaying(true);
    gameLoop();
  };

  const gameLoop = () => {
    if (!isPlaying) {
      requestRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    const currentTime = Tone.Transport.seconds;
    
    // Auto Game Over
    if (timelineRef.current.length > 0) {
      const lastEvent = timelineRef.current[timelineRef.current.length - 1];
      if (currentTime > lastEvent.time + lastEvent.duration + 2) {
        setIsPlaying(false);
        setGameOver(true);
        LeaderboardStore.saveScore('playalong', id, scoreRef.current, 'VirtuosoGuest');
        return;
      }
    }

    // Determine current user input
    let playedNote = null;
    if (activeInput === 'mic') {
      const pitchData = pitchDetectorRef.current.getPitch();
      if (pitchData && pitchData.note) playedNote = pitchData.noteName;
    } else if (activeInput === 'midi') {
      playedNote = currentNotePlayedRef.current;
    }

    // Find expected notes within a +/- 0.3s window
    if (playedNote) {
      const window = 0.3;
      let matched = false;

      for (const event of timelineRef.current) {
        if (Math.abs(currentTime - event.time) <= window) {
          if (event.notes.includes(playedNote)) {
            const eventId = `${event.time}-${playedNote}`;
            if (!hitNotesRef.current.has(eventId)) {
              hitNotesRef.current.add(eventId);
              scoreRef.current += 50;
              setScore(scoreRef.current);
              setFeedback('Perfect!');
              matched = true;
              setTimeout(() => setFeedback(''), 500);
            }
          }
        }
      }
      
      if (!matched && feedback !== 'Perfect!') {
        setFeedback('Miss');
      }
    }

    requestRef.current = requestAnimationFrame(gameLoop);
  };

  if (!sheet) return null;

  return (
    <div className="bg-background text-white font-sans min-h-screen flex flex-col">
      <header className="fixed top-0 w-full z-50 p-6 flex justify-between items-center bg-black/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="bg-blue-400/20 p-3 rounded-full">
            <Music className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl">{sheet.title}</h1>
            <p className="text-textMuted text-sm">{sheet.composer}</p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="text-center relative">
            <p className="text-xs text-textMuted uppercase tracking-wider font-bold mb-1">Score</p>
            <p className="font-display font-extrabold text-4xl text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]">
              {score.toLocaleString()}
            </p>
            {feedback && (
              <span className={`absolute -left-16 top-4 font-bold text-lg animate-ping ${feedback === 'Perfect!' ? 'text-green-400' : 'text-red-400'}`}>
                {feedback}
              </span>
            )}
          </div>
          <button 
            onClick={() => navigate('/games/playalong')}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="flex-1 pt-28 pb-12 px-8 flex flex-col items-center">
        {!isPlaying && !gameOver && (
          <div className="mb-8 p-6 bg-black/40 rounded-2xl border border-white/10 text-center max-w-xl w-full shadow-2xl">
            <h2 className="text-2xl font-display font-bold mb-4">Choose Input Method</h2>
            <div className="flex gap-4 justify-center mb-6">
              <button 
                onClick={startMidi}
                className={`flex-1 py-4 flex flex-col items-center gap-2 rounded-xl border ${activeInput === 'midi' ? 'border-blue-400 bg-blue-400/20 text-blue-400' : 'border-white/10 hover:bg-white/5'} transition-all`}
              >
                <Keyboard className="w-8 h-8" />
                <span className="font-bold">MIDI Keyboard</span>
              </button>
              <button 
                onClick={startMic}
                className={`flex-1 py-4 flex flex-col items-center gap-2 rounded-xl border ${activeInput === 'mic' ? 'border-blue-400 bg-blue-400/20 text-blue-400' : 'border-white/10 hover:bg-white/5'} transition-all`}
              >
                <Mic className="w-8 h-8" />
                <span className="font-bold">Microphone (Acoustic)</span>
              </button>
            </div>
            <button 
              onClick={startGame}
              disabled={activeInput === 'none'}
              className="w-full py-4 bg-blue-400 text-black font-bold rounded-xl hover:bg-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start Game
            </button>
          </div>
        )}

        <div className={`w-full max-w-6xl aspect-[16/9] bg-white rounded-2xl overflow-hidden shadow-[0_0_50px_-12px_rgba(255,255,255,0.1)] transition-all duration-500 ${!isPlaying && !gameOver ? 'opacity-50 blur-sm pointer-events-none' : ''}`}>
          <SheetMusicViewer
            scoreUrl={sheet.scoreUrl}
            isPlaying={isPlaying}
            progress={0} // We'll let Tone.Transport run naturally
            onTimelineParsed={(timeline) => { timelineRef.current = timeline; }}
          />
        </div>

        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-50">
            <div className="bg-black border border-white/10 p-12 rounded-3xl text-center max-w-md w-full shadow-[0_0_100px_-20px_rgba(96,165,250,0.4)]">
              <h2 className="text-4xl font-display font-extrabold mb-2 text-white">Bravo!</h2>
              <p className="text-textMuted mb-8">You finished the piece.</p>
              
              <div className="bg-white/5 rounded-2xl p-6 mb-8 border border-white/5">
                <p className="text-sm text-textMuted uppercase tracking-widest font-bold mb-2">Final Score</p>
                <p className="text-6xl font-display font-black text-blue-400">{score.toLocaleString()}</p>
              </div>

              <button 
                onClick={() => navigate('/games')}
                className="w-full py-4 bg-blue-400 text-black font-bold rounded-full hover:bg-blue-300 hover:scale-105 transition-all"
              >
                Return to Arcade
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
