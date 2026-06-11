import {
  Headphones, Music, Zap, Shield,
  Sparkles, Radio, Flame, Disc3, Guitar, Piano, Music2, Heart
} from 'lucide-react';

// ─── IndexPage Mock Data ──────────────────────────────────────────────────────

export const GLOW_COLORS = ['#2d1b6980', '#3b0d6b80', '#0d1a3b80', '#3b0a2d80', '#1b2d6980'];

export const FALLBACK_COVERS = [
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1526142684086-7ebd69df27a5?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?auto=format&fit=crop&w=600&q=80',
];

export const PLAYLIST_META = [
  { title: 'Deep Focus',      description: 'Electronic ambient for work.',  tracks: '42 tracks', tag: 'Ambient',  query: 'ambient focus instrumental' },
  { title: 'City Pop',        description: 'Japanese 80s funk & soul.',      tracks: '38 tracks', tag: 'Retro',    query: 'city pop japanese 80s' },
  { title: 'Workout Energy',  description: 'High BPM hits.',                 tracks: '55 tracks', tag: 'Energy',   query: 'workout gym energy' },
  { title: 'Late Night Jazz', description: 'Smooth saxophone vibes.',        tracks: '29 tracks', tag: 'Jazz',     query: 'smooth jazz saxophone night' },
];

