import React from 'react';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { Image } from '../components/Image';
import { Link } from '../components/Link';
import { Link as RouterLink } from 'react-router-dom';
import { Text } from '../components/Text';

export const DiscoverPage = ({ className, children, variant, contentKey, ...props }) => {
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
                  <Link className="hover:text-white transition-colors" href="#games"> Games </Link>
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
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse-slow"></div>
          <div style={{ animationDelay: "2s" }} className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px] -z-10 animate-pulse-slow"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid lg:grid-cols-2 gap-12 items-center">

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

