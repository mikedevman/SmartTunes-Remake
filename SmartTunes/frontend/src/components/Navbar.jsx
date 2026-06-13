import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Music2, Mic2, LayoutDashboard, Upload } from 'lucide-react';
import { useArtist } from './ArtistContext';
import { Avatar } from './Avatar';

const NAV_LINKS = [
  { label: 'Home',     to: '/home'     },
  { label: 'Discover', to: '/discover' },
  { label: 'Social',   to: '/social'   },
  { label: 'Scores',   to: '/mockScores'   },
  { label: 'Arcade',   to: '/games'    },
];

/**
 * Shared sticky navbar used across all pages.
 * Becomes opaque on scroll and highlights the active route.
 * Shows artist dashboard controls when registered as an artist.
 */
export const Navbar = () => {
  const [isScrolled,  setIsScrolled]  = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [avatarMenu,  setAvatarMenu]  = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { artist, isArtist } = useArtist();

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Detect scroll to apply background
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header>
        <nav
          className={`fixed w-full z-50 top-0 transition-all duration-300 border-b ${
            isScrolled || mobileOpen
              ? 'bg-black/90 backdrop-blur-xl border-white/8 shadow-xl shadow-black/40'
              : 'bg-transparent border-transparent'
          }`}
          aria-label="Main navigation"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              {/* Logo */}
              <RouterLink
                to="/home"
                className="flex items-center gap-2.5 group"
                aria-label="SmartTunes Home"
              >
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform duration-200">
                  <Music2 className="w-4 h-4 text-black" strokeWidth={2.5} />
                </div>
                <span className="font-display font-bold text-2xl tracking-tight text-white">
                  SmartTunes
                </span>
              </RouterLink>

              {/* Desktop nav links */}
              <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                {NAV_LINKS.map(({ label, to }) => {
                  const isActive = pathname === to || (to !== '/home' && pathname.startsWith(to));
                  return (
                    <RouterLink
                      key={to}
                      to={to}
                      className={`relative transition-colors duration-200 py-1 ${
                        isActive ? 'text-white' : 'text-textMuted hover:text-white'
                      }`}
                    >
                      {label}
                      {isActive && (
                        <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-primary rounded-full" />
                      )}
                    </RouterLink>
                  );
                })}
              </div>

              {/* Desktop right section */}
              <div className="hidden md:flex items-center gap-3">
                {isArtist ? (
                  /* ── Artist mode ── */
                  <>
                    <RouterLink
                      to="/upload-song"
                      className="flex items-center gap-1.5 text-sm font-bold text-textMuted hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
                    >
                      <Upload className="w-4 h-4" /> Upload
                    </RouterLink>

                    {/* Avatar dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setAvatarMenu((v) => !v)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                        aria-label="Artist menu"
                      >
                        <Avatar src={artist?.avatar} name={artist?.stageName} className="w-7 h-7 rounded-full object-cover" alt="avatar" />
                        <span className="text-sm font-bold max-w-[100px] truncate">{artist?.stageName}</span>
                      </button>

                      {avatarMenu && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setAvatarMenu(false)} />
                          <div className="absolute right-0 top-full mt-2 w-52 glass-panel rounded-xl border border-white/10 shadow-2xl z-20 overflow-hidden">
                            <div className="px-4 py-3 border-b border-white/5">
                              <p className="text-xs text-textMuted">Signed in as</p>
                              <p className="font-semibold text-sm truncate">{artist?.stageName}</p>
                            </div>
                            <RouterLink
                              to="/artist-dashboard"
                              onClick={() => setAvatarMenu(false)}
                              className="flex items-center gap-2.5 px-4 py-3 text-sm hover:bg-white/5 transition-colors"
                            >
                              <LayoutDashboard className="w-4 h-4 text-textMuted" /> Dashboard
                            </RouterLink>
                            <RouterLink
                              to="/upload-song"
                              onClick={() => setAvatarMenu(false)}
                              className="flex items-center gap-2.5 px-4 py-3 text-sm hover:bg-white/5 transition-colors"
                            >
                              <Upload className="w-4 h-4 text-textMuted" /> Upload Song
                            </RouterLink>
                          </div>
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  /* ── Guest mode ── */
                  <>
                    <RouterLink
                      to="/auth"
                      className="text-sm font-bold text-textMuted hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
                    >
                      Log In
                    </RouterLink>
                    <RouterLink
                      to="/artist-register"
                      className="flex items-center gap-1.5 bg-white text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-primary hover:scale-105 transition-all duration-200 shadow-md"
                    >
                      <Mic2 className="w-3.5 h-3.5" /> Become an Artist
                    </RouterLink>
                  </>
                )}
              </div>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="md:hidden p-2 rounded-full text-textMuted hover:text-white hover:bg-white/10 transition-all duration-200"
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
                id="mobile-menu-toggle"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile dropdown */}
          <div className={`md:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="px-4 pb-6 pt-2 space-y-1 border-t border-white/5 bg-black/95">
              {NAV_LINKS.map(({ label, to }) => {
                const isActive = pathname === to || (to !== '/home' && pathname.startsWith(to));
                return (
                  <RouterLink
                    key={to}
                    to={to}
                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive ? 'bg-primary/10 text-primary' : 'text-textMuted hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {label}
                  </RouterLink>
                );
              })}

              <div className="pt-4 flex flex-col gap-3">
                {isArtist ? (
                  <>
                    <RouterLink to="/artist-dashboard" className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold bg-primary/10 border border-primary/20 text-primary">
                      <LayoutDashboard className="w-4 h-4" /> Dashboard · {artist?.stageName}
                    </RouterLink>
                    <RouterLink to="/upload-song" className="block text-center px-4 py-3 rounded-xl text-sm font-bold bg-primary text-black hover:bg-primaryHover transition-all">
                      <Upload className="w-4 h-4 inline mr-2" /> Upload Song
                    </RouterLink>
                  </>
                ) : (
                  <>
                    <RouterLink to="/auth" className="block text-center px-4 py-3 rounded-xl text-sm font-bold text-textMuted border border-white/10 hover:bg-white/5 hover:text-white transition-all">
                      Log In
                    </RouterLink>
                    <RouterLink to="/artist-register" className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold bg-primary text-black hover:bg-primaryHover transition-all">
                      <Mic2 className="w-4 h-4" /> Become an Artist
                    </RouterLink>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};
