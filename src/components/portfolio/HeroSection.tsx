import React, { useState, useEffect } from 'react';
import { ArrowRight, Play, Users, Zap } from 'lucide-react';
import NetworkCanvas from './NetworkCanvas';

const HeroSection: React.FC = () => {
  const [scaleValue, setScaleValue] = useState(1000);
  const [textRevealed, setTextRevealed] = useState(false);
  const [complexity, setComplexity] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setTextRevealed(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setComplexity(1 + (scaleValue / 1000000) * 3);
  }, [scaleValue]);

  const formatUsers = (val: number) => {
    if (val >= 1000000) return '1,000,000';
    if (val >= 1000) return `${Math.round(val / 1000)}K`;
    return val.toString();
  };

  const getStressLevel = () => {
    if (scaleValue < 10000) return { label: 'Smooth sailing', color: 'text-green-500', bg: 'bg-green-500' };
    if (scaleValue < 100000) return { label: 'Growing pains', color: 'text-yellow-500', bg: 'bg-yellow-500' };
    if (scaleValue < 500000) return { label: 'Bottlenecks forming', color: 'text-orange-500', bg: 'bg-orange-500' };
    return { label: 'Breaking point', color: 'text-red-500', bg: 'bg-red-500' };
  };

  const stress = getStressLevel();

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Network background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-[#0A1929] dark:via-[#0d2137] dark:to-[#0A1929]">
        <NetworkCanvas complexity={complexity} />
        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/50 to-transparent dark:from-[#0A1929]/80 dark:via-[#0A1929]/50 dark:to-transparent" />
      </div>

      {/* Floating gradient orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl animate-float-slow pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-teal-500/10 dark:bg-teal-500/5 rounded-full blur-3xl animate-float pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 w-full">
        <div className="grid lg:grid-cols-5 gap-12 items-center">
          {/* Left content */}
          <div className="lg:col-span-3">
            {/* Badge */}
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 mb-8 transition-all duration-700 ${
                textRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <Zap className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Fractional CTO & Fullstack Engineer
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.1] tracking-tight text-gray-900 dark:text-white mb-6">
              {['I help founders', 'scale from', 'chaos to clarity'].map((line, i) => (
                <span
                  key={i}
                  className={`block transition-all duration-700 ${
                    textRevealed
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${300 + i * 150}ms` }}
                >
                  {i === 2 ? (
                    <span className="gradient-text">{line}</span>
                  ) : (
                    line
                  )}
                </span>
              ))}
            </h1>

            {/* Subheadline */}
            <p
              className={`text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mb-10 leading-relaxed transition-all duration-700 delay-700 ${
                textRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              I fix broken codebases, eliminate bottlenecks, and help startups build{' '}
              <span className="font-semibold text-blue-600 dark:text-blue-400">3x faster</span> using AI—without burning out or breaking the bank.
            </p>

            {/* CTAs */}
            <div
              className={`flex flex-wrap gap-4 mb-12 transition-all duration-700 delay-[900ms] ${
                textRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <button
                onClick={() => scrollTo('#case-studies')}
                className="group flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25 hover:scale-[1.02]"
              >
                View Case Studies
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => scrollTo('#contact')}
                className="group flex items-center gap-2 px-7 py-3.5 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gray-900 dark:text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-blue-300 dark:hover:border-blue-500/40"
              >
                <Play className="w-4 h-4" />
                Book a Strategy Call
              </button>
            </div>

            {/* Credibility badges */}
            <div
              className={`flex flex-wrap gap-6 transition-all duration-700 delay-[1100ms] ${
                textRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <div className="flex items-center gap-2 animate-bounce-gentle">
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">5+ Startups</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Scaled Successfully</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-teal-500" />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">13+ Years</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Engineering Experience</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Scale Simulator */}
          <div
            className={`lg:col-span-2 transition-all duration-1000 delay-[600ms] ${
              textRevealed ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            }`}
          >
            <div className="relative p-6 sm:p-8 rounded-2xl bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 shadow-2xl shadow-black/5 dark:shadow-blue-500/5">
              <div className="absolute -top-3 -right-3 px-3 py-1 bg-gradient-to-r from-blue-600 to-teal-500 text-white text-xs font-bold rounded-full shadow-lg">
                Interactive
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Scale Simulator
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                See what happens to your architecture as you grow
              </p>

              {/* Slider */}
              <div className="mb-6">
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                  <span>1,000 users</span>
                  <span>1,000,000 users</span>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={1000000}
                  step={1000}
                  value={scaleValue}
                  onChange={(e) => setScaleValue(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer accent-blue-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-blue-500/30 [&::-webkit-slider-thumb]:cursor-pointer"
                />
              </div>

              {/* Current value */}
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900 dark:text-white font-mono">
                  {formatUsers(scaleValue)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">concurrent users</div>
              </div>

              {/* Stress indicator */}
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-3 h-3 rounded-full ${stress.bg} ${scaleValue > 100000 ? 'animate-pulse' : ''}`} />
                  <span className={`text-sm font-semibold ${stress.color}`}>{stress.label}</span>
                </div>
                
                {/* Architecture nodes */}
                <div className="grid grid-cols-4 gap-2">
                  {['DB', 'API', 'Cache', 'CDN'].map((node, i) => {
                    const threshold = [50000, 100000, 200000, 500000][i];
                    const isStressed = scaleValue > threshold;
                    const isCritical = scaleValue > threshold * 2;
                    return (
                      <div
                        key={node}
                        className={`text-center p-2 rounded-lg border text-xs font-mono transition-all duration-500 ${
                          isCritical
                            ? 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 animate-pulse'
                            : isStressed
                            ? 'bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/30 text-yellow-600 dark:text-yellow-400'
                            : 'bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/30 text-green-600 dark:text-green-400'
                        }`}
                      >
                        {node}
                      </div>
                    );
                  })}
                </div>

                {scaleValue > 300000 && (
                  <p className="mt-3 text-xs text-red-500 dark:text-red-400 font-medium animate-fade-in">
                    This is where most startups break. I fix this permanently.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 animate-bounce-gentle">
        <span className="text-xs text-gray-400 dark:text-gray-500">Scroll to explore</span>
        <div className="w-6 h-10 rounded-full border-2 border-gray-300 dark:border-gray-600 flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
