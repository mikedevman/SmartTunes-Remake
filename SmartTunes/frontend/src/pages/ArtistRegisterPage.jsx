import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Music2, User, Tag, FileText, ChevronRight,
  ChevronLeft, Check, Upload, Sparkles, Mic2, Guitar,
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { useArtist } from '../components/ArtistContext';

// ─── Genre options ────────────────────────────────────────────────────────────

const GENRES = [
  'Pop', 'Hip-Hop', 'R&B', 'Rock', 'Electronic', 'Jazz',
  'Classical', 'Country', 'Reggae', 'Latin', 'Folk', 'Indie',
  'Metal', 'Blues', 'Soul', 'Ambient',
];

// ─── Step indicator ───────────────────────────────────────────────────────────

const StepDot = ({ index, current, label }) => (
  <div className="flex flex-col items-center gap-1.5">
    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
      index < current
        ? 'bg-primary text-background'
        : index === current
          ? 'bg-primary text-background shadow-lg shadow-primary/40 scale-110'
          : 'bg-white/10 text-textMuted'
    }`}>
      {index < current ? <Check className="w-4 h-4" /> : index + 1}
    </div>
    <span className={`text-xs font-medium hidden sm:block transition-colors ${
      index <= current ? 'text-white' : 'text-textMuted'
    }`}>{label}</span>
  </div>
);

// ─── Avatar picker ────────────────────────────────────────────────────────────

const AvatarPicker = ({ value, onChange }) => {
  const inputRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onChange(url);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        onClick={() => inputRef.current?.click()}
        className="w-32 h-32 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center cursor-pointer hover:border-primary/60 transition-all group overflow-hidden bg-white/5 relative"
      >
        {value ? (
          <img src={value} alt="avatar" className="w-full h-full object-cover" />
        ) : (
          <div className="text-center text-textMuted group-hover:text-primary transition-colors">
            <User className="w-10 h-10 mx-auto mb-1" />
            <span className="text-xs">Add photo</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Upload className="w-6 h-6 text-white" />
        </div>
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      {value && (
        <button onClick={() => onChange('')} className="text-xs text-textMuted hover:text-red-400 transition-colors">
          Remove photo
        </button>
      )}
    </div>
  );
};

// ─── Main page ────────────────────────────────────────────────────────────────

export const ArtistRegisterPage = () => {
  const navigate = useNavigate();
  const { registerArtist, isArtist } = useArtist();
  const [step, setStep] = useState(0);

  const [form, setForm] = useState({
    name:       '',
    stageName:  '',
    genre:      '',
    bio:        '',
    avatar:     '',
    website:    '',
    instagram:  '',
  });

  const [errors, setErrors] = useState({});

  // If already an artist, redirect
  if (isArtist) {
    navigate('/artist-dashboard', { replace: true });
    return null;
  }

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value ?? e }));

  const validate = () => {
    const e = {};
    if (step === 0 && !form.name.trim())      e.name = 'Display name is required';
    if (step === 0 && !form.stageName.trim())  e.stageName = 'Stage name is required';
    if (step === 1 && !form.genre)             e.genre = 'Please select a genre';
    if (step === 2 && form.bio.length < 30)    e.bio = 'Bio must be at least 30 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate()) setStep((s) => s + 1); };
  const prev = () => setStep((s) => Math.max(0, s - 1));

  const handleSubmit = () => {
    if (!validate()) return;
    registerArtist({
      name:      form.name.trim(),
      stageName: form.stageName.trim(),
      genre:     form.genre,
      bio:       form.bio.trim(),
      avatar:    form.avatar,
      website:   form.website.trim(),
      instagram: form.instagram.trim(),
    });
    navigate('/artist-dashboard');
  };

  const STEPS = ['Profile', 'Genre', 'About', 'Review'];

  return (
    <div className="bg-background text-textMain font-sans antialiased min-h-screen">
      <Navbar />

      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-[100px]" />
      </div>

      <div className="min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-12">
        <div className="w-full max-w-xl">

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="w-3 h-3" /> Become an Artist
            </div>
            <h1 className="font-display text-4xl font-bold mb-2">Create your artist profile</h1>
            <p className="text-textMuted">Share your music with the world on SmartTunes</p>
          </div>

          {/* Step dots */}
          <div className="flex items-center justify-center gap-4 mb-8">
            {STEPS.map((label, i) => (
              <React.Fragment key={label}>
                <StepDot index={i} current={step} label={label} />
                {i < STEPS.length - 1 && (
                  <div className={`h-px flex-1 max-w-[60px] transition-colors duration-300 ${i < step ? 'bg-primary' : 'bg-white/10'}`} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Card */}
          <div className="glass-panel rounded-2xl p-8 border border-white/10 shadow-2xl">

            {/* ── Step 0: Profile ── */}
            {step === 0 && (
              <div className="space-y-6">
                <AvatarPicker value={form.avatar} onChange={(v) => setForm((f) => ({ ...f, avatar: v }))} />
                <div>
                  <label className="block text-sm font-semibold mb-2">Display Name *</label>
                  <input
                    value={form.name}
                    onChange={set('name')}
                    placeholder="Your real name"
                    className="input-field w-full"
                  />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Stage Name / Artist Name *</label>
                  <input
                    value={form.stageName}
                    onChange={set('stageName')}
                    placeholder="The name fans will know you by"
                    className="input-field w-full"
                  />
                  {errors.stageName && <p className="text-red-400 text-xs mt-1">{errors.stageName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Website <span className="text-textMuted font-normal">(optional)</span></label>
                  <input
                    value={form.website}
                    onChange={set('website')}
                    placeholder="https://yourwebsite.com"
                    className="input-field w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Instagram <span className="text-textMuted font-normal">(optional)</span></label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted text-sm">@</span>
                    <input
                      value={form.instagram}
                      onChange={set('instagram')}
                      placeholder="yourhandle"
                      className="input-field w-full pl-8"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 1: Genre ── */}
            {step === 1 && (
              <div>
                <h2 className="font-display font-bold text-xl mb-1">What's your primary genre?</h2>
                <p className="text-textMuted text-sm mb-6">This helps us recommend your music to the right listeners.</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {GENRES.map((g) => (
                    <button
                      key={g}
                      onClick={() => setForm((f) => ({ ...f, genre: g }))}
                      className={`px-4 py-3 rounded-xl text-sm font-semibold border transition-all ${
                        form.genre === g
                          ? 'bg-primary/20 border-primary text-primary'
                          : 'bg-white/5 border-white/10 text-textMuted hover:border-white/20 hover:text-white'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
                {errors.genre && <p className="text-red-400 text-xs mt-4">{errors.genre}</p>}
              </div>
            )}

            {/* ── Step 2: Bio ── */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display font-bold text-xl mb-1">Tell us your story</h2>
                  <p className="text-textMuted text-sm mb-4">Give listeners a glimpse into who you are as an artist.</p>
                  <textarea
                    value={form.bio}
                    onChange={set('bio')}
                    rows={6}
                    placeholder="Share your musical journey, influences, what makes your sound unique..."
                    className="input-field w-full resize-none"
                  />
                  <div className="flex items-center justify-between mt-1">
                    {errors.bio
                      ? <p className="text-red-400 text-xs">{errors.bio}</p>
                      : <span className="text-xs text-textMuted">Minimum 30 characters</span>
                    }
                    <span className={`text-xs ${form.bio.length >= 30 ? 'text-primary' : 'text-textMuted'}`}>
                      {form.bio.length} chars
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 3: Review ── */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="font-display font-bold text-xl mb-1">Review your profile</h2>
                <div className="flex items-center gap-5 p-5 bg-white/5 rounded-2xl border border-white/10">
                  {form.avatar ? (
                    <img src={form.avatar} alt="avatar" className="w-20 h-20 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                      <span className="text-3xl font-black text-white">{form.stageName?.[0]?.toUpperCase() ?? '?'}</span>
                    </div>
                  )}
                  <div>
                    <p className="font-display font-bold text-xl">{form.stageName}</p>
                    <p className="text-textMuted text-sm">{form.name}</p>
                    <span className="mt-1 inline-block text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">{form.genre}</span>
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-sm text-textMuted leading-relaxed">{form.bio}</p>
                </div>
                {(form.website || form.instagram) && (
                  <div className="flex gap-3 flex-wrap">
                    {form.website && (
                      <span className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-textMuted">{form.website}</span>
                    )}
                    {form.instagram && (
                      <span className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-textMuted">@{form.instagram}</span>
                    )}
                  </div>
                )}
                <p className="text-xs text-textMuted/60 text-center">By continuing you agree to SmartTunes' Artist Terms of Service.</p>
              </div>
            )}

            {/* Navigation buttons */}
            <div className={`flex mt-8 gap-3 ${step > 0 ? 'justify-between' : 'justify-end'}`}>
              {step > 0 && (
                <button onClick={prev} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-textMuted hover:text-white hover:border-white/20 transition-all text-sm font-semibold">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
              )}
              {step < STEPS.length - 1 ? (
                <button onClick={next} className="btn-primary flex items-center gap-2 px-6 py-2.5 ml-auto">
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button onClick={handleSubmit} className="btn-primary flex items-center gap-2 px-6 py-2.5 ml-auto">
                  <Mic2 className="w-4 h-4" /> Launch my profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
