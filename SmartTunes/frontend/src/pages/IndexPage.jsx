import React from 'react';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { Image } from '../components/Image';
import { Link } from '../components/Link';
import { Link as RouterLink } from 'react-router-dom';
import { Text } from '../components/Text';

export const IndexPage = ({ className, children, variant, contentKey, ...props }) => {
  const [currentSongIndex, setCurrentSongIndex] = React.useState(0);

  const carouselSongs = [
    {
      title: "Midnight City",
      artist: "M83",
      album: "Hurry Up, We're Dreaming",
      cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Starboy",
      artist: "The Weeknd",
      album: "Starboy",
      cover: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Levitating",
      artist: "Dua Lipa",
      album: "Future Nostalgia",
      cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80"
    }
  ];

  const nextSong = () => setCurrentSongIndex((prev) => (prev + 1) % carouselSongs.length);
  const prevSong = () => setCurrentSongIndex((prev) => (prev - 1 + carouselSongs.length) % carouselSongs.length);

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
        {/* Hero Section */}
        <section id="hero" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
          {/* Background Glows */}
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse-slow"></div>
          <div style={{ animationDelay: "2s" }} className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px] -z-10 animate-pulse-slow"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="font-display text-6xl md:text-7xl font-bold leading-[1.1] tracking-tight">
                Feel the
                <br />
                <Text className="text-gradient"> Rhythm </Text>
              </h1>
              <p className="text-xl text-textMuted max-w-lg leading-relaxed">
                Stream over 100 million songs in high-fidelity audio. Discover new favorites with AI-powered curation tailored just for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="primary" contentKey="cta_25" className="bg-primary text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-primaryHover hover:scale-105 transition-all shadow-[0_0_20px_rgba(29,185,84,0.3)] flex items-center justify-center gap-2">
                  Start Listening Free
                  <Icon className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <path d="M14 5l7 7m0 0l-7 7m7-7H3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </Icon>
                </Button>
              </div>
              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-3">
                  <Image className="w-10 h-10 rounded-full border-2 border-black" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64" alt="User" />
                  <Image className="w-10 h-10 rounded-full border-2 border-black" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64" alt="User" />
                  <Image className="w-10 h-10 rounded-full border-2 border-black" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64" alt="User" />
                </div>
                <p className="text-sm text-textMuted">
                  <Text variant="bold" className="text-white font-bold"> 10M+ </Text>
                  active listeners
                </p>
              </div>
            </div>
            {/* Audio Player Preview */}
            <div className="relative animate-float">
              {/* Decorative Elements */}
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-primary to-blue-500 rounded-full blur-xl opacity-50"></div>

              <div className="flex items-center gap-3 mb-5">
  <span className="flex-1 h-px bg-white/30"></span>
  <p className="text-sm font-semibold uppercase tracking-widest text-white/50 px-2">
    Check out our recommendations
  </p>
  <span className="flex-1 h-px bg-white/30"></span>
