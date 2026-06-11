import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Eye, EyeOff, Music2, Mail, Lock, User, ArrowRight } from 'lucide-react';

// ─── Social OAuth Button ─────────────────────────────────────────────────────

const SocialButton = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    type="button"
    className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200 text-sm font-medium text-white group"
    aria-label={`Continue with ${label}`}
  >
    {icon}
    <span>Continue with {label}</span>
  </button>
);

// ─── Animated background rings ───────────────────────────────────────────────

const BackgroundDecor = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
    {/* Glow orbs */}
    <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[130px] animate-pulse-slow" />
    <div
      className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent/8 rounded-full blur-[120px] animate-pulse-slow"
      style={{ animationDelay: '2s' }}
    />
    {/* Grid pattern */}
    <div
      className="absolute inset-0 opacity-[0.015]"
      style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }}
    />
  </div>
);

// ─── Input field with icon ───────────────────────────────────────────────────

const InputField = ({ icon: Icon, label, type = 'text', placeholder, required, suffix, id }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const resolvedType = isPassword && showPassword ? 'text' : type;

  return (
    <div>
      <label className="block text-sm font-medium text-textMuted mb-1.5 ml-0.5" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textMuted pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={id}
          type={resolvedType}
          required={required}
          placeholder={placeholder}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} ${isPassword ? 'pr-10' : 'pr-4'} py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-white placeholder:text-white/20 text-sm`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-textMuted hover:text-white transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate async auth — replace with real API call
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <div className="bg-background text-textMain font-sans antialiased min-h-screen flex flex-col">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header>
        <nav
          className="fixed w-full z-50 top-0 bg-black/80 backdrop-blur-xl border-b border-white/5"
          aria-label="Auth page navigation"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <RouterLink to="/home" className="flex items-center gap-2.5 group" aria-label="Back to SmartTunes Home">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform duration-200">
                  <Music2 className="w-4 h-4 text-black" strokeWidth={2.5} />
                </div>
                <span className="font-display font-bold text-2xl tracking-tight text-white">SmartTunes</span>
              </RouterLink>
              <RouterLink
                to="/home"
                className="text-sm text-textMuted hover:text-white transition-colors font-medium"
              >
                ← Back to Home
              </RouterLink>
            </div>
          </div>
        </nav>
      </header>

      {/* ── Main ────────────────────────────────────────────────────────── */}
      <main className="flex-grow flex items-center justify-center pt-20 px-4 sm:px-6 relative overflow-hidden">
        <BackgroundDecor />

        <div className="w-full max-w-md animate-scale-in">
          {/* Card */}
          <div className="glass-panel-strong rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/60 border border-white/8">
            {/* Logo + heading */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Music2 className="w-7 h-7 text-primary" />
              </div>
              <h1 className="font-display text-3xl font-bold mb-2">
                {isLogin ? 'Welcome back' : 'Join SmartTunes'}
              </h1>
              <p className="text-textMuted text-sm">
                {isLogin
                  ? 'Continue your musical journey where you left off.'
                  : 'Start your journey to musical mastery today.'}
              </p>
            </div>

            {/* Social login */}
            <div className="space-y-3 mb-6">
              <SocialButton
                label="Google"
                icon={
                  <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                }
              />
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/8" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest">
                <span className="px-3 text-textMuted" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  Or with email
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {!isLogin && (
                <InputField
                  id="auth-fullname"
                  icon={User}
                  label="Full Name"
                  type="text"
                  placeholder="Jane Smith"
                  required
                />
              )}
              <InputField
                id="auth-email"
                icon={Mail}
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                required
              />
              <InputField
                id="auth-password"
                icon={Lock}
                label="Password"
                type="password"
                placeholder="••••••••"
                required
              />

              {!isLogin && (
                <InputField
                  id="auth-confirm-password"
                  icon={Lock}
                  label="Confirm Password"
                  type="password"
                  placeholder="••••••••"
                  required
                />
              )}

              {isLogin && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-sm font-medium text-primary hover:text-primaryHover transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                id="auth-submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-primary text-black font-bold rounded-xl hover:bg-primaryHover transition-all duration-200 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 mt-2"
              >
                {isLoading ? (
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <>
                    {isLogin ? 'Log In' : 'Create Account'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Toggle login / signup */}
            <div className="text-center mt-8">
              <p className="text-sm text-textMuted">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}
                {' '}
                <button
                  onClick={() => setIsLogin((v) => !v)}
                  className="text-primary font-bold hover:text-primaryHover transition-colors"
                >
                  {isLogin ? 'Sign Up' : 'Log In'}
                </button>
              </p>
            </div>

            {/* Terms */}
            {!isLogin && (
              <p className="text-center text-xs text-textMuted mt-4 leading-relaxed">
                By creating an account you agree to our{' '}
                <a href="#" className="text-primary hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
              </p>
            )}
          </div>
        </div>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-textMuted">
          <p>© 2025 SmartTunes. All rights reserved.</p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookies'].map((item) => (
              <a key={item} href="#" className="hover:text-white transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};
