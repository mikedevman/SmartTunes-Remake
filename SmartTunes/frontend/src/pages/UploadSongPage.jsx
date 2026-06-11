import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload, Music2, Image as ImageIcon, X, Check,
  Loader2, ChevronLeft, Tag, FileAudio, Clock,
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { useArtist } from '../components/ArtistContext';
import { usePlayer } from '../components/PlayerContext';

const GENRES = [
  'Pop', 'Hip-Hop', 'R&B', 'Rock', 'Electronic', 'Jazz',
  'Classical', 'Country', 'Reggae', 'Latin', 'Folk', 'Indie',
  'Metal', 'Blues', 'Soul', 'Ambient',
];

// ─── Drag-and-drop zone ───────────────────────────────────────────────────────

const DropZone = ({ onFile, accept, icon: Icon, label, sublabel, preview, onClear }) => {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file) => {
    if (!file) return;
    onFile(file);
  };

  return (
    <div
      onClick={() => !preview && inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
      className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 overflow-hidden ${
        dragging
          ? 'border-primary bg-primary/10 scale-[1.01]'
          : preview
            ? 'border-primary/40 bg-primary/5'
            : 'border-white/15 bg-white/3 hover:border-primary/40 hover:bg-primary/5 cursor-pointer'
      }`}
    >
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
      <div className="p-6 flex flex-col items-center justify-center text-center min-h-[120px]">
        {preview ? (
          <>
            <div className="flex items-center gap-3 w-full">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1 text-left">
                <p className="text-sm font-semibold truncate">{preview.name}</p>
                <p className="text-xs text-textMuted">{(preview.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onClear(); }}
                className="p-1.5 rounded-full bg-white/10 hover:bg-red-500/20 hover:text-red-400 transition-all flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
              <Icon className="w-6 h-6 text-textMuted" />
            </div>
            <p className="font-semibold text-sm mb-1">{label}</p>
            <p className="text-xs text-textMuted">{sublabel}</p>
          </>
        )}
      </div>
    </div>
  );
};

// ─── Cover art preview ────────────────────────────────────────────────────────

const CoverPreview = ({ file, url, onClear }) => {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (f) => {
    if (!f) return;
    const objUrl = URL.createObjectURL(f);
    url.set({ file: f, url: objUrl });
  };

  return (
    <div
      onClick={() => !url.val && inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
      className={`relative aspect-square rounded-2xl border-2 border-dashed overflow-hidden transition-all duration-200 group ${
        dragging ? 'border-primary scale-[1.01]' : url.val ? 'border-primary/40' : 'border-white/15 hover:border-primary/40 cursor-pointer'
      }`}
    >
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
      {url.val ? (
        <>
          <img src={url.val} alt="cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-all">
              <ImageIcon className="w-5 h-5 text-white" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onClear(); }} className="p-2 bg-red-500/30 rounded-full hover:bg-red-500/50 transition-all">
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
          <ImageIcon className="w-8 h-8 text-textMuted mb-2" />
          <p className="text-sm font-semibold text-textMuted">Cover Art</p>
          <p className="text-xs text-textMuted/60 mt-1">Drag or click</p>
        </div>
      )}
    </div>
  );
};

// ─── Main page ────────────────────────────────────────────────────────────────

export const UploadSongPage = () => {
  const navigate = useNavigate();
  const { artist, isArtist, uploadSong } = useArtist();
  const { play } = usePlayer();

  const [audioFile,   setAudioFile]   = useState(null);
  const [coverFile,   setCoverFile]   = useState(null);
  const [coverUrl,    setCoverUrl]    = useState('');
  const [uploading,   setUploading]   = useState(false);
  const [done,        setDone]        = useState(false);

  const [form, setForm] = useState({
    title:       '',
    genre:       artist?.genre ?? '',
    description: '',
    isExplicit:  false,
  });
  const [errors, setErrors] = useState({});

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  if (!isArtist) {
    navigate('/artist-register', { replace: true });
    return null;
  }

  const validate = () => {
    const e = {};
    if (!audioFile)             e.audio = 'Please upload an audio file';
    if (!form.title.trim())     e.title = 'Song title is required';
    if (!form.genre)            e.genre = 'Genre is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setUploading(true);

    let finalCoverUrl = null;
    if (coverFile) {
      // Convert image to Base64 so it persists in localStorage across reloads
      finalCoverUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(coverFile);
      });
    }

    // Simulate upload delay
    await new Promise((r) => setTimeout(r, 1200));

    // Audio remains a Blob URL due to size limits in localStorage
    const audioUrl = URL.createObjectURL(audioFile);

    const song = uploadSong({
      title:       form.title.trim(),
      genre:       form.genre,
      description: form.description.trim(),
      isExplicit:  form.isExplicit,
      artistName:  artist.stageName,
      coverUrl:    finalCoverUrl || `https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=400&q=80`,
      audioUrl,
      fileName:    audioFile.name,
      fileSize:    audioFile.size,
      // Expose as a player-compatible track object
      trackName:   form.title.trim(),
      artistName:  artist.stageName,
      artworkUrl100: finalCoverUrl || `https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=400&q=80`,
      previewUrl:  audioUrl,
    });

    setUploading(false);
    setDone(true);
  };

  if (done) {
    return (
      <div className="bg-background text-textMain font-sans antialiased min-h-screen">
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 pt-20 text-center">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
            <Check className="w-10 h-10 text-primary" />
          </div>
          <h1 className="font-display text-4xl font-bold">Song uploaded!</h1>
          <p className="text-textMuted max-w-sm">
            <strong className="text-white">{form.title}</strong> is now live on your artist profile.
          </p>
          <div className="flex gap-4 mt-2">
            <button onClick={() => navigate('/artist-dashboard')} className="btn-primary px-6 py-2.5">
              Go to Dashboard
            </button>
            <button onClick={() => { setDone(false); setAudioFile(null); setCoverFile(null); setCoverUrl(''); setForm({ title: '', genre: artist?.genre ?? '', description: '', isExplicit: false }); }} className="btn-ghost px-6 py-2.5 text-white border border-white/10 rounded-xl hover:bg-white/5">
              Upload Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-textMain font-sans antialiased min-h-screen">
      <Navbar />

      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-primary/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-accent/8 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24">
        {/* Back */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-textMuted hover:text-white transition-colors mb-8 group">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Back to Dashboard
        </button>

        <div className="mb-8">
          <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-2">Artist Studio</p>
          <h1 className="font-display text-4xl font-bold">Upload a Song</h1>
          <p className="text-textMuted mt-2">Share your music with SmartTunes listeners</p>
        </div>

        <div className="grid lg:grid-cols-[1fr_280px] gap-8">

          {/* ── Left column ── */}
          <div className="space-y-6">

            {/* Audio file */}
            <div>
              <label className="block text-sm font-semibold mb-2">Audio File *</label>
              <DropZone
                onFile={(f) => setAudioFile(f)}
                accept="audio/*"
                icon={FileAudio}
                label="Drop your audio file here"
                sublabel="MP3, WAV, FLAC, AAC — up to 200 MB"
                preview={audioFile}
                onClear={() => setAudioFile(null)}
              />
              {errors.audio && <p className="text-red-400 text-xs mt-1">{errors.audio}</p>}
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold mb-2">Song Title *</label>
              <input
                value={form.title}
                onChange={set('title')}
                placeholder="What's this song called?"
                className="input-field w-full"
              />
              {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
            </div>

            {/* Genre */}
            <div>
              <label className="block text-sm font-semibold mb-2">Genre *</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {GENRES.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, genre: g }))}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      form.genre === g
                        ? 'bg-primary/20 border-primary text-primary'
                        : 'bg-white/5 border-white/10 text-textMuted hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
              {errors.genre && <p className="text-red-400 text-xs mt-1">{errors.genre}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold mb-2">Description <span className="text-textMuted font-normal">(optional)</span></label>
              <textarea
                value={form.description}
                onChange={set('description')}
                rows={4}
                placeholder="Tell listeners what inspired this song..."
                className="input-field w-full resize-none"
              />
            </div>

            {/* Explicit */}
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${form.isExplicit ? 'bg-primary border-primary' : 'border-white/20 group-hover:border-white/40'}`}
                onClick={() => setForm((f) => ({ ...f, isExplicit: !f.isExplicit }))}>
                {form.isExplicit && <Check className="w-3 h-3 text-background" strokeWidth={3} />}
              </div>
              <span className="text-sm font-medium">This song contains explicit content</span>
            </label>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={uploading}
              className="w-full btn-primary py-4 text-base font-bold flex items-center justify-center gap-3 mt-4"
            >
              {uploading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Uploading…</>
              ) : (
                <><Upload className="w-5 h-5" /> Publish Song</>
              )}
            </button>
          </div>

          {/* ── Right column: cover art ── */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold">Cover Art <span className="text-textMuted font-normal">(optional)</span></label>
            <CoverPreview
              file={coverFile}
              url={{ val: coverUrl, set: ({ file, url }) => { setCoverFile(file); setCoverUrl(url); } }}
              onClear={() => { setCoverFile(null); setCoverUrl(''); }}
            />
            <p className="text-xs text-textMuted text-center">Recommended: 3000×3000px JPG or PNG</p>

            {/* Artist badge */}
            <div className="glass-panel rounded-xl p-4 border border-white/8 mt-4">
              <p className="text-xs text-textMuted uppercase tracking-widest mb-3 font-semibold">Uploading as</p>
              <div className="flex items-center gap-3">
                {artist.avatar ? (
                  <img src={artist.avatar} className="w-10 h-10 rounded-full object-cover" alt="avatar" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <span className="font-bold text-white text-sm">{artist.stageName?.[0]?.toUpperCase()}</span>
                  </div>
                )}
                <div>
                  <p className="font-bold text-sm">{artist.stageName}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">{artist.genre}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