</div>

              {/* Main Player Card */}
              <div className="glass-panel rounded-3xl p-6 relative z-10 shadow-2xl min-w-[320px]">
                <div className="relative group overflow-hidden rounded-2xl mb-6">
                  <div className="aspect-square flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentSongIndex * 100}%)` }}>
                    {carouselSongs.map((song, i) => (
                      <div key={i} className="min-w-full h-full overflow-hidden">
                        <Image
                          variant="cover"
                          className={`w-full h-full object-cover transition-transform duration-700 ${i === currentSongIndex ? 'group-hover:scale-110' : ''}`}
                          src={song.cover}
                          alt={song.title}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Navigation Arrows */}
                  <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={prevSong} className="p-2 rounded-full bg-black/50 text-white hover:bg-white/30 transition-all">
                      <Icon className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></Icon>
                    </button>
                    <button onClick={nextSong} className="p-2 rounded-full bg-black/50 text-white hover:bg-white/30 transition-all">
                      <Icon className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></Icon>
                    </button>
                  </div>

                  {/* Indicators */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {carouselSongs.map((_, i) => (
                      <button key={i} onClick={() => setCurrentSongIndex(i)} className={`h-1.5 rounded-full transition-all cursor-pointer ${i === currentSongIndex ? 'w-6 bg-white/60 hover:bg-white' : 'w-1.5 bg-white/30 hover:bg-white/50'}`} />
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-end mb-6 min-h-[64px]">
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-500" key={currentSongIndex}>
                    <h3 className="font-display font-bold text-2xl mb-1"> {carouselSongs[currentSongIndex].title} </h3>
                    <p className="text-textMuted text-lg"> {carouselSongs[currentSongIndex].artist} </p>
                    <p className="text-textMuted text-sm"> {carouselSongs[currentSongIndex].album} </p>
                  </div>
                  <Button variant="primary" className="text-primary hover:text-white transition-colors"><Icon className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></Icon></Button>
                </div>
                {/* Progress Bar */}
                <div className="mb-6 group cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-textMuted font-medium min-w-[36px] text-right font-variant-tabular-nums">1:24</span>
                    <div
                      className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden cursor-pointer relative"
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        // Dummy seek - in real implementation, call onSeek
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.querySelector('.pcb-fill').style.background = '#1db954';
                        e.currentTarget.querySelector('.pcb-thumb').style.opacity = '1';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.querySelector('.pcb-fill').style.background = '#fff';
                        e.currentTarget.querySelector('.pcb-thumb').style.opacity = '0';
                      }}
                    >
                      <div
                        className="pcb-fill h-full w-1/3 bg-primary rounded-full relative transition-colors duration-150"
                      >
                        <div
                          className="pcb-thumb absolute right-[-5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full opacity-0 transition-opacity duration-150"
                        />
                      </div>
                    </div>
                    <span className="text-xs text-textMuted font-medium min-w-[36px] font-variant-tabular-nums">4:03</span>
                  </div>
                </div>
                {/* Controls */}
                <div className="flex items-center justify-between">
                  <Button className="text-textMuted hover:text-white transition-colors"><Icon className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M14.12 15.53c.93-.86 1.48-2.06 1.48-3.38 0-2.65-2.15-4.8-4.8-4.8-2.65 0-4.8 2.15-4.8 4.8 0 2.65 2.15 4.8 4.8 4.8.47 0 .92-.07 1.35-.19l2.3 2.3c-.23.08-.47.14-.72.19-1.1.22-2.25.13-3.3-.26-1.05-.39-1.94-1.08-2.57-1.98-.63-.9-1-1.97-1.06-3.08-.06-1.11.18-2.21.7-3.19.52-.98 1.3-1.78 2.25-2.33.95-.55 2.04-.82 3.14-.79 1.1.03 2.18.36 3.11.96.93.6 1.66 1.46 2.11 2.47l-1.68 1.68c-.28-.63-.73-1.17-1.31-1.54-.58-.37-1.26-.58-1.95-.6-1.38-.04-2.68.75-3.22 2.04-.54 1.29-.13 2.78.99 3.59 1.12.81 2.66.64 3.58-.39l1.48 1.32zM19 13h-2v2h-2v-2h-2v-2h2V9h2v2h2v2z"></path></Icon></Button>
                  <Button variant="primary" className="text-white hover:text-primary transition-colors"><Icon className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"></path></Icon></Button>
                  <Button className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-white/20"><Icon className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></Icon></Button>
                  <Button variant="primary" className="text-white hover:text-primary transition-colors"><Icon className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"></path></Icon></Button>
                  <Button className="text-textMuted hover:text-white transition-colors"><Icon className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"></path></Icon></Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Curated For You */}
        <section id="curated_for_you" className="py-24 bg-surface relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="font-display text-4xl font-bold mb-2"> Curated For You </h2>
                <p className="text-textMuted"> Hand-picked playlists based on your vibe. </p>
              </div>
              <Link className="text-sm font-bold text-white hover:text-primary transition-colors flex items-center gap-1" href="#"> View All
                <Icon className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></Icon></Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {/* Card 1 */}
              <div className="group cursor-pointer">
                <div className="relative aspect-square rounded-xl overflow-hidden mb-4">
                  <Image variant="cover" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      <Icon className="w-6 h-6 text-black fill-current ml-1" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></Icon>
                    </div>
                  </div>
                </div>
                <h3 className="font-bold text-lg group-hover:text-primary transition-colors"> Deep Focus </h3>
                <p className="text-sm text-textMuted"> Electronic ambient for work. </p>
              </div>
              {/* Card 2 */}
              <div className="group cursor-pointer">
                <div className="relative aspect-square rounded-xl overflow-hidden mb-4">
                  <Image variant="cover" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      <Icon className="w-6 h-6 text-black fill-current ml-1" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></Icon>
                    </div>
                  </div>
                </div>
                <h3 className="font-bold text-lg group-hover:text-primary transition-colors"> City Pop </h3>
                <p className="text-sm text-textMuted"> Japanese 80s funk & soul. </p>
              </div>
              {/* Card 3 */}
              <div className="group cursor-pointer">
                <div className="relative aspect-square rounded-xl overflow-hidden mb-4">
                  <Image variant="cover" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      <Icon className="w-6 h-6 text-black fill-current ml-1" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></Icon>
                    </div>
                  </div>
                </div>
                <h3 className="font-bold text-lg group-hover:text-primary transition-colors"> Workout Energy </h3>
                <p className="text-sm text-textMuted"> High BPM hits. </p>
              </div>
              {/* Card 4 */}
              <div className="group cursor-pointer">
                <div className="relative aspect-square rounded-xl overflow-hidden mb-4">
                  <Image variant="cover" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      <Icon className="w-6 h-6 text-black fill-current ml-1" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></Icon>
                    </div>
                  </div>
                </div>
                <h3 className="font-bold text-lg group-hover:text-primary transition-colors"> Late Night Jazz </h3>
                <p className="text-sm text-textMuted"> Smooth saxophone vibes. </p>
              </div>
            </div>
          </div>
        </section>
        {/* The Weeknd */}
        <section id="the_weeknd" className="py-24 relative overflow-hidden">
          <div className="absolute inset-0">
            <Image variant="cover" className="w-full h-full object-cover opacity-30" src="https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=2000&q=80" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-2xl">
              <div className="text-primary font-bold tracking-widest uppercase mb-4"> Artist Spotlight </div>
              <h2 className="font-display text-5xl md:text-7xl font-bold mb-6"> The Weeknd </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Experience the new era of pop. Listen to the exclusive release of "After Hours" in spatial audio, only on StreamFlow.
              </p>
              <div className="flex gap-4">
                <Button variant="primary" contentKey="cta_27" className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-primary transition-colors flex items-center gap-2"><Icon className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></Icon>
                  Play Latest Album </Button>
                <Button contentKey="cta_28" className="px-8 py-3 rounded-full font-bold border border-white/30 hover:bg-white/10 transition-colors"> Follow Artist </Button>
              </div>
            </div>
          </div>
        </section>
        {/* Unlock Premium Sound */}
        <section id="unlock_premium_sound" className="py-24 bg-black relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px]"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="glass-panel rounded-3xl p-12 md:p-20 text-center relative overflow-hidden border-primary/20">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary"></div>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-6"> Unlock Premium Sound </h2>
              <p className="text-xl text-textMuted max-w-2xl mx-auto mb-10">
                Ad-free listening, offline playback, and high-fidelity audio. Cancel anytime.
              </p>
              <div className="flex flex-col md:flex-row justify-center gap-6 mb-12">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Icon className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></Icon>
                  Ad-free music
                </div>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Icon className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></Icon>
                  Offline playback
                </div>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Icon className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></Icon>
                  Hi-Fi Audio
                </div>
              </div>
              <Button variant="primary" contentKey="cta_29" className="bg-gradient-to-r from-primary to-primaryHover text-black px-10 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-lg shadow-primary/25"> Get 3 Months Free </Button>
              <p className="mt-4 text-xs text-textMuted"> Individual plan only. $9.99/month after. Terms apply. </p>
            </div>
          </div>
        </section>
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
      </>
    </div>
  );
};

