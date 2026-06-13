import { useState, useEffect } from 'react';
import {
  Headphones, Music, Zap, Shield,
  Sparkles, Radio, Flame, Disc3, Guitar, Piano, Music2, Heart
} from 'lucide-react';
import { localScorePath } from '../components/SheetMusicViewer';

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
  { name: 'Top Hits Radio',   listeners: '840', genre: 'Pop · R&B · Hip-Hop',  cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=200&q=80', live: true,  color: 'from-pink-500 to-rose-600',    query: 'top hits pop rnb hip hop' },
  { name: 'Chill Vibes FM',   listeners: '112', genre: 'Lo-fi · Ambient · Jazz', cover: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?auto=format&fit=crop&w=200&q=80', live: true,  color: 'from-blue-500 to-indigo-600',   query: 'lofi chill ambient jazz relaxing' },
  { name: 'Electronic Pulse', listeners: '96', genre: 'EDM · House · Techno',   cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=200&q=80', live: false, color: 'from-cyan-500 to-blue-600',     query: 'electronic edm house techno dance' },
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

export const SOCIAL_COMMENTS = {
  post_mock_1: [
    { id: 'comment_1_1', author: { name: 'Mia L.', avatar: 'https://i.pravatar.cc/150?u=mia' }, text: 'That chorus hits so hard!', timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString() },
    { id: 'comment_1_2', author: { name: 'Noah B.', avatar: 'https://i.pravatar.cc/150?u=noah' }, text: 'I love the production on this one. Feels cinematic.', timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString() }
  ],
  post_mock_2: [
    { id: 'comment_2_1', author: { name: 'Aria K.', avatar: 'https://i.pravatar.cc/150?u=aria' }, text: 'Such a smooth vibe. Perfect late-night listening.', timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString() }
  ],
  post_mock_3: [
    { id: 'comment_3_1', author: { name: 'Luca F.', avatar: 'https://i.pravatar.cc/150?u=luca' }, text: 'Same! This one takes me back every time.', timestamp: new Date(Date.now() - 1000 * 60 * 55).toISOString() }
  ],
  post_mock_4: [
    { id: 'comment_4_1', author: { name: 'Zoe M.', avatar: 'https://i.pravatar.cc/150?u=zoe' }, text: 'M83 always nails the mood. Great pick.', timestamp: new Date(Date.now() - 1000 * 60 * 80).toISOString() }
  ],
  post_mock_5: [
    { id: 'comment_5_1', author: { name: 'Evan R.', avatar: 'https://i.pravatar.cc/150?u=evan' }, text: 'Iconic solo. Never gets old.', timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString() }
  ]
};

export const KARAOKE_TRACKS = [
  { 
    id: 'hLQl3WQQoQ0', 
    title: 'Someone Like You', 
    artist: 'Adele', 
    thumbnail: 'https://img.youtube.com/vi/hLQl3WQQoQ0/maxresdefault.jpg' 
  },
  { 
    id: 'fJ9rUzIMcZQ', 
    title: 'Bohemian Rhapsody', 
    artist: 'Queen', 
    thumbnail: 'https://img.youtube.com/vi/fJ9rUzIMcZQ/maxresdefault.jpg' 
  },
  { 
    id: 'L0MK7qz13bU', 
    title: 'Let It Go', 
    artist: 'Idina Menzel (Frozen)', 
    thumbnail: 'https://img.youtube.com/vi/L0MK7qz13bU/maxresdefault.jpg' 
  },
  { 
    id: 'q9ayN39xmsI', 
    title: 'A Thousand Years', 
    artist: 'Christina Perri', 
    thumbnail: 'https://img.youtube.com/vi/q9ayN39xmsI/maxresdefault.jpg' 
  },
  {
    id: 'H7hmzwI66hA',
    title: 'Shake It Off',
    artist: 'Taylor Swift',
    thumbnail: 'https://img.youtube.com/vi/H7hmzwI66hA/maxresdefault.jpg'
  }
];

// Content data extracted from HTML

export const content = {
  "index.structured": {
    "text": {
      "heading_1": "Feel theRhythm.",
      "heading_2": "Midnight City",
      "heading_3": "Curated For You",
      "heading_4": "Deep Focus",
      "heading_5": "City Pop",
      "heading_6": "Workout Energy",
      "heading_7": "Late Night Jazz",
      "heading_8": "The Weeknd",
      "heading_9": "Unlock Premium Sound",
      "heading_10": "Company",
      "heading_11": "Communities",
      "heading_12": "Useful Links",
      "paragraph_13": "Stream over 100 million songs in high-fidelity audio. Discover new favorites with AI-powered curation tailored just for you.",
      "paragraph_14": "M83 \u2022 Hurry Up, We're Dreaming",
      "paragraph_15": "Hand-picked playlists based on your vibe.",
      "paragraph_16": "Electronic ambient for work.",
      "paragraph_17": "Japanese 80s funk & soul.",
      "paragraph_18": "Smooth saxophone vibes.",
      "paragraph_19": "Experience the new era of pop. Listen to the exclusive release of \"After Hours\" in spatial audio, only on StreamFlow.",
      "paragraph_20": "Ad-free listening, offline playback, and high-fidelity audio. Cancel anytime.",
      "paragraph_21": "Individual plan only. $9.99/month after. Terms apply.",
      "paragraph_22": "\u00a9 2025 StreamFlow AB.",
      "cta_23": "Sign Up",
      "cta_24": "Sign Up",
      "cta_25": "Start Listening Free",
      "cta_26": "Watch Demo",
      "cta_27": "Play Latest Album",
      "cta_28": "Follow Artist",
      "cta_29": "Get 3 Months Free"
    },
    "images": [
      {
        "key": "image_1",
        "src": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64",
        "alt": "User",
        "classes": [
          "w-10",
          "h-10",
          "rounded-full",
          "border-2",
          "border-black"
        ]
      },
      {
        "key": "image_2",
        "src": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64",
        "alt": "User",
        "classes": [
          "w-10",
          "h-10",
          "rounded-full",
          "border-2",
          "border-black"
        ]
      },
      {
        "key": "image_3",
        "src": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64",
        "alt": "User",
        "classes": [
          "w-10",
          "h-10",
          "rounded-full",
          "border-2",
          "border-black"
        ]
      },
      {
        "key": "image_4",
        "src": "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=800&q=80",
        "alt": "Album Art",
        "classes": [
          "w-full",
          "h-full",
          "object-cover",
          "transition-transform",
          "duration-700",
          "group-hover:scale-110"
        ]
      },
      {
        "key": "image_5",
        "src": "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&w=100&q=80",
        "alt": "",
        "classes": [
          "w-10",
          "h-10",
          "rounded-lg",
          "object-cover"
        ]
      },
      {
        "key": "image_6",
        "src": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
        "alt": "",
        "classes": [
          "w-full",
          "h-full",
          "object-cover",
          "transition-transform",
          "duration-500",
          "group-hover:scale-110"
        ]
      },
      {
        "key": "image_7",
        "src": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80",
        "alt": "",
        "classes": [
          "w-full",
          "h-full",
          "object-cover",
          "transition-transform",
          "duration-500",
          "group-hover:scale-110"
        ]
      },
      {
        "key": "image_8",
        "src": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
        "alt": "",
        "classes": [
          "w-full",
          "h-full",
          "object-cover",
          "transition-transform",
          "duration-500",
          "group-hover:scale-110"
        ]
      },
      {
        "key": "image_9",
        "src": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80",
        "alt": "",
        "classes": [
          "w-full",
          "h-full",
          "object-cover",
          "transition-transform",
          "duration-500",
          "group-hover:scale-110"
        ]
      },
      {
        "key": "image_10",
        "src": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=2000&q=80",
        "alt": "",
        "classes": [
          "w-full",
          "h-full",
          "object-cover",
          "opacity-30"
        ]
      }
    ],
    "links": [],
    "forms": [],
    "lists": [
      {
        "key": "list_1",
        "type": "ul",
        "items": [
          "About",
          "Jobs",
          "For the Record"
        ]
      },
      {
        "key": "list_2",
        "type": "ul",
        "items": [
          "For Artists",
          "Developers",
          "Advertising",
          "Investors"
        ]
      },
      {
        "key": "list_3",
        "type": "ul",
        "items": [
          "Support",
          "Web Player",
          "Free Mobile App"
        ]
      }
    ],
    "meta": {
      "title": "\n   Music Streaming - Free Tailwind Template\n  ",
      "description": "Download this free Tailwind CSS Entertainment website template for Music Streaming. Features a modern design, fully responsive layout, and includes 1 pre-built pages like index.html."
    }
  },
  "index": {
    "text": {
      "heading_1": "Feel theRhythm.",
      "heading_2": "Midnight City",
      "heading_3": "Curated For You",
      "heading_4": "Deep Focus",
      "heading_5": "City Pop",
      "heading_6": "Workout Energy",
      "heading_7": "Late Night Jazz",
      "heading_8": "The Weeknd",
      "heading_9": "Unlock Premium Sound",
      "heading_10": "Company",
      "heading_11": "Communities",
      "heading_12": "Useful Links",
      "paragraph_13": "Stream over 100 million songs in high-fidelity audio. Discover new favorites with AI-powered curation tailored just for you.",
      "paragraph_14": "M83 \u2022 Hurry Up, We're Dreaming",
      "paragraph_15": "Hand-picked playlists based on your vibe.",
      "paragraph_16": "Electronic ambient for work.",
      "paragraph_17": "Japanese 80s funk & soul.",
      "paragraph_18": "Smooth saxophone vibes.",
      "paragraph_19": "Experience the new era of pop. Listen to the exclusive release of \"After Hours\" in spatial audio, only on StreamFlow.",
      "paragraph_20": "Ad-free listening, offline playback, and high-fidelity audio. Cancel anytime.",
      "paragraph_21": "Individual plan only. $9.99/month after. Terms apply.",
      "paragraph_22": "\u00a9 2025 StreamFlow AB.",
      "cta_23": "Sign Up",
      "cta_24": "Sign Up",
      "cta_25": "Start Listening Free",
      "cta_26": "Watch Demo",
      "cta_27": "Play Latest Album",
      "cta_28": "Follow Artist",
      "cta_29": "Get 3 Months Free"
    },
    "images": [
      {
        "key": "image_1",
        "src": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64",
        "alt": "User",
        "classes": [
          "w-10",
          "h-10",
          "rounded-full",
          "border-2",
          "border-black"
        ]
      },
      {
        "key": "image_2",
        "src": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64",
        "alt": "User",
        "classes": [
          "w-10",
          "h-10",
          "rounded-full",
          "border-2",
          "border-black"
        ]
      },
      {
        "key": "image_3",
        "src": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64",
        "alt": "User",
        "classes": [
          "w-10",
          "h-10",
          "rounded-full",
          "border-2",
          "border-black"
        ]
      },
      {
        "key": "image_4",
        "src": "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=800&q=80",
        "alt": "Album Art",
        "classes": [
          "w-full",
          "h-full",
          "object-cover",
          "transition-transform",
          "duration-700",
          "group-hover:scale-110"
        ]
      },
      {
        "key": "image_5",
        "src": "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&w=100&q=80",
        "alt": "",
        "classes": [
          "w-10",
          "h-10",
          "rounded-lg",
          "object-cover"
        ]
      },
      {
        "key": "image_6",
        "src": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
        "alt": "",
        "classes": [
          "w-full",
          "h-full",
          "object-cover",
          "transition-transform",
          "duration-500",
          "group-hover:scale-110"
        ]
      },
      {
        "key": "image_7",
        "src": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80",
        "alt": "",
        "classes": [
          "w-full",
          "h-full",
          "object-cover",
          "transition-transform",
          "duration-500",
          "group-hover:scale-110"
        ]
      },
      {
        "key": "image_8",
        "src": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
        "alt": "",
        "classes": [
          "w-full",
          "h-full",
          "object-cover",
          "transition-transform",
          "duration-500",
          "group-hover:scale-110"
        ]
      },
      {
        "key": "image_9",
        "src": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80",
        "alt": "",
        "classes": [
          "w-full",
          "h-full",
          "object-cover",
          "transition-transform",
          "duration-500",
          "group-hover:scale-110"
        ]
      },
      {
        "key": "image_10",
        "src": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=2000&q=80",
        "alt": "",
        "classes": [
          "w-full",
          "h-full",
          "object-cover",
          "opacity-30"
        ]
      }
    ],
    "links": [],
    "forms": [],
    "lists": [
      {
        "key": "list_1",
        "type": "ul",
        "items": [
          "About",
          "Jobs",
          "For the Record"
        ]
      },
      {
        "key": "list_2",
        "type": "ul",
        "items": [
          "For Artists",
          "Developers",
          "Advertising",
          "Investors"
        ]
      },
      {
        "key": "list_3",
        "type": "ul",
        "items": [
          "Support",
          "Web Player",
          "Free Mobile App"
        ]
      }
    ],
    "meta": {
      "title": "Music Streaming - Free Tailwind Template",
      "description": "Download this free Tailwind CSS Entertainment website template for Music Streaming. Features a modern design, fully responsive layout, and includes 1 pre-built pages like index.html."
    }
  }
};


// ─── Generic async data hook ─────────────────────────────────────────────────

function useAsyncFetch(fetcher, deps) {
  const [data,    setData]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    fetcher()
      .then((d)  => { if (alive) setData(d); })
      .catch((e) => { if (alive) setError(e); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, deps);

  return { data, loading, error };
}

// ─── Public hooks ────────────────────────────────────────────────────────────

/** iTunes top-songs chart */
export const useTopSongs = (limit = 10) =>
  useAsyncFetch(() => fetchTopSongs(limit), [limit]);

/** iTunes new-releases feed */
export const useNewReleases = (limit = 8) =>
  useAsyncFetch(() => fetchNewReleases(limit), [limit]);

/** iTunes new-music feed */
export const useNewMusic = (limit = 8) =>
  useAsyncFetch(() => fetchNewMusic(limit), [limit]);

/** Single-genre search — used for artwork covers */
export const useGenreSearch = (query, limit = 1) =>
  useAsyncFetch(() => searchTracks(query, limit), [query, limit]);

/**
 * Debounced live search — fires 400ms after the user stops typing.
 * Returns [] immediately when query is blank.
 */
export function useTrackSearch(query, limit = 20) {
  const [tracks,  setTracks]  = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    const q = query.trim();
    if (!q) { setTracks([]); setLoading(false); return; }

    let alive = true;
    setLoading(true);
    setError(null);

    const timer = setTimeout(() => {
      searchTracks(q, limit)
        .then((r)  => { if (alive) setTracks(r); })
        .catch((e) => { if (alive) setError(e); })
        .finally(() => { if (alive) setLoading(false); });
    }, 400);

    return () => { alive = false; clearTimeout(timer); };
  }, [query, limit]);

  return { tracks, loading, error };
}

/**
 * Fetch a full album (info + track list) by any iTunes track or collection ID.
 * Returns { album, tracks, loading, error }.
 */
export function useAlbum(id) {
  const [album,   setAlbum]   = useState(null);
  const [tracks,  setTracks]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!id) return;
    let alive = true;
    setLoading(true);
    setError(null);
    fetchAlbum(id)
      .then(({ album, tracks }) => {
        if (alive) { setAlbum(album); setTracks(tracks); }
      })
      .catch((e) => { if (alive) setError(e); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [id]);

  return { album, tracks, loading, error };
}

/**
 * Fetch artist info + top songs + albums by artistId.
 * Returns { artist, topSongs, albums, loading, error }.
 */
export function useArtist(artistId) {
  const [artist,   setArtist]   = useState(null);
  const [topSongs, setTopSongs] = useState([]);
  const [albums,   setAlbums]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    if (!artistId) return;
    let alive = true;
    setLoading(true);
    setError(null);
    fetchArtist(artistId)
      .then(({ artist, topSongs, albums }) => {
        if (alive) { setArtist(artist); setTopSongs(topSongs); setAlbums(albums); }
      })
      .catch((e) => { if (alive) setError(e); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [artistId]);

  return { artist, topSongs, albums, loading, error };
}


// --- Migrated from itunesApi.js ---
/** iTunes Search API & RSS utilities — no API key required, CORS-safe */

const BASE = 'https://itunes.apple.com';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Upscale iTunes artwork URL to any size (default 500×500) */
export const getLargeArtwork = (url, size = 500) => {
  if (!url) return '';
  // Handles both "100x100bb" (Search API) and "170x170-75" (RSS) formats
  return url.replace(/\d+x\d+(?:bb|-\d+)?/, `${size}x${size}bb`);
};

/** Format milliseconds to m:ss */
export const formatDuration = (ms) => {
  if (!ms) return '--:--';
  const s = Math.round(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

/** Format a full ISO date to a short readable string, e.g. "Mar 2025" */
export const formatReleaseDate = (iso) => {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  } catch {
    return iso;
  }
};

// ─── Search API ──────────────────────────────────────────────────────────────

/**
 * Search iTunes for tracks.
 * @param {string} term - Search query
 * @param {number} limit - Max results (default 20)
 * @returns {Promise<iTunesTrack[]>}
 */
export async function searchTracks(term, limit = 20) {
  const url = new URL(`${BASE}/search`);
  url.searchParams.set('term', term);
  url.searchParams.set('media', 'music');
  url.searchParams.set('entity', 'song');
  url.searchParams.set('limit', String(limit));

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`iTunes search failed: ${res.status}`);
  const json = await res.json();

  return (json.results ?? []).map((t) => ({
    ...t,
    artworkUrl100: getLargeArtwork(t.artworkUrl100),
  }));
}

// ─── RSS Charts ──────────────────────────────────────────────────────────────

/** Normalize an iTunes RSS entry to a flat track-like object */
function normalizeRssEntry(entry) {
  const images = entry['im:image'] ?? [];
  const rawArt = images[2]?.label ?? images[0]?.label ?? '';
  const artistHref = entry['im:artist']?.attributes?.href ?? '';
  const artistIdMatch = artistHref.match(/artist\/(?:[^/]+\/)?(\d+)/) || artistHref.match(/[?&/]?id=?(\d+)/) || artistHref.match(/\/(\d+)(?:\?|$)/);
  const collectionHref = entry['im:collection']?.link?.attributes?.href ?? '';
  const collectionIdMatch = collectionHref.match(/album\/(?:[^/]+\/)?(\d+)/) || collectionHref.match(/[?&/]?id=?(\d+)/) || collectionHref.match(/\/(\d+)(?:\?|$)/);
  return {
    trackId:           entry.id?.attributes?.['im:id'] ?? String(Math.random()),
    trackName:         entry['im:name']?.label ?? 'Unknown',
    artistName:        entry['im:artist']?.label ?? 'Unknown Artist',
    artistId:          artistIdMatch ? artistIdMatch[1] : undefined,
    collectionId:      (entry['im:collection']?.attributes?.['im:id']) || (collectionIdMatch ? collectionIdMatch[1] : undefined),
    collectionName:    entry['im:collection']?.['im:name']?.label ?? '',
    artworkUrl100:     getLargeArtwork(rawArt),
    primaryGenreName:  entry.category?.attributes?.label ?? 'Music',
    releaseDate:       entry['im:releaseDate']?.label ?? '',
    previewUrl:        null,
    trackTimeMillis:   null,
  };
}

/**
 * Fetch the iTunes top-songs chart.
 * @param {number} limit - Up to 100
 */
export async function fetchTopSongs(limit = 10) {
  const res = await fetch(`${BASE}/us/rss/topsongs/limit=${limit}/json`);
  if (!res.ok) throw new Error(`iTunes top songs failed: ${res.status}`);
  const json = await res.json();
  return (json.feed?.entry ?? []).map(normalizeRssEntry);
}

/**
 * Fetch new/hot music using Apple's newer Marketing Tools RSS API.
 * Falls back to an iTunes keyword search if the primary feed fails.
 * @param {number} limit - Up to 100
 */
export async function fetchNewMusic(limit = 8) {
  try {
    // Apple's modern RSS API (replaces the old /us/rss/newmusic/ endpoint)
    const res = await fetch(
      `https://rss.applemarketingtools.com/api/v2/us/music/most-played/${limit}/songs.json`
    );
    if (!res.ok) throw new Error(`Apple RSS failed: ${res.status}`);
    const json = await res.json();
    const results = json?.feed?.results ?? [];
    if (results.length === 0) throw new Error('Empty results from Apple RSS');

    // Normalize to the same shape as iTunes Search API tracks
    return results.map((item) => ({
      trackId:          item.id ?? String(Math.random()),
      trackName:        item.name ?? 'Unknown',
      artistName:       item.artistName ?? 'Unknown Artist',
      collectionName:   item.albumName ?? '',
      artworkUrl100:    getLargeArtwork(item.artworkUrl100),
      primaryGenreName: item.genres?.[0]?.name ?? 'Music',
      releaseDate:      item.releaseDate ?? '',
      previewUrl:       null,
      trackTimeMillis:  null,
      trackViewUrl:     item.url ?? null,
    }));
  } catch (primaryErr) {
    console.warn('Primary new music feed failed, falling back to iTunes search:', primaryErr);
    // Fallback: search for recent pop/chart songs
    try {
      const res = await fetch(
        `https://itunes.apple.com/search?term=top+hits+2024+2025&media=music&entity=song&limit=${limit}&sort=recent`
      );
      if (!res.ok) throw new Error(`iTunes fallback failed: ${res.status}`);
      const json = await res.json();
      return (json.results ?? []).map((t) => ({
        ...t,
        artworkUrl100: getLargeArtwork(t.artworkUrl100),
      }));
    } catch (fallbackErr) {
      console.error('Both new music feeds failed:', fallbackErr);
      return [];
    }
  }
}

/**
 * Fetch the iTunes new-releases feed.
 * @param {number} limit - Up to 100
 */
export async function fetchNewReleases(limit = 8) {
  return fetchNewMusic(limit);
}

// ─── Album Lookup ─────────────────────────────────────────────────────────────

/**
 * Given any iTunes track or collection ID, resolves the album and returns:
 *   { album, tracks }
 * Strategy:
 *  1. Try fetching as a collection directly (fastest path if id IS a collectionId)
 *  2. If no tracks found, lookup the ID to discover the real collectionId
 *  3. Retry the album fetch with the resolved collectionId
 */
export async function fetchAlbum(id) {
  if (!id) throw new Error('fetchAlbum: id is required');

  const doAlbumFetch = async (collId) => {
    const res = await fetch(`${BASE}/lookup?id=${collId}&entity=song&country=us`);
    if (!res.ok) return null;
    const json = await res.json();
    const all = json.results ?? [];
    const album = all.find((r) => r.wrapperType === 'collection');
    const tracks = all
      .filter((r) => r.wrapperType === 'track')
      .sort((a, b) => (a.trackNumber ?? 0) - (b.trackNumber ?? 0))
      .map((t) => ({ ...t, artworkUrl100: getLargeArtwork(t.artworkUrl100) }));
    return { album, tracks };
  };

  // ── Path A: try the id directly as a collection ───────────────────────────
  const directResult = await doAlbumFetch(id);
  if (directResult?.album && directResult.tracks.length > 0) {
    return {
      album: { ...directResult.album, artworkUrl100: getLargeArtwork(directResult.album.artworkUrl100) },
      tracks: directResult.tracks,
    };
  }

  // ── Path B: id might be a track/song id – look it up to get collectionId ──
  const lookupRes = await fetch(`${BASE}/lookup?id=${id}&country=us`);
  if (!lookupRes.ok) throw new Error(`iTunes lookup failed: ${lookupRes.status}`);
  const lookupJson = await lookupRes.json();
  const item = lookupJson.results?.[0];
  if (!item) throw new Error(`No iTunes result found for id: ${id}`);

  const collectionId = item.collectionId;
  if (!collectionId) {
    // Single / EP with no album — return the track itself as the only "album"
    const artUrl = getLargeArtwork(item.artworkUrl100);
    return {
      album: {
        collectionName: item.collectionName ?? item.trackName,
        artistName: item.artistName,
        artworkUrl100: artUrl,
        primaryGenreName: item.primaryGenreName,
        releaseDate: item.releaseDate,
        copyright: null,
        collectionViewUrl: item.trackViewUrl,
      },
      tracks: [{ ...item, artworkUrl100: artUrl }],
    };
  }

  // ── Path C: retry with the resolved collectionId ──────────────────────────
  const albumResult = await doAlbumFetch(collectionId);
  if (!albumResult) throw new Error(`Album fetch failed for collectionId: ${collectionId}`);

  const album = albumResult.album ?? {
    collectionName: item.collectionName ?? 'Unknown Album',
    artistName: item.artistName,
    artworkUrl100: getLargeArtwork(item.artworkUrl100),
    primaryGenreName: item.primaryGenreName,
    releaseDate: item.releaseDate,
  };

  return {
    album: { ...album, artworkUrl100: getLargeArtwork(album.artworkUrl100) },
    tracks: albumResult.tracks,
  };
}

// ─── Artist Lookup ────────────────────────────────────────────────────────────

/**
 * Fetch artist info + top songs + albums by artistId.
 * Returns { artist, topSongs, albums }
 */
export async function fetchArtist(artistId) {
  if (!artistId) throw new Error('fetchArtist: artistId is required');

  const [songsRes, albumsRes] = await Promise.all([
    fetch(`${BASE}/lookup?id=${artistId}&entity=song&limit=20&country=us`),
    fetch(`${BASE}/lookup?id=${artistId}&entity=album&limit=16&country=us`),
  ]);

  if (!songsRes.ok) throw new Error(`Artist songs lookup failed: ${songsRes.status}`);
  if (!albumsRes.ok) throw new Error(`Artist albums lookup failed: ${albumsRes.status}`);

  const [songsJson, albumsJson] = await Promise.all([songsRes.json(), albumsRes.json()]);

  const songResults  = songsJson.results  ?? [];
  const albumResults = albumsJson.results ?? [];

  // First result in each lookup is the artist object itself
  const rawArtist = songResults.find((r) => r.wrapperType === 'artist')
    ?? albumResults.find((r) => r.wrapperType === 'artist')
    ?? null;

  const artistArtwork =
    albumResults.find((r) => r.wrapperType === 'collection')?.artworkUrl100 ||
    songResults.find((r) => r.wrapperType === 'track')?.artworkUrl100 ||
    null;

  const artist = rawArtist
    ? {
        ...rawArtist,
        avatar: artistArtwork ? getLargeArtwork(artistArtwork, 600) : undefined,
      }
    : null;

  const topSongs = songResults
    .filter((r) => r.wrapperType === 'track')
    .map((t) => ({ ...t, artworkUrl100: getLargeArtwork(t.artworkUrl100) }));

  const albums = albumResults
    .filter((r) => r.wrapperType === 'collection')
    .map((a) => ({ ...a, artworkUrl100: getLargeArtwork(a.artworkUrl100) }));

  return { artist, topSongs, albums };
}

/**
 * Search for an artist by name and return their artistId + basic info.
 */
export async function searchArtist(name) {
  const url = new URL(`${BASE}/search`);
  url.searchParams.set('term', name);
  url.searchParams.set('entity', 'musicArtist');
  url.searchParams.set('limit', '1');

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Artist search failed: ${res.status}`);
  const json = await res.json();
  return json.results?.[0] ?? null;
}


// --- Migrated from LeaderboardStore.js ---
export class LeaderboardStore {
  static getStorageKey() {
    return 'smarttunes_leaderboard';
  }

  static getLeaderboard() {
    try {
      const data = localStorage.getItem(this.getStorageKey());
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to parse leaderboard from localStorage', e);
    }
    return [];
  }

  static saveScore(gameMode, trackId, score, username = 'Guest') {
    const leaderboard = this.getLeaderboard();
    
    leaderboard.push({
      id: Date.now().toString(),
      gameMode, // 'karaoke' | 'playalong'
      trackId,
      score,
      username,
      date: new Date().toISOString(),
    });

    // Sort by score descending
    leaderboard.sort((a, b) => b.score - a.score);

    localStorage.setItem(this.getStorageKey(), JSON.stringify(leaderboard));
    return leaderboard;
  }

  static getTopScores(gameMode, trackId = null, limit = 10) {
    let leaderboard = this.getLeaderboard();
    
    if (gameMode) {
      leaderboard = leaderboard.filter(e => e.gameMode === gameMode);
    }
    if (trackId !== null && trackId !== undefined) {
      leaderboard = leaderboard.filter(e => e.trackId === trackId);
    }

    // Keep only the highest score per user for this specific filter
    const bestUserScores = new Map();
    for (const entry of leaderboard) {
      if (!bestUserScores.has(entry.username)) {
        bestUserScores.set(entry.username, entry);
      } else {
        const existing = bestUserScores.get(entry.username);
        if (entry.score > existing.score) {
          bestUserScores.set(entry.username, entry);
        }
      }
    }

    const uniqueTop = Array.from(bestUserScores.values());
    uniqueTop.sort((a, b) => b.score - a.score);
    
    return uniqueTop.slice(0, limit);
  }

  static getGlobalTop(limit = 5) {
    return this.getTopScores(null, null, limit);
  }
}

export const numberOfSongs = 133251;
export const numberOfActiveListeners = 10_245_000;
export const averageRating = 4.9;

/**
 * Estimate count for marketing display
 * @param {number} count - Actual number
 * @returns {string} Formatted estimation like "133K+", "1M+", etc.
 */
export const estimateCount = (count) => {
  if (count >= 1_000_000_000) {
    return `${Math.floor(count / 1_000_000_000)}B+`;
  }
  if (count >= 1_000_000) {
    return `${Math.floor(count / 1_000_000)}M+`;
  }
  if (count >= 1_000) {
    return `${Math.floor(count / 1_000)}K+`;
  }
  return `${count}+`;
};

// Legacy alias for backward compatibility
export const estimateSongCount = estimateCount;

// ─── Artist Spotlight Data ────────────────────────────────────────────────

export const ARTIST_SPOTLIGHT = {
  name: 'Spiritbox',
  label: 'Artist Spotlight',
  image: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/6a/dc/82/6adc8230-3041-26c5-9d8f-d5b97acc09d0/4050538694772.jpg/1200x1200bb.jpg',
  backgroundImage: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/6a/dc/82/6adc8230-3041-26c5-9d8f-d5b97acc09d0/4050538694772.jpg/1200x1200bb.jpg',
  album: 'Eternal Blue',
  description: 'Experience Spiritbox\'s debut album "Eternal Blue". Heavy riffs meet ethereal vocals in pristine high-fidelity audio — only on SmartTunes.',
  artistId: 1293047384,
  collectionId: 1584622643,
};

// ─── Sheet Music Data ──────────────────────────────────────────────────────

export const SHEETS = [
  { id: 1, title: 'Mariage d\'Amoure', composer: 'Paul de Senneville', image: 'https://loremflickr.com/400/500/piano,classical?lock=1', scoreUrl: localScorePath('mariage-damour.mxl'), diff: 'Intermediate', uploadedBy: '@classicvibes' },
  { id: 2, title: 'Für Elise in A Minor', composer: 'Ludwig van Beethoven', image: 'https://loremflickr.com/400/500/piano,classical?lock=51', scoreUrl: localScorePath('fr-elise--beethoven.mxl'), diff: 'Beginner', uploadedBy: '@pianomaster' },
  { id: 3, title: 'Für Elise', composer: 'Ludwig van Beethoven', image: 'https://loremflickr.com/400/500/piano,classical?lock=55', scoreUrl: localScorePath('c-major.mxl'), diff: 'Beginner', uploadedBy: '@sheetmusicnerd' },
  { id: 4, title: 'Carmen Prelude', composer: 'Georges Bizet', image: 'https://loremflickr.com/400/500/piano,classical?lock=4', scoreUrl: localScorePath('c-minor.mxl'), diff: 'Advanced', uploadedBy: '@virtuoso22' },
  { id: 5, title: 'Prelude in E Minor', composer: 'Frédéric Chopin', image: 'https://loremflickr.com/400/500/piano,classical?lock=50', scoreUrl: localScorePath('5.musicxml'), diff: 'Intermediate', uploadedBy: '@chopin_fan' },
  { id: 6, title: 'Gymnopédie No. 1', composer: 'Erik Satie', image: 'https://loremflickr.com/400/500/piano,classical?lock=61', scoreUrl: localScorePath('6.musicxml'), diff: 'Intermediate', uploadedBy: '@keysplayer' },
  { id: 7, title: 'Nocturne Op. 9 No. 2', composer: 'Frédéric Chopin', image: 'https://loremflickr.com/400/500/piano,classical?lock=33', scoreUrl: localScorePath('7.musicxml'), diff: 'Advanced', uploadedBy: '@melody_maker' },
  { id: 8, title: 'Waltz of the Flowers', composer: 'Pyotr Ilyich Tchaikovsky', image: 'https://loremflickr.com/400/500/piano,classical?lock=44', scoreUrl: localScorePath('8.musicxml'), diff: 'Advanced', uploadedBy: '@orchestra_fan' },
];

