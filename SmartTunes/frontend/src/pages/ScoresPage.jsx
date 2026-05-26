import React, { useCallback, useEffect, useRef, useState } from 'react';
import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { Image } from '../components/Image';
import { Link } from '../components/Link';
import { Link as RouterLink } from 'react-router-dom';
import { Text } from '../components/Text';
import { usePlayer } from '../components/PlayerContext';
import * as Tone from "tone";
import { X } from "lucide-react";

/** Local MusicXML/MXL under `frontend/public/scores/` (served at `/scores/...`). */
function localScorePath(fileName) {
  const base = (process.env.PUBLIC_URL || '').replace(/\/$/, '');
  return `${base}/test/scores/${fileName}`;
}

/** Fetch score file first so missing files show a clear message (OSMD otherwise reports "Could not retrieve requested URL 0"). */
async function loadScoreContentIntoOsmd(osmd, scoreUrl) {
  const res = await fetch(scoreUrl, { credentials: 'same-origin' });
  if (!res.ok) {
    throw new Error(
      `No file at ${scoreUrl} (HTTP ${res.status}). Put your \`.musicxml\` / \`.xml\` / \`.mxl\` in frontend/public/scores/ with the same name as in ScoresPage.`
    );
  }
  const pathname = (() => {
    try {
      return new URL(scoreUrl, window.location.origin).pathname;
    } catch {
      return scoreUrl;
    }
  })();
  const lower = pathname.split('?')[0].toLowerCase();
  const isMxl = lower.endsWith('.mxl');

  if (isMxl) {
    await osmd.load(scoreUrl);
  } else {
    const text = await res.text();
    await osmd.load(text.trim());
  }
}

/**
 * SheetMusicViewer
 *
 * Props:
 *   scoreUrl   – URL of the MusicXML / MXL file
 *   isPlaying  – boolean from the global player context
 *   progress   – 0-100 from the global player context (used to detect seeks)
 *   onReady    – callback when the score is fully loaded and rendered
 */