export const FEATURES = [
  { icon: Headphones, title: 'Hi-Fi Audio',    description: 'Lossless quality up to 24-bit / 192 kHz. Hear every detail as the artist intended.', color: 'text-primary', bg: 'bg-primary/10' },
  { icon: Music,      title: 'Sheet Music',    description: 'View and play interactive sheet music synchronized with audio. Practice along.',       color: 'text-accent',  bg: 'bg-accent/10' },
  { icon: Zap,        title: 'AI Discovery',   description: 'Personalized curation that learns your taste. Never run out of music to love.',        color: 'text-accentPink', bg: 'bg-accentPink/10' },
  { icon: Shield,     title: 'Ad-Free',        description: 'No interruptions. Just pure, uninterrupted listening from the first note.',            color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
];

export const TESTIMONIALS = [
  { text: "The sheet music feature is a game changer. I've been learning piano and being able to follow along is incredible.", name: 'Aria K.',    role: 'Piano student',  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64', rating: 5 },
  { text: "The audio quality is genuinely the best I have ever heard. Switched from every other platform and never looked back.", name: 'Marcus T.', role: 'Audiophile',     avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64', rating: 5 },
  { text: 'Discovering new music feels natural and exciting again. The AI knows exactly what I need before I do.',              name: 'Sophie R.', role: 'Music producer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64', rating: 5 },
];

// ─── DiscoverPage Mock Data ───────────────────────────────────────────────────

export const GENRES = [
  { label: 'Pop',       icon: Sparkles, gradient: 'from-pink-500 to-rose-600',    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&q=80', query: 'pop hits' },
  { label: 'Electronic',icon: Radio,    gradient: 'from-cyan-500 to-blue-600',    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80', query: 'electronic' },
  { label: 'Hip-Hop',  icon: Flame,    gradient: 'from-orange-500 to-amber-600', image: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&w=400&q=80', query: 'hip hop' },
  { label: 'Jazz',     icon: Disc3,    gradient: 'from-violet-500 to-purple-600',image: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?auto=format&fit=crop&w=400&q=80', query: 'jazz' },
  { label: 'Rock',     icon: Guitar,   gradient: 'from-red-500 to-rose-700',     image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=400&q=80', query: 'rock' },
  { label: 'Classical',icon: Piano,    gradient: 'from-emerald-500 to-teal-600', image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=400&q=80', query: 'classical' },
  { label: 'R&B',      icon: Heart,    gradient: 'from-fuchsia-500 to-pink-600', image: 'https://images.unsplash.com/photo-1526142684086-7ebd69df27a5?auto=format&fit=crop&w=400&q=80', query: 'rnb soul' },
  { label: 'Ambient',  icon: Music2,   gradient: 'from-sky-500 to-indigo-600',   image: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=400&q=80', query: 'ambient' },
];

export const MOODS = [
  { label: 'Happy',     emoji: '☀️', color: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30' },
  { label: 'Chill',     emoji: '🌊', color: 'bg-blue-500/15 text-blue-300 border-blue-500/30' },
  { label: 'Focus',     emoji: '🎯', color: 'bg-green-500/15 text-green-300 border-green-500/30' },
  { label: 'Hype',      emoji: '🔥', color: 'bg-red-500/15 text-red-300 border-red-500/30' },
  { label: 'Romantic',  emoji: '💕', color: 'bg-pink-500/15 text-pink-300 border-pink-500/30' },
  { label: 'Melancholy',emoji: '🌙', color: 'bg-purple-500/15 text-purple-300 border-purple-500/30' },
  { label: 'Party',     emoji: '🎉', color: 'bg-orange-500/15 text-orange-300 border-orange-500/30' },
  { label: 'Workout',   emoji: '💪', color: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' },
];

export const RADIO_STATIONS = [
  { name: 'Top Hits Radio',   listeners: '1.2M', genre: 'Pop · R&B · Hip-Hop',  cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=200&q=80', live: true,  color: 'from-pink-500 to-rose-600',    query: 'top hits pop rnb hip hop' },
  { name: 'Chill Vibes FM',   listeners: '840K', genre: 'Lo-fi · Ambient · Jazz', cover: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?auto=format&fit=crop&w=200&q=80', live: true,  color: 'from-blue-500 to-indigo-600',   query: 'lofi chill ambient jazz relaxing' },
  { name: 'Electronic Pulse', listeners: '620K', genre: 'EDM · House · Techno',   cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=200&q=80', live: false, color: 'from-cyan-500 to-blue-600',     query: 'electronic edm house techno dance' },
];

// ─── SocialHub Mock Data ───────────────────────────────────────────────────────

export const SOCIAL_POSTS = [
  {
    id: 'post_mock_1',
    author: { name: 'Sarah Jenkins', avatar: 'https://i.pravatar.cc/150?u=sarah' },
    content: 'Can\'t stop listening to this track. The production on the chorus is absolutely mind-blowing! 🎧🔥',
    song: {
      trackId: 1459750468,
      trackName: 'Blinding Lights',
      artistName: 'The Weeknd',
      artworkUrl100: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&w=600&q=80',
      previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/cc/6d/65/cc6d655f-c2db-c2a4-f259-28c0490f84dd/mzaf_10793666270659345037.plus.aac.p.m4a'
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    likes: 124,
    isLiked: false
  },
  {
    id: 'post_mock_2',
    author: { name: 'Marcus D.', avatar: 'https://i.pravatar.cc/150?u=marcus' },
    content: 'Found a hidden gem today. If you like smooth R&B, this is a must-listen.',
    song: {
      trackId: 1440912113,
      trackName: 'Get You (feat. Kali Uchis)',
      artistName: 'Daniel Caesar',
      artworkUrl100: 'https://images.unsplash.com/photo-1526142684086-7ebd69df27a5?auto=format&fit=crop&w=600&q=80',
      previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/05/27/1f/05271fc2-c32f-48e0-1c31-620256eaab9b/mzaf_6717148560879555242.plus.aac.p.m4a'
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    likes: 89,
    isLiked: false
  },
  {
    id: 'post_mock_3',
    author: { name: 'Elena R.', avatar: 'https://i.pravatar.cc/150?u=elena' },
    content: 'This song always takes me back to the best summer of my life. The vibes are immaculate ✨',
    song: {
      trackId: 1440854841,
      trackName: 'Cruel Summer',
      artistName: 'Taylor Swift',
      artworkUrl100: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
      previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/cc/6d/65/cc6d655f-c2db-c2a4-f259-28c0490f84dd/mzaf_10793666270659345037.plus.aac.p.m4a'
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    likes: 342,
    isLiked: true
  },
  {
    id: 'post_mock_4',
    author: { name: 'David Chen', avatar: 'https://i.pravatar.cc/150?u=david' },
    content: 'Late night coding sessions require the perfect soundtrack. This is it right here 💻🌙',
    song: {
      trackId: 1440858162,
      trackName: 'Midnight City',
      artistName: 'M83',
      artworkUrl100: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?auto=format&fit=crop&w=600&q=80',
      previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/05/27/1f/05271fc2-c32f-48e0-1c31-620256eaab9b/mzaf_6717148560879555242.plus.aac.p.m4a'
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    likes: 56,
    isLiked: false
  },
  {
    id: 'post_mock_5',
    author: { name: 'Alex & Sam', avatar: 'https://i.pravatar.cc/150?u=alexsam' },
    content: 'Who else thinks this is one of the greatest guitar solos of all time? 🎸🤘',
    song: {
      trackId: 1440857466,
      trackName: 'Hotel California',
      artistName: 'Eagles',
      artworkUrl100: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80',
      previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/cc/6d/65/cc6d655f-c2db-c2a4-f259-28c0490f84dd/mzaf_10793666270659345037.plus.aac.p.m4a'
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    likes: 890,
    isLiked: true
  }
];
