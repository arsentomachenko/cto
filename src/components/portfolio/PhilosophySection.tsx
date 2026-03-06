import React, { useState } from 'react';
import { useInView } from '@/hooks/useInView';
import { CreditCard, Gauge, Bot, Building2 } from 'lucide-react';

const principles = [
  {
    icon: CreditCard,
    title: 'Pay Down Tech Debt Early',
    text: "Technical debt is like credit card debt—useful for MVPs, deadly for scaling. I help startups pay it down before interest kills them.",
    gradient: 'from-blue-500 to-indigo-600',
    delay: 0,
  },
  {
    icon: Gauge,
    title: 'Velocity Over Perfection',
    text: "Your team's velocity matters more than your code's perfection. I focus on unblocking developers, not just writing clean code.",
    gradient: 'from-teal-500 to-emerald-600',
    delay: 100,
  },
  {
    icon: Bot,
    title: 'AI-First Development',
    text: "AI won't replace engineers—but engineers using AI will replace everyone else. I build AI-first development cultures.",
    gradient: 'from-purple-500 to-pink-600',
    delay: 200,
  },
  {
    icon: Building2,
    title: 'Build for Tomorrow',
    text: "The best architecture is the one you don't have to rewrite at Series A. I build for today AND tomorrow.",
    gradient: 'from-orange-500 to-red-600',
    delay: 300,
  },
];

const PhilosophySection: React.FC = () => {
  const { ref: headRef, isInView: headVisible } = useInView();
  const { ref: gridRef, isInView: gridVisible } = useInView({ threshold: 0.05 });
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <section id="philosophy" className="relative py-24 sm:py-32 bg-slate-50 dark:bg-[#0d1f33] overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-float-slow pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl animate-float pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={headRef} className="text-center mb-16 sm:mb-20">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-500/20 mb-6 transition-all duration-700 ${
              headVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">My Approach</span>
          </div>
          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight transition-all duration-700 delay-150 ${
              headVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            How I think about building
            <br />
            <span className="gradient-text">scalable startups</span>
          </h2>
        </div>

        {/* Principle cards */}
        <div ref={gridRef} className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {principles.map((principle, i) => {
            const Icon = principle.icon;
            const isHovered = hoveredCard === i;
            return (
              <div
                key={i}
                className={`group relative p-8 sm:p-10 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 transition-all duration-700 cursor-default ${
                  gridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{
                  transitionDelay: gridVisible ? `${principle.delay}ms` : '0ms',
                  transform: isHovered
                    ? 'translateY(-8px) scale(1.02)'
                    : gridVisible
                    ? 'translateY(0) scale(1)'
                    : 'translateY(48px) scale(1)',
                }}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Floating sphere decoration */}
                <div
                  className={`absolute -top-4 -right-4 w-24 h-24 rounded-full bg-gradient-to-br ${principle.gradient} opacity-5 group-hover:opacity-10 transition-all duration-700 group-hover:scale-150`}
                />
                <div
                  className={`absolute -bottom-6 -left-6 w-16 h-16 rounded-full bg-gradient-to-br ${principle.gradient} opacity-5 group-hover:opacity-10 transition-all duration-700 group-hover:scale-150`}
                />

                {/* Icon with orbit animation */}
                <div className="relative mb-6">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${principle.gradient} flex items-center justify-center transition-all duration-500 group-hover:shadow-lg group-hover:scale-110`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  {/* Orbiting dot */}
                  <div
                    className={`absolute w-2 h-2 rounded-full bg-gradient-to-br ${principle.gradient} transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                    style={{
                      animation: isHovered ? 'orbit 3s linear infinite' : 'none',
                      top: '50%',
                      left: '50%',
                      '--orbit-radius': '30px',
                    } as React.CSSProperties}
                  />
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {principle.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base">
                  {principle.text}
                </p>

                {/* Bottom gradient line */}
                <div className={`absolute bottom-0 left-8 right-8 h-0.5 rounded-full bg-gradient-to-r ${principle.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PhilosophySection;