function SheetMusicViewer({ scoreUrl, isPlaying, progress, onReady }) {
  const containerRef = useRef(null);
  const osmdRef = useRef(null);  // OpenSheetMusicDisplay instance
  const renderedRef = useRef(false); // true once osmd.render() completed
  const cursorHeightRef = useRef(null); // last known-good cursor height in px
  const prevProgressRef = useRef(0);     // for seek detection
  const isPlayingRef = useRef(isPlaying); // always-current mirror for async closures

  // Timeline & scheduler state
  const timelineRef = useRef([]);        // Array of { ms: number, time: number, duration: number, notes: string[] }
  const cursorIndexRef = useRef(0);      // Current position in timeline
  const timeoutRef = useRef(null);       // Timeout handler for next note
  const playStartTimeRef = useRef(0);    // performance.now() when playback started
  const playStartOffsetMsRef = useRef(0);// ms elapsed in the piece when playback started

  const synthRef = useRef(null);         // Tone.js Instrument

  // Sync every render — safe to do outside useEffect for a ref
  isPlayingRef.current = isPlaying;

  const [status, setStatus] = useState('Loading score…');
  const [error, setError] = useState(null);
  // Custom cursor position — read from OSMD's cursor element after each advance
  const [cursorPos, setCursorPos] = useState(null); // { left, top, height } in px

  // ── helpers ──────────────────────────────────────────────────────────────

  /**
   * Read OSMD cursor element's inline position (set by OSMD after show/next)
   * and push it into React state so our custom overlay div follows.
   */
  const syncCursorPos = useCallback(() => {
    const el = osmdRef.current?.cursor?.cursorElement;
    if (!el) return;

    const left = el.style.left;
    const top  = el.style.top;

    // OSMD sets el.style.height (inline CSS) on its cursor <img>.
    // el.height (the HTML attribute) is almost always 0 — never read it first.
    // Priority: inline style → SVG baseVal → layout APIs
    let rawHeight = null;
    if (el.style?.height) {
      rawHeight = parseFloat(el.style.height);        // OSMD always sets this
    } else if (el.height && typeof el.height === 'object' && el.height.baseVal) {
      rawHeight = el.height.baseVal.value;             // SVG <image> fallback
    }
    // el.height (HTML img attribute) intentionally skipped — it is always 0

    const rectHeight   = Math.round(el.getBoundingClientRect().height);
    const offsetHeight = el.offsetHeight;

    const measured = (typeof rawHeight === 'number' && !isNaN(rawHeight) && rawHeight > 0)
      ? rawHeight
      : (offsetHeight || rectHeight || 0);

    // OSMD's cursor <img> drops to 1×1 px on certain beats — ignore bogus heights
    // and fall back to the last known-good staff height.
    if (measured > 10) cursorHeightRef.current = measured;

    const finalHeight = measured > 10 ? measured : (cursorHeightRef.current || 0);

    if (left && top && finalHeight > 0) {
      setCursorPos({ left, top, height: finalHeight + 'px' });
    }
  }, []);

  /** Scroll our custom cursor overlay into view. */
  const scrollToCursor = useCallback(() => {
    // Find our own overlay div (a sibling of the OSMD SVG inside containerRef)
    const overlay = containerRef.current?.querySelector('[data-custom-cursor]');
    overlay?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, []);

  const resetCursor = useCallback((seekSeconds = 0) => {
    const osmd = osmdRef.current;
    if (!osmd?.cursor) return;

    osmd.cursor.reset();
    osmd.cursor.show();
    cursorIndexRef.current = 0;

    const bpm = osmd.Sheet?.DefaultStartTempoInBpm || osmd.sheet?.DefaultStartTempoInBpm || 120;
    const secondsPerQuarterNote = 60 / Math.max(bpm, 1);

    while (!osmd.cursor.iterator.EndReached) {
      const fraction = osmd.cursor.iterator.currentTimeStamp.RealValue;
      const timeSecs = fraction * 4 * secondsPerQuarterNote;

      if (timeSecs >= seekSeconds - 0.05) break;
      osmd.cursor.next();
      cursorIndexRef.current += 1;
    }

    syncCursorPos();   // snap overlay to the exact restored position
  }, [syncCursorPos]);

  // ── Load & render score ───────────────────────────────────────────────────
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    let cancelled = false;
    renderedRef.current = false;
    setCursorPos(null);
    setError(null);
    setStatus('Loading score…');
    // stopCursorLoop();

    if (!scoreUrl) {
      setError('This score has no file path set.');
      setStatus('');
      return undefined;
    }

    const osmd = new OpenSheetMusicDisplay(container, {
      autoResize: true,
      backend: 'svg',
      drawingParameters: 'default',
      disableCursor: false, // keep cursor alive for position tracking
    });
    osmdRef.current = osmd;

    loadScoreContentIntoOsmd(osmd, scoreUrl)
      .then(() => {
        if (cancelled) return;

        const waitForWidth = () =>
          new Promise((resolve) => {
            const check = () => {
              const w = containerRef.current?.offsetWidth;
              if (w && w > 50) resolve(w);
              else requestAnimationFrame(check);
            };
            check();
          });

        waitForWidth().then(() => {
          if (cancelled) return;

          // PageBackgroundColor ensures OSMD uses z-index:"1" in
          // adjustToBackgroundColor() — consistent internal state.
          osmd.EngravingRules.PageBackgroundColor = '#ffffff';

          osmd.render();
          renderedRef.current = true;

          // Init cursor position tracking
          osmd.cursor.reset();
          osmd.cursor.show();

          // ✨ BUILD TIMELINE & TONE.JS SETUP ✨ //
          const bpm = osmd.Sheet?.DefaultStartTempoInBpm || osmd.sheet?.DefaultStartTempoInBpm || 30;
          const secondsPerQuarterNote = 60 / Math.max(bpm, 1);

          if (!synthRef.current) {
            synthRef.current = new Tone.PolySynth(Tone.Synth).toDestination();
          }
          const synth = synthRef.current;

          Tone.Transport.bpm.value = bpm;
          Tone.Transport.cancel(); // clear any previous score schedules

          const timeline = [];
          let currentTime = 0;

          const iterator = osmd.cursor.iterator.clone();

          while (!iterator.EndReached) {
            const fraction = iterator.currentTimeStamp.RealValue;
            const timeSeconds = fraction * 4 * secondsPerQuarterNote;

            const notes = [];
            let durationSeconds = 0; // max duration of notes in this segment

            const voices = iterator.CurrentVoiceEntries;

            if (voices && voices.length > 0) {
              for (const entry of voices) {
                if (!entry || !entry.Notes) continue;

                for (const note of entry.Notes) {
                  if (!note || note.isRest() || !note.Pitch) continue; // skip

                  const noteEnumToStep = { 0: "C", 2: "D", 4: "E", 5: "F", 7: "G", 9: "A", 11: "B" };
                  const step = noteEnumToStep[note.Pitch.FundamentalNote];
                  const naturalSemitone = note.Pitch.FundamentalNote;
                  const actualSemitone = note.Pitch.halfTone % 12 // 0 to 11

                  // normalize accidental
                  let difference = ((actualSemitone - naturalSemitone) + 12) % 12;
                  if (difference > 6) difference -= 12;

                  // difference is now: 0 = natural, 1 = sharp, -1 = flat
                  let accidental = "";
                  if (difference === 1) accidental = "#";
                  if (difference === -1) accidental = "b";

                  // NOT WORKING
                  // const octave = Math.floor(note.Pitch.halfTone / 12) - 1;
                  // const noteName = `${step}${accidental}${octave}`;
                  // THE BELOW STILL WORKS

                  const octave = note.Pitch.Octave + 3;

                  if (step !== undefined) {
                    notes.push(`${step}${accidental}${octave}`);
                  }

                  if (note.Length && note.Length.RealValue) { // duration
                    const sec = note.Length.RealValue * 4 * secondsPerQuarterNote;
                    durationSeconds = Math.max(durationSeconds, sec);
                  }
                }
              }
            }

            // Default duration for pure rests context
            if (durationSeconds <= 0) {
              durationSeconds = 0.5 * secondsPerQuarterNote;
            }

            timeline.push({ time: timeSeconds, duration: durationSeconds, notes });
            currentTime += durationSeconds;
            if (timeline.length < 10) {
              console.log("SCHEDULED EVENT:", { timeSeconds, durationSeconds, notes });
            }

            // Schedule this event into Tone.js directly using Tone.Transport timeline
            Tone.Transport.schedule((t) => {
              if (notes.length > 0) {
                synth.triggerAttackRelease(notes, durationSeconds, t);

                // Sync UI exactly to audio timing context using Tone.Draw
                Tone.Draw.schedule(() => {
                  const innerOsmd = osmdRef.current;
                  if (!innerOsmd) {
                    console.warn('[CURSOR] Tone.Draw fired but osmdRef is null — skipping cursor.next()');
                    return;
                  }
                  console.log('[CURSOR] 🎵 Tone.Draw fired — calling cursor.next() | notes:', notes);
                  innerOsmd.cursor.next();
                  syncCursorPos();
                  scrollToCursor();
                }, t);
              } else {
                // REST beat — cursor.next() is NOT called here (known limitation)
                console.log('[CURSOR] 🔇 REST beat at t=', timeSeconds.toFixed(3), '— cursor.next() SKIPPED');
              }
            }, timeSeconds);

            iterator.moveToNext();
          }

          timelineRef.current = timeline;
          const totalDurationSecs = currentTime;

          // Restore cursor to original state now that timeline is mapped
          osmd.cursor.reset();
          osmd.cursor.show();

          // Hide OSMD's cursor visually — use opacity, NOT display:none.
          // OSMD's update() resets display to "" on every next() call,
          // which would undo display:none. opacity:0 persists.
          const cursorEl = osmd.cursor.cursorElement;
          if (cursorEl) {
            cursorEl.style.opacity = '0';
            cursorEl.style.pointerEvents = 'none';
          }

          // Capture initial position for the overlay
          syncCursorPos();
          setStatus('');
          onReady?.(totalDurationSecs);
        });
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e?.message || 'Could not load this score.');
          setStatus('');
        }
      });

    return () => {
      cancelled = true;
      Tone.Transport.stop();
      Tone.Transport.cancel();
      // stopCursorLoop();
      osmdRef.current = null;
      renderedRef.current = false;
      container.innerHTML = '';
    };
  }, [scoreUrl, syncCursorPos]);

  // ── [TESTING] Console command: cursorUp() — advance cursor forward one beat ─────────
  useEffect(() => {
    window.cursorUp = () => {
      const osmd = osmdRef.current;
      if (!osmd?.cursor) {
        console.warn('[cursorUp] No OSMD cursor available yet.');
        return;
      }

      const iterator = osmd.cursor.iterator;

      if (iterator?.EndReached) {
        console.warn('[cursorUp] Cursor is already at the end of the score.');
        return;
      }
      iterator.moveToNext();

      // As suggested, run a loop for the next ~15 frames (about 250ms) to 
      // continuously check and render the cursor. This guarantees we catch
      // OSMD's DOM changes even if they are delayed by layout calculations.
      let frameCount = 0;
      const pollCursor = () => {
        syncCursorPos();
        frameCount++;
        if (frameCount < 15) {
          requestAnimationFrame(pollCursor);
        }
      };
      requestAnimationFrame(pollCursor);

      scrollToCursor();
      console.log('[cursorUp] Moved cursor forward one beat.');
    };

    return () => {
      delete window.cursorUp;
    };
  }, [syncCursorPos, scrollToCursor]);

  // ── React to play / pause ─────────────────────────────────────────────────
  useEffect(() => {
    if (!renderedRef.current) return;

    const updatePlayback = async () => {
      if (isPlaying) {
        await Tone.start();
        Tone.Transport.start();
        // startCursorLoop();
      } else {
        Tone.Transport.pause();
        // stopCursorLoop();
      }
    };

    updatePlayback();
  }, [isPlaying]);

  // ── Seek detection ────────────────────────────────────────────────────────
  useEffect(() => {
    const prev = prevProgressRef.current;
    const diff = Math.abs(progress - prev);
    prevProgressRef.current = progress;

    const wasSeeked = diff > 5;
    if (wasSeeked && renderedRef.current) {
      const totalDurationSecs = timelineRef.current.length > 0
        ? timelineRef.current[timelineRef.current.length - 1].time
        : null;

      const targetSecs = (progress / 100) * totalDurationSecs;

      Tone.Transport.seconds = targetSecs;
      resetCursor(targetSecs);

      if (isPlaying) {
        Tone.Transport.start();
        // startCursorLoop();
      }
    }
  }, [progress, isPlaying, resetCursor]);

  // ── JSX ───────────────────────────────────────────────────────────────────
  return (
    <div className="w-full h-full min-h-0 flex flex-col">
      {error && <p className="text-red-400 text-center text-sm mb-4 shrink-0">{error}</p>}
      {status && !error && <p className="text-textMuted text-center text-sm mb-4 shrink-0">{status}</p>}

      {/* position:relative so the absolute overlay is contained here */}
      <div
        ref={containerRef}
        style={{ width: '100%', minWidth: 0, position: 'relative' }}
        className="w-full flex-1 min-h-0 overflow-auto bg-white rounded-md text-black [&_svg]:max-w-none"
      >
        {/* Custom cursor — Spotify-green vertical bar that replaces OSMD's hidden img */}
        {cursorPos && renderedRef.current && (
          <div
            data-custom-cursor
            style={{
              position: 'absolute',
              left: cursorPos.left,
              top: cursorPos.top,
              width: '3px',
              height: cursorPos.height,
              background: '#1db954',
              borderRadius: '2px',
              zIndex: 10,
              pointerEvents: 'none',
              opacity: 0.85,
              transition: 'left 0.08s ease, top 0.12s ease',
              boxShadow: '0 0 10px rgba(29,185,84,0.7), 0 0 4px rgba(29,185,84,0.9)',
            }}
          />
        )}
      </div>
    </div>
  );
}



