import React, { useCallback, useEffect, useRef, useState } from 'react';
import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';
import * as Tone from 'tone';

/** Local MusicXML/MXL under `frontend/public/mockScores/` (served at `/mockScores/...`). */
export function localScorePath(fileName) {
  const base = (process.env.PUBLIC_URL || '').replace(/\/$/, '');
  return `${base}/mockScores/${fileName}`;
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
 *   scoreUrl                – URL of the MusicXML / MXL file
 *   isPlaying               – boolean from the global player context
 *   progress                – 0-100 from the global player context (used to detect seeks)
 *   onReady                 – callback when the score is fully loaded and rendered
 *   onCursorRenderingChange – callback when the cursor rendering state changes
 *   onForceReset            – callback to trigger component re-mount
 */
export function SheetMusicViewer({
  scoreUrl,
  isPlaying,
  progress,
  onReady,
  onTimelineParsed,
  onCursorRenderingChange,
  onForceReset,
}) {
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

  const onReadyRef = useRef(onReady);
  const onCursorRenderingChangeRef = useRef(onCursorRenderingChange);
  const onForceResetRef = useRef(onForceReset);

  // Keep callbacks ref up-to-date on every render
  useEffect(() => {
    onReadyRef.current = onReady;
    onCursorRenderingChangeRef.current = onCursorRenderingChange;
    onForceResetRef.current = onForceReset;
  });

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
    const osmd = osmdRef.current;
    const el = osmd?.cursor?.cursorElement;
    if (!el) return;

    const left = el.style.left;
    const top  = el.style.top;

    let finalHeight = 125; // fallback
    let customTop = top; // fallback to OSMD's top

    try {
      if (osmd.cursor && osmd.cursor.iterator) {
        const currentMeasureIndex = osmd.cursor.iterator.CurrentMeasureIndex;
        const graphicSheet = osmd.GraphicSheet || osmd.graphic;
        const measureList = graphicSheet?.MeasureList || graphicSheet?.measureList;

        if (measureList && measureList.length > currentMeasureIndex) {
          const stavesInMeasure = measureList[currentMeasureIndex];
          
          if (stavesInMeasure && stavesInMeasure.length > 0) {
            // stavesInMeasure is an array of staves for this specific measure.
            // [0] is the top staff (e.g. Treble), [length - 1] is the bottom staff (e.g. Bass)
            const topStaffMeasure = stavesInMeasure[0];
            const bottomStaffMeasure = stavesInMeasure[stavesInMeasure.length - 1];

            if (topStaffMeasure && bottomStaffMeasure) {
              const topStaffLine = topStaffMeasure.ParentStaffLine || topStaffMeasure.parentStaffLine;
              const bottomStaffLine = bottomStaffMeasure.ParentStaffLine || bottomStaffMeasure.parentStaffLine;

              if (topStaffLine && bottomStaffLine) {
                const topPos = topStaffLine.PositionAndShape || topStaffLine.positionAndShape;
                const bottomPos = bottomStaffLine.PositionAndShape || bottomStaffLine.positionAndShape;

                const topY = topPos?.AbsolutePosition?.y ?? topPos?.absolutePosition?.y;
                const bottomYRaw = bottomPos?.AbsolutePosition?.y ?? bottomPos?.absolutePosition?.y;

                if (topY !== undefined && bottomYRaw !== undefined) {
                  const bottomY = bottomYRaw + 4;
                  const heightInUnits = bottomY - topY;
                  const zoom = osmd.zoom || osmd.Zoom || 1;
                  // 1 unit = 10 pixels in OSMD
                  finalHeight = heightInUnits * 10 * zoom;
                  
                  // We also optionally fix the 'top' to align perfectly with the top staff line
                  customTop = (topY * 10 * zoom) + "px";
                }
              }
            }
          }
        }
      }
    } catch (err) {
      console.warn("Could not calculate dynamic measure height, using fallback", err);
    }

    console.log(`OSMD Cursor Height: ${el.style.height || 'N/A'} | Calculated Staff Height: ${finalHeight}px`);

    if (left && customTop) {
      setCursorPos(prev => {
        const newHeight = finalHeight + 'px';
        if (prev && prev.left === left && prev.top === customTop && prev.height === newHeight) return prev;
        return { left, top: customTop, height: newHeight };
      });
    }
  }, []);

  /** Scroll our custom cursor overlay into view. */
  const scrollToCursor = useCallback(() => {
    // Find our own overlay div (a sibling of the OSMD container inside parent)
    const parent = containerRef.current?.parentElement;
    const overlay = parent?.querySelector('[data-custom-cursor]');
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
          const bpm = osmd.Sheet?.DefaultStartTempoInBpm || osmd.sheet?.DefaultStartTempoInBpm || 120;
          const secondsPerQuarterNote = 60 / Math.max(bpm, 1);

          if (!synthRef.current) {
            synthRef.current = new Tone.PolySynth(Tone.Synth).toDestination();
          }
          const synth = synthRef.current;

          Tone.Transport.bpm.value = bpm;
          Tone.Transport.stop(); // FIX: Reset timeline time to 0, otherwise it resumes from the previous song's position!
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
              }

              // Always sync UI exactly to audio timing context using Tone.Draw, EVEN on rests.
              // If we skip rests, the visual cursor permanently falls behind the audio!
              Tone.Draw.schedule(() => {
                const innerOsmd = osmdRef.current;
                if (!innerOsmd) return;
                
                innerOsmd.cursor.next();
                syncCursorPos();
                scrollToCursor();
              }, t);
            }, timeSeconds);

            iterator.moveToNext();
          }

          timelineRef.current = timeline;
          const totalDurationSecs = currentTime;
          
          if (onTimelineParsed) {
            onTimelineParsed(timeline);
          }

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
          onReadyRef.current?.(totalDurationSecs);

          // FIX: If the user impatiently clicked "Play" on the global player while the 
          // sheet was still loading, the `isPlaying` state became `true` too early.
          // Force Tone.js to start now so it doesn't get stuck in a locked state!
          if (isPlayingRef.current) {
            Tone.start().then(() => Tone.Transport.start());
          }
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

  // ── [TESTING] Console command: await() and awaitCursor() ──────────────────
  useEffect(() => {
    window.forceResetCursor = () => {
      console.log('[forceResetCursor] Reloading page...');
      window.location.reload();
    };

    window.awaitCursor = () => {
      return new Promise((resolve, reject) => {
        const isRendering = !!(cursorPos && renderedRef.current);
        if (isRendering) {
          resolve(true);
          return;
        }

        let secondsElapsed = 0;
        const interval = setInterval(() => {
          secondsElapsed += 0.1;
          const currentRendering = !!(osmdRef.current?.cursor?.cursorElement && renderedRef.current);
          if (currentRendering) {
            clearInterval(interval);
            resolve(true);
          } else if (secondsElapsed >= 5) {
            clearInterval(interval);
            console.warn('[awaitCursor] Cursor failed to render within 5 seconds. Reloading page...');
            window.location.reload();
            reject(new Error('Cursor failed to render within 5 seconds. Page reload triggered.'));
          }
        }, 100);
      });
    };

    window.await = window.awaitCursor;

    return () => {
      delete window.forceResetCursor;
      delete window.awaitCursor;
      delete window.await;
    };
  }, [cursorPos]);

  // ── Automatic 5-second timeout to force refresh page if cursor fails to render ────
  useEffect(() => {
    const isRendering = !!(cursorPos && renderedRef.current);
    if (isRendering) return;

    const timer = setTimeout(() => {
      console.warn('[TIMEOUT] Cursor failed to render within 5 seconds. Auto-reload is currently disabled for debugging.');
      // window.location.reload(); // DISABLED FOR DEBUGGING
    }, 5000);

    return () => clearTimeout(timer);
  }, [cursorPos]);

  // ── Notify cursor rendering state changes ───────────────────────────────────
  useEffect(() => {
    onCursorRenderingChangeRef.current?.(!!(cursorPos && renderedRef.current));
    return () => {
      onCursorRenderingChangeRef.current?.(false);
    };
  }, [cursorPos]);

  // ── React to play / pause ─────────────────────────────────────────────────
  useEffect(() => {
    if (!renderedRef.current) return;

    const updatePlayback = async () => {
      if (isPlaying) {
        await Tone.start();
        Tone.Transport.start();
      } else {
        Tone.Transport.pause();
      }
    };

    updatePlayback();
  }, [isPlaying]);

  // ── Seek detection ────────────────────────────────────────────────────────
  useEffect(() => {
    const prev = prevProgressRef.current;
    
    // We calculate the maximum expected increment from a native 250ms interval tick.
    const totalDurationSecs = timelineRef.current.length > 0
      ? timelineRef.current[timelineRef.current.length - 1].time
      : 60;
    
    const expectedMaxTick = (0.3 / totalDurationSecs) * 100 + 1.0; 
    
    // A seek occurs if progress jumps backwards, or jumps forward more than a native tick
    const wasSeeked = progress < prev - 0.1 || (progress - prev) > expectedMaxTick;
    
    prevProgressRef.current = progress;

    if (wasSeeked && renderedRef.current) {
      const targetSecs = (progress / 100) * totalDurationSecs;

      Tone.Transport.seconds = targetSecs;
      resetCursor(targetSecs);

      if (isPlaying) {
        Tone.Transport.start();
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
        className="w-full flex-1 min-h-0 overflow-auto bg-white rounded-md text-black relative"
      >
        {/* Isolated target div for OSMD rendering - must NOT contain any React children */}
        <div
          ref={containerRef}
          style={{ width: '100%', minWidth: 0 }}
          className="w-full [&_svg]:max-w-none"
        />

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
