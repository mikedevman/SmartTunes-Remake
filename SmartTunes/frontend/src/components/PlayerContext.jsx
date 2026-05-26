import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

const PlayerContext = createContext(null);

/**
 * Wrap your router/app with <PlayerProvider> to share player state across all pages.
 */
export function PlayerProvider({ children }) {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying]       = useState(false);
  const [progress, setProgress]         = useState(0);    // 0 – 100
  const [volume, setVolume]             = useState(0.75); // 0 – 1
  const [isMuted, setIsMuted]           = useState(false);
  const pendingPlayRef   = useRef(null);
  const playRequestIdRef = useRef(0);

  const intervalRef = useRef(null); // null when stopped
  const startTimeRef = useRef(null); // timestamp when the current track started playing, used for progress calculation
  const offsetRef = useRef(0); // seconds to offset progress when seeking
  const durationRef = useRef(null); // dynamically set from sheet metadata

  // cleanup on unmount
  useEffect(() => {
    return () => clearInterval(intervalRef.current);
    intervalRef.current = null;
  }
  , []);

  // ── Ticker ────────────────────────────────────────────────
  const startTicker = useCallback(() => {
    if (intervalRef.current !== null) { return; } // already running
    startTimeRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      const sessionElapsed = (Date.now() - startTimeRef.current) / 1000; // seconds
      const totalElapsed = offsetRef.current + sessionElapsed;
      const duration = Math.max(durationRef.current || 1, 1);
      const newProgress = Math.min((totalElapsed / duration) * 100, 100);
      setProgress(newProgress);
      if (newProgress >= 100) {
        clearInterval(intervalRef.current);
        setIsPlaying(false);
        offsetRef.current = 0;
        intervalRef.current = null;
      }
    }, 1000); // ms
  }, []);

  const stopTicker = useCallback(() => {
    if (intervalRef.current === null) { return; } // already stopped
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    offsetRef.current += (Date.now() - startTimeRef.current) / 1000; // accumulate elapsed time
  }, []);

  useEffect(() => () => clearInterval(intervalRef.current), []);

  useEffect(() => {
    if (isPlaying) startTicker();
    else stopTicker();
  }, [isPlaying, startTicker, stopTicker]);

  // /** Load a track and start playing immediately. */
  // const play = useCallback((track) => { 
  //   clearInterval(intervalRef.current);
  //   intervalRef.current = null;
  //   offsetRef.current = 0;
  //   durationRef.current = 192; // mock

  //   setCurrentTrack(track);
  //   setProgress(0);
  //   setIsPlaying(true);

  //   setTimeout(() => {
  //     setIsPlaying(true);
  //   }, 1000); // delay 1s
  // }, []);

  const play = useCallback(async (track, sheetLoader) => {
    const requestId = ++playRequestIdRef.current;

    clearTimeout(pendingPlayRef.current);
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    offsetRef.current   = 0;

    setCurrentTrack(track);
    setProgress(0);
    setIsPlaying(false);

    try {
      // ✅ Wait for BOTH — whichever takes longer wins
      const [sheetMeta] = await Promise.all([
        sheetLoader(),           // your openSheet / fetch call returns duration
        new Promise((resolve) => { pendingPlayRef.current = setTimeout(resolve, 1000); })
      ]);

      // If a newer load started while we were waiting, abort this one
      if (playRequestIdRef.current !== requestId) {
        return;
      }

      // Extract duration from sheet metadata
      const sheetDuration = typeof sheetMeta === 'number'
        ? sheetMeta
        : sheetMeta?.duration;

      if (!sheetDuration) {
        throw new Error('Sheet loader did not return a valid duration');
      }

      durationRef.current = sheetDuration;

      setCurrentTrack((prevTrack) => ({
        ...prevTrack,
        duration: sheetDuration,
      }));

      setIsPlaying(true);
    } catch (err) {
      if (playRequestIdRef.current === requestId) {
        console.error('Sheet failed to load:', err);
        setCurrentTrack(null);
      }
    }
  }, []);

  const togglePlayPause = useCallback(() => setIsPlaying(p => !p), []);

  const seek = useCallback((value) => {
    const clamped = Math.min(Math.max(value, 0), 100);
    const duration = durationRef.current || 0;
    offsetRef.current = (clamped / 100) * duration;
    startTimeRef.current = Date.now();
    setProgress(clamped);
  }, []);

  const changeVolume = useCallback((value) => {
    setVolume(value);
    if (value > 0) setIsMuted(false);
  }, []);

  const toggleMute = useCallback(() => setIsMuted(m => !m), []);

  const close = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    offsetRef.current = 0;
    startTimeRef.current = null;
    durationRef.current = null;

    setCurrentTrack(null);
    setIsPlaying(false);
    stopTicker();
    setProgress(0);
  }, [stopTicker]);

  const value = {
    currentTrack,
    isPlaying,
    progress,
    volume,
    isMuted,
    play,
    togglePlayPause,
    seek,
    changeVolume,
    toggleMute,
    close,
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
}

/** Use inside any component to access and control the global player. */
export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used inside <PlayerProvider>');
  return ctx;
}