const SHEETS = [
  { id: 1, title: 'Moonlight Sonata', composer: 'Ludwig van Beethoven', image: 'https://images.unsplash.com/photo-1507838871-4439c5b1ef28?auto=format&fit=crop&w=400&q=80', scoreUrl: localScorePath('mariage-damour.mxl') },
  { id: 2, title: 'Für Elise in A Minor', composer: 'Ludwig van Beethoven', image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&w=400&q=80', scoreUrl: localScorePath('fr-elise--beethoven.mxl') },
  { id: 3, title: 'Für Elise', composer: 'Ludwig van Beethoven', image: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&w=400&q=80', scoreUrl: localScorePath('c-major.mxl') },
  { id: 4, title: 'Carmen Prelude', composer: 'Georges Bizet', image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=400&q=80', scoreUrl: localScorePath('c-minor.mxl') },
  { id: 5, title: 'Prelude in E Minor', composer: 'Frédéric Chopin', image: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?auto=format&fit=crop&w=400&q=80', scoreUrl: localScorePath('5.musicxml') },
  { id: 6, title: 'Gymnopédie No. 1', composer: 'Erik Satie', image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&q=80', scoreUrl: localScorePath('6.musicxml') },
  { id: 7, title: 'Nocturne Op. 9 No. 2', composer: 'Frédéric Chopin', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80', scoreUrl: localScorePath('7.musicxml') },
  { id: 8, title: 'Waltz of the Flowers', composer: 'Pyotr Ilyich Tchaikovsky', image: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?auto=format&fit=crop&w=400&q=80', scoreUrl: localScorePath('8.musicxml') },
];

export const ScoresPage = ({ className, children, variant, contentKey, ...props }) => {

  // ── Global player (persists across page navigation) ───────
  const { currentTrack, isPlaying, progress, play } = usePlayer();

  const [selectedSheet, setSelectedSheet] = useState(null);

  // add a ref to hold the resolve function of the sheet-load promise
  const sheetReadyRef = useRef(null);

  const openSheet = (sheet) => {
    setSelectedSheet(sheet);
    play(sheet, () => new Promise((resolve) => {
      sheetReadyRef.current = resolve; // called by onReady below
    }));
  };

  const closeSheet = () => setSelectedSheet(null);

  return (
    <div className="bg-background text-textMain font-sans antialiased selection:bg-primary selection:text-black">
      <>
        {/* Navbar */}
        <header>
          <nav className="fixed w-full z-50 top-0 transition-all duration-300 bg-black/80 backdrop-blur-md border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-20">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Icon className="w-5 h-5 text-black fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></Icon>
                  </div>
                  <Text variant="bold" className="font-display font-bold text-2xl tracking-tight"> SmartTunes </Text>
                </div>
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-textMuted">
                  <RouterLink className="hover:text-white transition-colors" to="/"> Home </RouterLink>
                  <Link className="hover:text-white transition-colors" href="#discover"> Discover </Link>
                  <Link className="hover:text-white transition-colors" href="#playlists"> Playlists </Link>
                  <RouterLink className="hover:text-white transition-colors" to="/scores"> Scores </RouterLink>
                  <Link className="hover:text-white transition-colors" href="#premium"> Games </Link>
                </div>
                <div className="flex items-center gap-3 md:gap-4">
                  <Button variant="primary" className="md:hidden p-2 rounded-full text-textMuted hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary" id="mobile-menu-toggle"><Icon className="w-6 h-6" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></Icon></Button>
                  <RouterLink to="/auth">
                    <Button variant="primary" className="hidden md:block text-sm font-bold text-white hover:text-primary transition-colors"> Log In </Button>
                  </RouterLink>
                  <RouterLink to="/auth">
                    <Button variant="primary" contentKey="cta_23" className="bg-white text-black px-4 py-2 md:px-6 md:py-2.5 rounded-full text-sm font-bold hover:bg-primary hover:scale-105 transition-all duration-200 hidden md:block"> Sign Up </Button>
                  </RouterLink>
                </div>
              </div>
            </div>
          </nav>
        </header>

        {/* Sheet Music Grid */}
        <main className="pt-28 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-display text-5xl font-bold mb-2">Music Score Library</h1>
            <p className="text-textMuted mb-8">Browse and explore our collection of sheet music.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {SHEETS.map((sheet) => {
                const isActive = currentTrack?.id === sheet.id;
                return (
                  <div key={sheet.id} className="group cursor-pointer" onClick={() => openSheet(sheet)}>
                    <div
                      className="relative aspect-square rounded-lg overflow-hidden mb-4 shadow-lg hover:shadow-xl transition-shadow"
                      style={isActive ? { boxShadow: '0 0 0 2px #1db954, 0 8px 24px rgba(29,185,84,0.3)' } : {}}
                    >
                      <Image variant="cover" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" src={sheet.image} alt={sheet.title} />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <div>
                          </div>
                        </div>
                      </div>
                      {isActive && isPlaying && (
                        <div style={{ position: 'absolute', bottom: '10px', left: '10px', display: 'flex', alignItems: 'flex-end', gap: '3px', height: '20px' }}>
                          {[1, 2, 3].map(i => (
                            <div key={i} style={{
                              width: '3px', background: '#1db954', borderRadius: '2px',
                              animation: `eq-bar-${i} 0.8s ease-in-out infinite alternate`,
                              height: i === 1 ? '12px' : i === 2 ? '20px' : '8px',
                            }} />
                          ))}
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors" style={isActive ? { color: '#1db954' } : {}}>{sheet.title}</h3>
                    <p className="text-sm text-textMuted">{sheet.composer}</p>
                  </div>
                );
              })}
            </div>
            <style>{`
              @keyframes eq-bar-1 { from { height: 6px; } to { height: 16px; } }
              @keyframes eq-bar-2 { from { height: 16px; } to { height: 8px; } }
              @keyframes eq-bar-3 { from { height: 4px; } to { height: 20px; } }
            `}</style>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-surface py-12 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <Icon className="w-3 h-3 text-black fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></Icon>
                  </div>
                  <Text variant="bold" className="font-display font-bold text-lg"> StreamFlow </Text>
                </div>
                <div className="flex gap-4">
                  <Link className="text-textMuted hover:text-white" href="#"><Icon className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path></Icon></Link>
                  <Link className="text-textMuted hover:text-white" href="#"><Icon className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></Icon></Link>
                </div>
              </div>
              <div>
                <h4 className="font-bold mb-4"> Company </h4>
                <ul className="space-y-2 text-sm text-textMuted">
                  <li><Link className="hover:text-white" href="#"> About </Link></li>
                  <li><Link className="hover:text-white" href="#"> Jobs </Link></li>
                  <li>
                    <Link className="hover:text-white" href="#"> For the Record </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4"> Communities </h4>
                <ul className="space-y-2 text-sm text-textMuted">
                  <li>
                    <Link className="hover:text-white" href="#"> For Artists </Link>
                  </li>
                  <li>
                    <Link className="hover:text-white" href="#"> Developers </Link>
                  </li>
                  <li>
                    <Link className="hover:text-white" href="#"> Advertising </Link>
                  </li>
                  <li>
                    <Link className="hover:text-white" href="#"> Investors </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4"> Useful Links </h4>
                <ul className="space-y-2 text-sm text-textMuted">
                  <li>
                    <Link className="hover:text-white" href="#"> Support </Link>
                  </li>
                  <li>
                    <Link className="hover:text-white" href="#"> Web Player </Link>
                  </li>
                  <li>
                    <Link className="hover:text-white" href="#"> Free Mobile App </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="text-xs text-textMuted pt-8 border-t border-white/5 flex justify-between">
              <p> © 2025 StreamFlow AB. </p>
              <div className="flex gap-4">
                <Link className="hover:text-white" href="#"> Legal </Link>
                <Link className="hover:text-white" href="#"> Privacy Center </Link>
                <Link className="hover:text-white" href="#"> Cookies </Link>
              </div>
            </div>
          </div>
        </footer>

        {/* Sheet Music Modal */}
        {selectedSheet && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
            <div className="bg-surface rounded-lg w-11/12 h-[95vh] max-w-7xl flex flex-col relative shadow-2xl min-h-0">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 border-b border-white/10 shrink-0">
                <div>
                  <h2 className="font-display text-3xl font-bold">{selectedSheet.title}</h2>
                  <p className="text-textMuted">{selectedSheet.composer}</p>
                </div>
                <button
                  onClick={() => setSelectedSheet(null)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X />
                </button>
              </div>

              {/* Modal Content - Sheet Music Rendering Area */}
              <div className="flex-1 min-h-0 flex flex-col p-6 bg-black/50 overflow-hidden">
                <SheetMusicViewer
                  scoreUrl={selectedSheet.scoreUrl}
                  isPlaying={isPlaying && currentTrack?.id === selectedSheet.id}
                  progress={currentTrack?.id === selectedSheet.id ? progress : 0}
                  onReady={(durationSeconds) => sheetReadyRef.current?.(durationSeconds)}
                />
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 p-6 border-t border-white/10 justify-end shrink-0">
                <Button className="px-6 py-2 rounded-full border border-white/20 hover:bg-white/10" onClick={closeSheet}>
                  Close
                </Button>
                <a
                  href={selectedSheet.scoreUrl}
                  download
                  className="inline-flex items-center px-6 py-2 rounded-full bg-primary text-black font-bold hover:bg-primaryHover transition-colors"
                >
                  Download
                </a>
              </div>
            </div>
          </div>
        )}
      </>
    </div>
  );
};
