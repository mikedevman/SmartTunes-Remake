import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import './styles/globals.css';
import { IndexPage } from './pages/IndexPage';
import { ScoresPage } from './pages/ScoresPage';
import { ScorePlayerPage } from './pages/ScorePlayerPage';
import { AuthPage } from './pages/AuthPage';
import { PlayerProvider, usePlayer } from './components/PlayerContext';
import { PlayerControlBar } from './components/Player';

/** Reads from the global player context and renders the persistent bar. */
function GlobalPlayer() {
  const { currentTrack, isPlaying, progress, volume, isMuted, togglePlayPause, seek, changeVolume, toggleMute, close } = usePlayer();
  return (
    <PlayerControlBar
      track={currentTrack}
      isPlaying={isPlaying}
      progress={progress}
      volume={volume}
      isMuted={isMuted}
      onPlayPause={togglePlayPause}
      onSeek={seek}
      onVolumeChange={changeVolume}
      onMuteToggle={toggleMute}
      onClose={close}
    />
  );
}

const SKIP_AUTH_PAGE = true; // Toggle this to true to bypass AuthPage and land on Home directly.

function SkipAuth() {
  return SKIP_AUTH_PAGE ? <Navigate to="/home" replace /> : <AuthPage />;
}

const App = () => {
  return (
    <PlayerProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<SkipAuth />} />
          <Route path="/home" element={<IndexPage />} />
          <Route path="/scores" element={<ScoresPage />} />
          <Route path="/scores/:id" element={<ScorePlayerPage />} />
          <Route path="/auth" element={<AuthPage />} />
        </Routes>
        <GlobalPlayer />
      </Router>
    </PlayerProvider>
  );
};

export default App;
