import React, { useEffect } from 'react';
import { Github, Linkedin, Twitter, Mail, ExternalLink, Zap } from 'lucide-react';

const Footer: React.FC = () => {
  // Console Easter egg
  useEffect(() => {
    console.log(
      '%c👋 Looking for a technical partner? Email me at jamescampbell0195@gmail.com',
      'color: #3B82F6; font-size: 16px; font-weight: bold; padding: 10px;'
    );
  }, []);

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const socialLinks = [
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Github, href: 'https://github.com', label: 'GitHub' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Mail, href: 'mailto:jamescampbell0195@gmail.com', label: 'Email' },
  ];

  const navLinks = [
    { label: 'Services', href: '#services' },
    { label: 'Case Studies', href: '#case-studies' },
    { label: 'Philosophy', href: '#philosophy' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <footer className="relative bg-gray-900 dark:bg-[#060f1a] text-white overflow-hidden">
      {/* Top gradient line */}
      <div className="h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />

      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-16 grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center text-white font-bold text-sm">
                JC
              </div>
              <span className="font-bold text-xl tracking-tight">James Campbell</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md mb-6">
              Fractional CTO & Fullstack Engineer helping startups scale from chaos to clarity.
              13+ years of engineering experience. AI-first development advocate.
            </p>

            {/* Animated geometric shape */}
            <div className="inline-flex items-center gap-3">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 border border-blue-500/30 rounded-lg animate-spin-slow" />
                <div className="absolute inset-1 border border-teal-500/30 rounded-md animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '15s' }} />
                <div className="absolute inset-2 bg-blue-500/20 rounded-sm animate-pulse" />
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Zap className="w-3 h-3 text-green-500" />
                <span>Load time: &lt;0.5s</span>
                <span className="mx-1">|</span>
                <span>Lighthouse: 100</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => scrollTo(link.href)}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-1 group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-blue-500 transition-all duration-300" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Connect</h4>
            <ul className="space-y-3">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.href.startsWith('http') ? '_blank' : undefined}
                      rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="text-sm text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group"
                    >
                      <Icon className="w-4 h-4 group-hover:text-blue-400 transition-colors" />
                      {link.label}
                      {link.href.startsWith('http') && (
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>

            {/* CTA */}
            <button
              onClick={() => scrollTo('#contact')}
              className="mt-6 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-sm font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02]"
            >
              Book a Free Audit Call
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} James Campbell. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all duration-300 hover:scale-110"
                  aria-label={link.label}
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
