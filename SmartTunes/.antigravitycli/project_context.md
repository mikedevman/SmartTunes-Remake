# SmartTunes-Remake Project Context

## Overview
SmartTunes-Remake is a modern web application built using React, React Router, and Tailwind CSS. It serves as a music streaming and sheet music viewing platform with a rich, interactive UI. The primary features include playing music scores directly in the browser and displaying sheet music synchronized with audio playback.

## Technology Stack
- **Frontend Framework**: React 18, React Router DOM 6
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer (custom global styles in `index.css`/`globals.css`)
- **Audio & Music Parsing**: 
  - `tone.js` (for synthesizing and playing music directly from score data)
  - `opensheetmusicdisplay` (OSMD) (for parsing and rendering MusicXML/MXL scores)
- **Icons**: `lucide-react`
- **Backend**: Current backend folders exist (`backend/src/controllers`, `routes`, etc.) but are completely empty. The app is currently frontend-only.

## Core Architecture & Components

### 1. Global State Management (`PlayerContext.jsx`)
- Uses React Context API (`PlayerProvider`, `usePlayer`) to manage global playback state.
- Tracks `currentTrack`, `isPlaying`, `progress`, `volume`, and `isMuted`.
- Uses a `startTicker` with `setInterval` to calculate audio playback progress for the UI.
- Supports pausing, playing, seeking, and dynamic volume controls.

### 2. Main Pages (`frontend/src/pages/`)
- **App.jsx**: The entry point setting up routes (`/`, `/home`, `/scores`, `/auth`), `ScrollToTop`, and wrapping everything in `PlayerProvider`.
- **IndexPage.jsx**: The landing page with a hero section, curated playlists, artist spotlights, and a mock audio player. Displays visually rich components with animations and gradients.
- **ScoresPage.jsx**: The core functionality of the app. 
  - Renders a list of sheet music (e.g., "Moonlight Sonata", "Für Elise").
  - Includes a custom `SheetMusicViewer` component that takes an XML/MXL file (from `frontend/public/test/scores/`) and uses `OpenSheetMusicDisplay` to render the notes.
  - Integrates `Tone.js` to parse the `osmd.cursor.iterator` and schedule synthesizer events (`Tone.PolySynth`) so the user can hear the sheet music.
  - Features a custom DOM cursor overlay (a green vertical bar) that tracks the OSMD cursor position in real time.
- **AuthPage.jsx & DiscoverPage.jsx**: Authentication and music discovery pages. 

### 3. Audio & Sheet Music Synchronization (in `ScoresPage.jsx`)
The integration between `OSMD` and `Tone.js` is highly sophisticated:
1. It loops through OSMD's note iterator to extract `Pitch` and `Length`.
2. Translates the pitch into scientific pitch notation (e.g., `C4`, `D#5`) suitable for `Tone.js`.
3. Pushes these into a custom `timeline` array.
4. Uses `Tone.Transport.schedule()` to trigger `synth.triggerAttackRelease` while concurrently calling `osmd.cursor.next()` inside `Tone.Draw.schedule()` to ensure audio-visual synchronization without UI thread blocking.

### 4. Styling & Theming
- The UI follows a "dark mode" aesthetic (similar to Spotify) with `#1db954` (green) as the primary accent color.
- Relies on glassmorphism panels, blurry glows, and hover micro-animations to create a premium feel.

## Current State
- The backend is uninitialized.
- The frontend is fully functional as a prototype, capable of rendering `.mxl` files and playing them via `Tone.js`.
