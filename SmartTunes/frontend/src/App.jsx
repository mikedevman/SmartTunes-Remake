import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

/** Reads from the global player context and renders the persistent bar. */
function GlobalPlayer() {
  const {
    currentTrack,
    isPlaying,
    progress,
    volume,
    isMuted,
    isShuffle,
    isRepeat,
    togglePlayPause,
    next,
    prev,
    toggleShuffle,
    toggleRepeat,
    seek,
    changeVolume,
    toggleMute,
    close,
  } = usePlayer();

  return (
    <PlayerControlBar
      track={currentTrack}
      isPlaying={isPlaying}
      progress={progress}
      volume={volume}
      isMuted={isMuted}
      isShuffle={isShuffle}
      isRepeat={isRepeat}
      onPlayPause={togglePlayPause}
      onNext={next}
      onPrev={prev}
      onShuffleToggle={toggleShuffle}
      onRepeatToggle={toggleRepeat}
      onQueueToggle={() => {}}
      onSeek={seek}
      onVolumeChange={changeVolume}
      onMuteToggle={toggleMute}
      onClose={close}
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
            <Route path="/scores" element={<ScoresPage />} />
            <Route path="/scores/:id" element={<ScorePlayerPage />} />
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
