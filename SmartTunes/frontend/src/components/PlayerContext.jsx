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
  const [queue, setQueue]               = useState([]);   // array of tracks
  const [queueIndex, setQueueIndex]     = useState(0);
  const [isShuffle, setIsShuffle]       = useState(false);
  const [isRepeat, setIsRepeat]         = useState(false);
  
  const isShuffleRef = useRef(false);
  const isRepeatRef = useRef(false);

  useEffect(() => { isShuffleRef.current = isShuffle; }, [isShuffle]);
  useEffect(() => { isRepeatRef.current = isRepeat; }, [isRepeat]);
  
  const pendingPlayRef   = useRef(null);
  const playRequestIdRef = useRef(0);

  const intervalRef = useRef(null); // null when stopped
  const startTimeRef = useRef(null); // timestamp when the current track started playing, used for progress calculation
  const offsetRef = useRef(0); // seconds to offset progress when seeking
  const durationRef = useRef(null); // dynamically set from sheet metadata or audio

  const audioRef = useRef(new Audio());

  // Set audio volume when it changes
  useEffect(() => {
    audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  // Handle play/pause of HTML audio when global isPlaying changes
  useEffect(() => {
    const audio = audioRef.current;
    if (isPlaying && audio.src) {
      audio.play().catch(e => console.error("Audio play failed:", e));
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrack]);

  // Handle HTML audio ended event — auto-advance queue if available
  useEffect(() => {
    const audio = audioRef.current;
    const onEnded = () => {
      setQueue(currentQueue => {
        setQueueIndex(currentIndex => {
          let nextIndex = currentIndex + 1;
          
          if (isRepeatRef.current) {
            nextIndex = currentIndex;
          } else if (isShuffleRef.current && currentQueue.length > 0) {
            nextIndex = Math.floor(Math.random() * currentQueue.length);
          }

          if (nextIndex < currentQueue.length) {
            // Schedule next track play after a brief gap
            setTimeout(() => {
              const nextTrack = currentQueue[nextIndex];
              if (nextTrack) {
                audioRef.current.src = nextTrack.previewUrl || '';
                audioRef.current.load();
                audioRef.current.play().catch(() => {});
                setCurrentTrack(nextTrack);
                setProgress(0);
                setIsPlaying(true);
              }
            }, 800);
            return nextIndex;
          }
          // Queue exhausted
          setIsPlaying(false);
          setProgress(100);
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          return currentIndex;
        });
        return currentQueue;
      });
    };
    audio.addEventListener('ended', onEnded);
    return () => audio.removeEventListener('ended', onEnded);
  }, []);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, []);

  // ── Ticker ────────────────────────────────────────────────
  const startTicker = useCallback(() => {
    if (intervalRef.current !== null) { return; } // already running
    startTimeRef.current = Date.now();
    
    intervalRef.current = setInterval(() => {
      const audio = audioRef.current;
      const hasSrc = !!audio.getAttribute('src');
      
      // If we are playing real audio, use its native currentTime
      if (hasSrc && !audio.paused) {
        const dur = audio.duration || durationRef.current || 30;
        const newProgress = Math.min((audio.currentTime / dur) * 100, 100);
        setProgress(newProgress);
      } 
      // Otherwise use simulated ticker (for sheet music without backing tracks)
      else if (!hasSrc) {
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
      }
    }, 250); // 250ms for smooth progress bar
  }, []);

  const stopTicker = useCallback(() => {
    if (intervalRef.current === null) { return; } // already stopped
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    if (!audioRef.current.getAttribute('src')) {
      offsetRef.current += (Date.now() - startTimeRef.current) / 1000; // accumulate elapsed time
    }
  }, []);

  useEffect(() => {
    if (isPlaying) startTicker();
    else stopTicker();
  }, [isPlaying, startTicker, stopTicker]);

  const play = useCallback(async (track, sheetLoader, fromQueue = false) => {
    const requestId = ++playRequestIdRef.current;

    clearTimeout(pendingPlayRef.current);
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    offsetRef.current   = 0;
    
    // Stop any existing audio
    audioRef.current.pause();
    audioRef.current.src = '';
    audioRef.current.currentTime = 0;

    if (!fromQueue) {
      setQueue([track]);
      setQueueIndex(0);
    }

    setCurrentTrack(track);
    setProgress(0);
    setIsPlaying(false);

    try {
      if (sheetLoader) {
        // ✅ Wait for sheetLoader
        const sheetMeta = await sheetLoader();

        if (playRequestIdRef.current !== requestId) return;

        const sheetDuration = typeof sheetMeta === 'number'
          ? sheetMeta
          : sheetMeta?.duration;

        if (!sheetDuration) throw new Error('Sheet loader did not return a valid duration');

        durationRef.current = sheetDuration;
        setCurrentTrack((prevTrack) => ({ ...prevTrack, duration: sheetDuration }));
      } else {
        let finalPreviewUrl = track?.previewUrl;

        // Fallback: If no previewUrl, search for it dynamically
        if (!finalPreviewUrl && track?.trackName) {
          try {
            const query = encodeURIComponent(`${track.trackName} ${track.artistName || ''}`);
            const res = await fetch(`https://itunes.apple.com/search?term=${query}&media=music&entity=song&limit=1`);
            const json = await res.json();
            if (json.results?.[0]?.previewUrl) {
              finalPreviewUrl = json.results[0].previewUrl;
            }
          } catch (e) {
            console.error("Fallback search failed:", e);
          }
        }

        if (finalPreviewUrl) {
          if (playRequestIdRef.current !== requestId) return;
          
          audioRef.current.src = finalPreviewUrl;
          audioRef.current.load();
          audioRef.current.play().catch(e => console.error("Play failed:", e));
          
          durationRef.current = track.trackTimeMillis ? Math.min(30, track.trackTimeMillis / 1000) : 30;
          setCurrentTrack((prevTrack) => ({ ...track, duration: durationRef.current, previewUrl: finalPreviewUrl }));
        } else {
          throw new Error('No sheetLoader and no previewUrl provided.');
        }
      }

      setIsPlaying(true);
    } catch (err) {
      if (playRequestIdRef.current === requestId) {
        console.error('Play failed:', err);
        setCurrentTrack(null);
      }
    }
  }, []);

  const togglePlayPause = useCallback(() => setIsPlaying(p => !p), []);

  const seek = useCallback((value) => {
    const clamped = Math.min(Math.max(value, 0), 100);
    const duration = durationRef.current || 0;
    const targetSeconds = (clamped / 100) * duration;
    
    if (audioRef.current.src) {
      audioRef.current.currentTime = targetSeconds;
    } else {
      offsetRef.current = targetSeconds;
      startTimeRef.current = Date.now();
    }
    
    setProgress(clamped);
  }, []);

  const changeVolume = useCallback((value) => {
    setVolume(value);
    if (value > 0) setIsMuted(false);
  }, []);

  const toggleMute = useCallback(() => setIsMuted(m => !m), []);

  /** Play an ordered list of tracks like a radio queue */
  const playQueue = useCallback(async (tracks, startIndex = 0) => {
    if (!tracks || tracks.length === 0) return;
    setQueue(tracks);
    setQueueIndex(startIndex);
    await play(tracks[startIndex], null, true);
  }, [play]);

  const next = useCallback(() => {
    if (queue.length <= 1) {
      if (isRepeatRef.current) seek(0);
      return;
    }
    let nIndex = queueIndex + 1;
    if (isShuffleRef.current) {
      nIndex = Math.floor(Math.random() * queue.length);
    } else if (nIndex >= queue.length) {
      if (isRepeatRef.current) {
        nIndex = 0;
      } else {
        return;
      }
    }
    setQueueIndex(nIndex);
    play(queue[nIndex], null, true);
  }, [queue, queueIndex, play, seek]);

  const prev = useCallback(() => {
    if (queue.length <= 1) {
      if (isRepeatRef.current) seek(0);
      return;
    }
    let pIndex = queueIndex - 1;
    if (pIndex < 0) {
      if (isRepeatRef.current) {
        pIndex = queue.length - 1;
      } else {
        seek(0);
        return;
      }
    }
    setQueueIndex(pIndex);
    play(queue[pIndex], null, true);
  }, [queue, queueIndex, play, seek]);

  const toggleShuffle = useCallback(() => setIsShuffle(s => !s), []);
  const toggleRepeat = useCallback(() => setIsRepeat(r => !r), []);



  const close = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    offsetRef.current = 0;
    startTimeRef.current = null;
    durationRef.current = null;
    
    audioRef.current.pause();
    audioRef.current.src = '';
    audioRef.current.currentTime = 0;

    setCurrentTrack(null);
    setIsPlaying(false);
    setQueue([]);
    setQueueIndex(0);
    stopTicker();
    setProgress(0);
  }, [stopTicker]);

  const value = {
    currentTrack,
    isPlaying,
    progress,
    volume,
    isMuted,
    queue,
    queueIndex,
    isShuffle,
    isRepeat,
    play,
    playQueue,
    togglePlayPause,
    next,
    prev,
    toggleShuffle,
    toggleRepeat,
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
