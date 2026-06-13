import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Music2, Facebook, Instagram, Github } from 'lucide-react';

const FOOTER_LINKS = {
  Company: ['About', 'Jobs', 'Press'],
  Communities: ['For Artists', 'Developers', 'Advertising', 'Investors'],
  'Useful Links': ['Support', 'Mobile App', 'AI Policy'],
};

const SOCIAL_LINKS = [
  {
    label: 'Facebook',
    href: '#',
    icon: Facebook,
  },
  {
    label: 'Instagram',
    href: '#',
    icon: Instagram,
  },
  {
    label: 'GitHub',
    href: '#',
    icon: Github,
  },
];

/**
 * Shared footer used across all main pages.
 */
export const Footer = () => {
  return (
    <footer className="bg-surface border-t border-white/5" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top section: logo + link columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <RouterLink to="/home" className="flex items-center gap-2 mb-5 group w-fit">
              <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <Music2 className="w-3.5 h-3.5 text-black" strokeWidth={2.5} />
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-white">
                SmartTunes
              </span>
            </RouterLink>
            <p className="text-sm text-textMuted leading-relaxed mb-5 max-w-[200px]">
              Stream music and explore interactive sheet music in one place.
            </p>
            {/* Social links */}
            <div className="flex gap-3">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-textMuted hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, items]) => (
            <div key={heading}>
              <h4 className="font-display font-semibold text-sm uppercase tracking-widest text-white/60 mb-5">
                {heading}
              </h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-textMuted hover:text-white transition-colors duration-200"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-textMuted">
            © 2026 SmartTunes. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-textMuted">
            {['Legal', 'Privacy Policy', 'Cookies', 'Terms of Service'].map((item) => (
              <a
                key={item}
                href="#"
                className="hover:text-white transition-colors duration-200"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
