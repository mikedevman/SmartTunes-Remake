/**
 * ArtistContext — frontend-only artist state persisted to localStorage.
 * Provides artist profile, uploaded songs, and CRUD helpers.
 */
import React, { createContext, useContext, useState, useCallback } from 'react';

const ArtistContext = createContext(null);

const STORAGE_KEY = 'smarttunes_artist';
const SONGS_KEY   = 'smarttunes_artist_songs';

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.warn('localStorage write failed');
  }
}

export function ArtistProvider({ children }) {
  const [artist, setArtist]   = useState(() => loadFromStorage(STORAGE_KEY, null));
  const [songs,  setSongs]    = useState(() => loadFromStorage(SONGS_KEY,   []));

  /** Register a new artist profile */
  const registerArtist = useCallback((profile) => {
    const newArtist = { ...profile, joinedAt: new Date().toISOString() };
    setArtist(newArtist);
    saveToStorage(STORAGE_KEY, newArtist);
  }, []);

  /** Update artist profile fields */
  const updateArtist = useCallback((fields) => {
    setArtist((prev) => {
      const updated = { ...prev, ...fields };
      saveToStorage(STORAGE_KEY, updated);
      return updated;
    });
  }, []);

  /** Upload a new song — stores a blob URL for the audio */
  const uploadSong = useCallback((songData) => {
    const newSong = {
      id:          `song_${Date.now()}`,
      uploadedAt:  new Date().toISOString(),
      plays:       0,
      likes:       0,
      ...songData,
    };
    setSongs((prev) => {
      const updated = [newSong, ...prev];
      saveToStorage(SONGS_KEY, updated);
      return updated;
    });
    return newSong;
  }, []);

  /** Delete an uploaded song */
  const deleteSong = useCallback((songId) => {
    setSongs((prev) => {
      const updated = prev.filter((s) => s.id !== songId);
      saveToStorage(SONGS_KEY, updated);
      return updated;
    });
  }, []);

  /** Increment play count */
  const incrementPlays = useCallback((songId) => {
    setSongs((prev) => {
      const updated = prev.map((s) =>
        s.id === songId ? { ...s, plays: (s.plays ?? 0) + 1 } : s
      );
      saveToStorage(SONGS_KEY, updated);
      return updated;
    });
  }, []);

  /** Log out / deregister as artist (keeps songs) */
  const deregister = useCallback(() => {
    setArtist(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <ArtistContext.Provider value={{
      artist,
      songs,
      isArtist: !!artist,
      registerArtist,
      updateArtist,
      uploadSong,
      deleteSong,
      incrementPlays,
      deregister,
    }}>
      {children}
    </ArtistContext.Provider>
  );
}

export function useArtist() {
  const ctx = useContext(ArtistContext);
  if (!ctx) throw new Error('useArtist must be used inside <ArtistProvider>');
  return ctx;
}
