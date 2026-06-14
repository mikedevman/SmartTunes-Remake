import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { PitchDetector } from '../utils/PitchDetector';
import { LeaderboardStore } from '../mock/mockData';
import { KARAOKE_TRACKS } from '../mock/mockData';
import { X, Mic } from 'lucide-react';

export const KaraokeGame = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  
  const isLocal = id === 'local';
  const track = KARAOKE_TRACKS.find(t => t.id === id);
  
  const title = isLocal ? state?.title || 'Local Karaoke' : state?.title || track?.title || 'Unknown Track';
  const artist = isLocal ? 'Local File' : state?.artist || track?.artist || 'Unknown Artist';

  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [currentNote, setCurrentNote] = useState('--');
  const [gameOver, setGameOver] = useState(false);
  
  const playerRef = useRef(null);
  const pitchDetectorRef = useRef(null);
  const canvasRef = useRef(null);
  const requestRef = useRef();

  const scoreRef = useRef(0);
  const lastNoteRef = useRef(null);
  const sustainCountRef = useRef(0);

  // Initialize Pitch Detector
  useEffect(() => {
    pitchDetectorRef.current = new PitchDetector();
    return () => {
      if (pitchDetectorRef.current) pitchDetectorRef.current.stop();
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // Initialize YouTube Player
  useEffect(() => {
    if (isLocal) return;

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = initPlayer;
    } else {
      initPlayer();
    }

    function initPlayer() {
      playerRef.current = new window.YT.Player('yt-player', {
        height: '100%',
        width: '100%',
        videoId: id,
        playerVars: {
          autoplay: 0,
          controls: 1,
          rel: 0,
          showinfo: 0,
        },
        events: {
          onStateChange: onPlayerStateChange
        }
      });
    }

    return () => {
      if (playerRef.current?.destroy) {
        playerRef.current.destroy();
      }
    };
  }, [id]);

  const handleLocalVideoPlay = async () => {
    try {
      await pitchDetectorRef.current.start();
      setIsPlaying(true);
      startVisualizer();
    } catch (err) {
      alert("Please allow microphone access to play Karaoke mode!");
    }
  };

  const handleLocalVideoEnded = () => {
    setIsPlaying(false);
    setGameOver(true);
    LeaderboardStore.saveScore('karaoke', 'local', scoreRef.current, 'GuestSinger');
  };

  const onPlayerStateChange = async (event) => {
    // PLAYING = 1, ENDED = 0, PAUSED = 2
    if (event.data === 1) {
      try {
        await pitchDetectorRef.current.start();
        setIsPlaying(true);
        startVisualizer();
      } catch (err) {
        alert("Please allow microphone access to play Karaoke mode!");
        playerRef.current.pauseVideo();
      }
    } else if (event.data === 2) {
      setIsPlaying(false);
    } else if (event.data === 0) {
      setIsPlaying(false);
      setGameOver(true);
      // Save score automatically as guest for now
      LeaderboardStore.saveScore('karaoke', id, scoreRef.current, 'GuestSinger');
    }
  };

  const startVisualizer = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let x = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const draw = () => {
      if (!isPlaying) {
        requestRef.current = requestAnimationFrame(draw);
        return;
      }

      const pitchData = pitchDetectorRef.current.getPitch();
      
      // Shift canvas left
      const imageData = ctx.getImageData(1, 0, canvas.width - 1, canvas.height);
      ctx.putImageData(imageData, 0, 0);
      ctx.clearRect(canvas.width - 1, 0, 1, canvas.height);

      if (pitchData && pitchData.note) {
        setCurrentNote(pitchData.noteName);
        
        // Simple game logic: award points for sustaining a note
        if (lastNoteRef.current === pitchData.noteName) {
          sustainCountRef.current += 1;
          if (sustainCountRef.current > 10) { // Sustained for ~160ms
            scoreRef.current += 10;
            setScore(scoreRef.current);
          }
        } else {
          sustainCountRef.current = 0;
          lastNoteRef.current = pitchData.noteName;
        }

        // Draw pitch line
        const y = canvas.height - ((pitchData.note - 40) / 50) * canvas.height;
        ctx.fillStyle = '#1db954';
        ctx.fillRect(canvas.width - 2, y, 2, 4);
      } else {
        setCurrentNote('--');
        lastNoteRef.current = null;
        sustainCountRef.current = 0;
      }

      requestRef.current = requestAnimationFrame(draw);
    };
    
    draw();
  };

  if (!isLocal && !state?.title && !track) return null;
  if (isLocal && !state?.videoUrl) {
    return <div className="bg-black text-white min-h-screen flex items-center justify-center">No video provided</div>;
  }

  return (
    <div className="bg-black text-white font-sans min-h-screen flex flex-col">
      <header className="absolute top-0 w-full z-50 p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
          <div className="bg-primary/20 p-3 rounded-full">
            <Mic className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl">{title}</h1>
            <p className="text-textMuted text-sm">{artist}</p>
          </div>
        </div>

        <div className="flex items-center gap-8 pointer-events-auto">
          <div className="text-center">
            <p className="text-xs text-textMuted uppercase tracking-wider font-bold mb-1">Score</p>
            <p className="font-display font-extrabold text-4xl text-primary drop-shadow-[0_0_15px_rgba(29,185,84,0.5)]">
              {score.toLocaleString()}
            </p>
          </div>
          <button 
            onClick={() => navigate('/games/karaoke')}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="flex-1 relative flex flex-col items-center justify-center pt-24 pb-12 px-8">
        
        {/* YouTube Video Container */}
        <div className="relative w-full max-w-5xl aspect-video bg-black/50 rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_50px_-12px_rgba(255,255,255,0.1)]">
          {isLocal ? (
            <video 
              src={state.videoUrl} 
              controls 
              className="absolute inset-0 w-full h-full object-cover pointer-events-auto"
              onPlay={handleLocalVideoPlay}
              onPause={() => setIsPlaying(false)}
              onEnded={handleLocalVideoEnded}
            />
          ) : (
            <div id="yt-player" className="absolute inset-0 pointer-events-auto"></div>
          )}
          
          {/* Pitch Visualization Overlay */}
          <div className="absolute bottom-0 left-0 w-full h-1/3 pointer-events-none bg-gradient-to-t from-black/80 to-transparent flex items-end">
             <canvas 
                ref={canvasRef}
                width={1000}
                height={200}
                className="w-full h-full opacity-80"
             />
             <div className="absolute bottom-4 left-6 pointer-events-none">
                <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-center">
                  <p className="text-[10px] text-textMuted uppercase font-bold tracking-widest mb-1">Pitch</p>
                  <p className="font-display font-bold text-2xl text-white">{currentNote}</p>
                </div>
             </div>
          </div>
        </div>

        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="bg-black/80 backdrop-blur-md p-8 rounded-3xl border border-white/10 text-center animate-pulse">
              <Mic className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold font-display mb-2">Ready to sing?</h2>
              <p className="text-textMuted">Click play on the video to start tracking your pitch.</p>
            </div>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-50">
            <div className="bg-black border border-white/10 p-12 rounded-3xl text-center max-w-md w-full shadow-[0_0_100px_-20px_rgba(29,185,84,0.4)]">
              <h2 className="text-4xl font-display font-extrabold mb-2 text-white">Song Complete!</h2>
              <p className="text-textMuted mb-8">Great job hitting those notes.</p>
              
              <div className="bg-white/5 rounded-2xl p-6 mb-8 border border-white/5">
                <p className="text-sm text-textMuted uppercase tracking-widest font-bold mb-2">Final Score</p>
                <p className="text-6xl font-display font-black text-primary">{score.toLocaleString()}</p>
              </div>

              <button 
                onClick={() => navigate('/games')}
                className="w-full py-4 bg-primary text-black font-bold rounded-full hover:bg-primaryHover hover:scale-105 transition-all"
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
