import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import './styles/globals.css';
import { IndexPage } from './pages/IndexPage';
import { DiscoverPage } from './pages/DiscoverPage';
import { ScoresPage } from './pages/ScoresPage';
import { ScorePlayerPage } from './pages/ScorePlayerPage';
import { AuthPage } from './pages/AuthPage';
import { PlayerProvider, usePlayer } from './components/PlayerContext';
import { PlayerControlBar } from './components/Player';
import { AlbumPage } from './pages/AlbumPage';
import { ArtistPage } from './pages/ArtistPage';
import { ArtistProvider } from './components/ArtistContext';
import { ArtistRegisterPage } from './pages/ArtistRegisterPage';
import { ArtistDashboard } from './pages/ArtistDashboard';
import { UploadSongPage } from './pages/UploadSongPage';
import { SocialHub } from './pages/SocialHub';
import { GameHub } from './pages/GameHub';
import { KaraokeSelection } from './pages/KaraokeSelection';
import { KaraokeGame } from './pages/KaraokeGame';
import { PlayAlongSelection } from './pages/PlayAlongSelection';
import { PlayAlongGame } from './pages/PlayAlongGame';
import { SHEETS } from './mock/mockData';

/** Reads from the global player context and renders the persistent bar. */
function GlobalPlayer() {
  const player = usePlayer();
  const location = useLocation();
  const navigate = useNavigate();

  const [hasEnded, setHasEnded] = React.useState(false);

  const handleNext = React.useCallback(() => {
    if (location.pathname.startsWith('/mockScores/') && location.pathname !== '/mockScores/custom') {
      const currentId = parseInt(location.pathname.split('/').pop(), 10);
      const sheetIndex = SHEETS.findIndex(s => s.id === currentId);
      if (sheetIndex !== -1) {
        const nextIndex = player.isShuffle 
          ? Math.floor(Math.random() * SHEETS.length)
          : (sheetIndex + 1) % SHEETS.length;
        navigate(`/mockScores/${SHEETS[nextIndex].id}`);
      }
    } else {
      player.next();
    }
  }, [location.pathname, navigate, player.isShuffle, player.next]);

  const handlePrev = React.useCallback(() => {
    if (location.pathname.startsWith('/mockScores/') && location.pathname !== '/mockScores/custom') {
      const currentId = parseInt(location.pathname.split('/').pop(), 10);
      const sheetIndex = SHEETS.findIndex(s => s.id === currentId);
      if (sheetIndex !== -1) {
        const prevIndex = (sheetIndex - 1 + SHEETS.length) % SHEETS.length;
        navigate(`/mockScores/${SHEETS[prevIndex].id}`);
      }
    } else {
      player.prev();
    }
  }, [location.pathname, navigate, player.prev]);

  React.useEffect(() => {
    // Detect when a sheet music track finishes playing
    if (player.progress >= 100 && !player.isPlaying) {
      if (!hasEnded) {
        setHasEnded(true);

        if (location.pathname.startsWith('/mockScores/') && location.pathname !== '/mockScores/custom') {
          if (player.isRepeat) {
            // Repeat the current score
            player.seek(0);
            setTimeout(() => {
              // We safely toggle Play if it didn't play already
              player.togglePlayPause();
            }, 100);
          } else {
            // Auto-advance to the next score (honoring shuffle)
            handleNext();
          }
        }
      }
    } else if (player.progress < 100) {
      setHasEnded(false);
    }
  }, [player.progress, player.isPlaying, player.isRepeat, location.pathname, hasEnded, handleNext, player]);

  return (
    <PlayerControlBar
      track={player.currentTrack}
      isPlaying={player.isPlaying}
      progress={player.progress}
      volume={player.volume}
      speed={player.speed}
      isMuted={player.isMuted}
      isShuffle={player.isShuffle}
      isRepeat={player.isRepeat}
      onPlayPause={player.togglePlayPause}
      onNext={handleNext}
      onPrev={handlePrev}
      onShuffleToggle={player.toggleShuffle}
      onRepeatToggle={player.toggleRepeat}
      onQueueToggle={() => {}}
      onSeek={player.seek}
      onVolumeChange={player.changeVolume}
      onChangeSpeed={player.changeSpeed}
      onMuteToggle={player.toggleMute}
      onClose={player.close}
    />
  );
}

/** Set to true to skip AuthPage and land on Home directly. */
const SKIP_AUTH_PAGE = true;

function SkipAuth() {
  return SKIP_AUTH_PAGE ? <Navigate to="/home" replace /> : <AuthPage />;
}

const App = () => {
  return (
    <ArtistProvider>
      <PlayerProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<SkipAuth />} />
            <Route path="/home" element={<IndexPage />} />
            <Route path="/discover" element={<DiscoverPage />} />
            <Route path="/album/:id" element={<AlbumPage />} />
            <Route path="/artist/:id" element={<ArtistPage />} />
            <Route path="/artist-register" element={<ArtistRegisterPage />} />
            <Route path="/artist-dashboard" element={<ArtistDashboard />} />
            <Route path="/upload-song" element={<UploadSongPage />} />
            <Route path="/social" element={<SocialHub />} />
            <Route path="/games" element={<GameHub />} />
            <Route path="/games/karaoke" element={<KaraokeSelection />} />
            <Route path="/games/karaoke/:id" element={<KaraokeGame />} />
            <Route path="/games/playalong" element={<PlayAlongSelection />} />
            <Route path="/games/playalong/:id" element={<PlayAlongGame />} />
            <Route path="/mockScores" element={<ScoresPage />} />
            <Route path="/mockScores/:id" element={<ScorePlayerPage />} />
            <Route path="/auth" element={<AuthPage />} />
            {/* Catch-all → home */}
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
          <GlobalPlayer />
        </Router>
      </PlayerProvider>
    </ArtistProvider>
  );
};

export default App;
