import React from 'react';

const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds === null || seconds === undefined) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * PlayerControlBar
 *
 * Props:
 *  track           – currently loaded track object { id, title, composer, image }
 *  isPlaying       – boolean
 *  progress        – number 0-100
 *  volume          – number 0-1
 *  isMuted         – boolean
 *  onPlayPause()
 *  onPrev()
 *  onNext()
 *  onSeek(value)   – value 0-100
 *  onVolumeChange(value) – value 0-1
 *  onMuteToggle()
 *  onClose()
 */
export function PlayerControlBar({
  track,
  isPlaying,
  progress,
  volume,
  isMuted,
  onPlayPause,
  onPrev,
  onNext,
  onSeek,
  onVolumeChange,
  onMuteToggle,
  onClose,
}) {
  if (!track) return null;

  const VolumeIcon = () => {
    if (isMuted || volume === 0)
      return (
        <path
          d="M5.889 16H2a1 1 0 01-1-1V9a1 1 0 011-1h3.889l5.294-4.332A.5.5 0 0112 4.02v15.96a.5.5 0 01-.817.387L5.89 16zm13.517-8a8.003 8.003 0 010 8 .5.5 0 11-.817-.578 7 7 0 000-6.844.5.5 0 01.817-.578z"
          fill="currentColor"
        />
      );
    if (volume < 0.4)
      return (
        <path
          d="M5.889 16H2a1 1 0 01-1-1V9a1 1 0 011-1h3.889l5.294-4.332A.5.5 0 0112 4.02v15.96a.5.5 0 01-.817.387L5.89 16zm7.517-4a3.5 3.5 0 010 0z"
          fill="currentColor"
        />
      );
    return (
      <path
        d="M5.889 16H2a1 1 0 01-1-1V9a1 1 0 011-1h3.889l5.294-4.332A.5.5 0 0112 4.02v15.96a.5.5 0 01-.817.387L5.89 16zm7.517-12a10 10 0 010 16 .5.5 0 11-.578-.816 9 9 0 000-14.368.5.5 0 11.578-.816zm-2.29 3.29a6 6 0 010 9.42.5.5 0 11-.578-.816 5 5 0 000-7.788.5.5 0 11.578-.816z"
        fill="currentColor"
      />
    );
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: 'linear-gradient(0deg, #0a0a0a 0%, #111113 100%)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        padding: '0 24px',
        height: '90px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        boxShadow: '0 -4px 32px rgba(0,0,0,0.6)',
      }}
    >
      {/* ── Track Info ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: '0 0 280px', minWidth: 0 }}>
        <div
          style={{
            width: '56px', height: '56px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0,
            boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
          }}
        >
          <img src={track.image} alt={track.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        <div style={{ minWidth: 0 }}>
          <p style={{ fontWeight: 700, fontSize: '14px', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '2px' }}>
            {track.title}
          </p>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {track.composer}
          </p>
        </div>

        {/* Like */}
        <button
          onClick={() => {}}
          title="Save to library"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', padding: '4px', marginLeft: '4px', transition: 'color 0.15s', flexShrink: 0 }}
          onMouseEnter={e => (e.currentTarget.style.color = '#1db954')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
        </button>
      </div>

      {/* ── Center Controls ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minWidth: 0 }}>
        {/* Transport buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Shuffle */}
          <button
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', padding: '4px', transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 3 21 3 21 8" />
              <line x1="4" y1="20" x2="21" y2="3" />
              <polyline points="21 16 21 21 16 21" />
              <line x1="15" y1="15" x2="21" y2="21" />
            </svg>
          </button>

          {/* Prev */}
          <button
            onClick={onPrev}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', padding: '4px', transition: 'color 0.15s, transform 0.1s' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'scale(1.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
            </svg>
          </button>

          {/* Play/Pause */}
          <button
            onClick={onPlayPause}
            style={{
              width: '44px', height: '44px', borderRadius: '50%',
              background: '#fff', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'transform 0.1s, background 0.15s',
              boxShadow: '0 0 16px rgba(255,255,255,0.15)',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.06)'; e.currentTarget.style.background = '#1db954'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = '#fff'; }}
          >
            {isPlaying ? (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="#000">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="#000">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            )}
          </button>

          {/* Next */}
          <button
            onClick={onNext}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', padding: '4px', transition: 'color 0.15s, transform 0.1s' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'scale(1.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
              <path d="M6 18l8.5-6L6 6v12zm2-8.14L11.03 12 8 14.14V9.86zM16 6h2v12h-2z" />
            </svg>
          </button>

          {/* Repeat */}
          <button
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', padding: '4px', transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="17 1 21 5 17 9" />
              <path d="M3 11V9a4 4 0 014-4h14" />
              <polyline points="7 23 3 19 7 15" />
              <path d="M21 13v2a4 4 0 01-4 4H3" />
            </svg>
          </button>
        </div>

        {/* Progress bar */}
        <div style={{ width: '100%', maxWidth: '500px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', minWidth: '36px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
            {formatTime(Math.floor((progress / 100) * (track.duration)))}
          </span>

          <div
            style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.15)', borderRadius: '2px', cursor: 'pointer', position: 'relative' }}
            onClick={e => {
              const rect = e.currentTarget.getBoundingClientRect();
              onSeek(Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)));
            }}
            onMouseEnter={e => {
              e.currentTarget.querySelector('.pcb-fill').style.background = '#1db954';
              e.currentTarget.querySelector('.pcb-thumb').style.opacity = '1';
            }}
            onMouseLeave={e => {
              e.currentTarget.querySelector('.pcb-fill').style.background = '#fff';
              e.currentTarget.querySelector('.pcb-thumb').style.opacity = '0';
            }}
          >
            <div
              className="pcb-fill"
              style={{ height: '100%', width: `${progress}%`, background: '#fff', borderRadius: '2px', transition: 'background 0.15s', position: 'relative' }}
            >
              <div
                className="pcb-thumb"
                style={{ position: 'absolute', right: '-5px', top: '50%', transform: 'translateY(-50%)', width: '10px', height: '10px', borderRadius: '50%', background: '#fff', opacity: 0, transition: 'opacity 0.15s' }}
              />
            </div>
          </div>

          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', minWidth: '36px', fontVariantNumeric: 'tabular-nums' }}>
            {formatTime(Math.max(0, Math.floor(track.duration)))}
          </span>
        </div>
      </div>

      {/* ── Right Controls ── */}
      <div style={{ flex: '0 0 220px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
        {/* Queue */}
        <button
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', padding: '4px', transition: 'color 0.15s' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h10v2H4z" />
          </svg>
        </button>

        {/* Mute toggle */}
        <button
          onClick={onMuteToggle}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', padding: '4px', transition: 'color 0.15s', flexShrink: 0 }}
          onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <VolumeIcon />
          </svg>
        </button>

        {/* Volume slider */}
        <div
          style={{ width: '90px', height: '4px', background: 'rgba(255,255,255,0.15)', borderRadius: '2px', cursor: 'pointer', position: 'relative' }}
          onClick={e => {
            const rect = e.currentTarget.getBoundingClientRect();
            onVolumeChange(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)));
          }}
          onMouseEnter={e => (e.currentTarget.querySelector('.pcb-vfill').style.background = '#1db954')}
          onMouseLeave={e => (e.currentTarget.querySelector('.pcb-vfill').style.background = '#fff')}
        >
          <div
            className="pcb-vfill"
            style={{ height: '100%', width: `${isMuted ? 0 : volume * 100}%`, background: '#fff', borderRadius: '2px', transition: 'background 0.15s' }}
          />
        </div>

        {/* Close player */}
        <button
          onClick={onClose}
          title="Close player"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.35)', padding: '4px', transition: 'color 0.15s', marginLeft: '4px' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#ff4444')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
