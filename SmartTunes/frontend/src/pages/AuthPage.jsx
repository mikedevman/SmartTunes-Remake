import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { Link } from '../components/Link';
import { Link as RouterLink } from 'react-router-dom';
import { Text } from '../components/Text';

export const AuthPage = () => {
  const [loginStatus, setLoginStatus] = useState(true);

  return (
    <div className="bg-background text-textMain font-sans antialiased min-h-screen flex flex-col">
      {/* Navbar */}
      <header>
        <nav className="fixed w-full z-50 top-0 transition-all duration-300 bg-black/80 backdrop-blur-md border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <RouterLink to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Icon className="w-5 h-5 text-black fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></Icon>
                </div>
                <Text variant="bold" className="font-display font-bold text-2xl tracking-tight"> SmartTunes </Text>
              </RouterLink>
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-grow flex items-center justify-center pt-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] -z-10 animate-pulse-slow"></div>

        <div className="max-w-md w-full space-y-8 bg-white/5 p-8 sm:p-10 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl">
          <div className="text-center">
            <Text variant="h1" className="block text-3xl font-display font-bold mb-2">
              {loginStatus ? 'Welcome Back' : 'Join SmartTunes'}
            </Text>
            <Text className="block text-textMuted text-sm">
              {loginStatus 
                ? 'Continue your musical journey where you left off.' 
                : 'Start your journey to musical mastery today.'}
            </Text>
          </div>

          <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-4">
              {!loginStatus && (
                <div>
                  <label className="block text-sm font-medium text-textMuted mb-1 ml-1">Full Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-white placeholder:text-white/20"
                    placeholder="John Doe"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-textMuted mb-1 ml-1">Email Address</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-white placeholder:text-white/20"
                  placeholder="name@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-textMuted mb-1 ml-1">Password</label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-white placeholder:text-white/20"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {loginStatus && (
              <div className="flex items-center justify-end">
                <Link className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                  Forgot your password?
                </Link>
              </div>
            )}

            <Button
              variant="primary"
              className="w-full py-4 bg-primary text-black font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
            >
              {loginStatus ? 'Log In' : 'Create Account'}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#050505] px-2 text-textMuted">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm font-medium">
                <Icon className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></Icon>
                Google
              </button>
              <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm font-medium">
                <Icon className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/></Icon>
                Facebook
              </button>
            </div>
          </form>

          <div className="text-center mt-8">
            <button 
              onClick={() => setLoginStatus(!loginStatus)}
              className="text-sm font-medium text-textMuted hover:text-white transition-colors"
            >
              {loginStatus ? "Don't have an account? " : "Already have an account? "}
              <span className="text-primary font-bold">{loginStatus ? 'Sign Up' : 'Log In'}</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-textMuted">
          <p>© 2024 SmartTunes. All rights reserved.</p>
          <div className="flex gap-6">
            <Link className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
