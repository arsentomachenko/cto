import React from 'react';
import { useInView } from '@/hooks/useInView';
import { AlertTriangle, TrendingDown, Layers, Code2 } from 'lucide-react';

const problems = [
  {
    icon: AlertTriangle,
    text: 'Your MVP is creaking under new users',
    detail: 'Performance issues, random crashes, and angry support tickets',
    color: 'text-orange-500',
    bg: 'bg-orange-50 dark:bg-orange-500/10',
    border: 'border-orange-200 dark:border-orange-500/20',
  },
  {
    icon: TrendingDown,
    text: "Your team's velocity is dropping",
    detail: 'Features that took days now take weeks',
    color: 'text-red-500',
    bg: 'bg-red-50 dark:bg-red-500/10',
    border: 'border-red-200 dark:border-red-500/20',
  },
  {
    icon: Layers,
    text: 'Technical debt is piling up',
    detail: 'Every new feature adds more complexity and risk',
    color: 'text-yellow-500',
    bg: 'bg-yellow-50 dark:bg-yellow-500/10',
    border: 'border-yellow-200 dark:border-yellow-500/20',
  },
  {
    icon: Code2,
    text: 'Founders are stuck coding instead of fundraising',
    detail: "You're the bottleneck and you know it",
    color: 'text-purple-500',
    bg: 'bg-purple-50 dark:bg-purple-500/10',
    border: 'border-purple-200 dark:border-purple-500/20',
  },
];

const ProblemSection: React.FC = () => {
  const { ref: headRef, isInView: headVisible } = useInView();
  const { ref: listRef, isInView: listVisible } = useInView();
  const { ref: closeRef, isInView: closeVisible } = useInView();

  return (
    <section className="relative py-24 sm:py-32 bg-white dark:bg-[#0A1929] overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
        backgroundSize: '40px 40px',
      }} />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Headline */}
        <div ref={headRef} className="text-center mb-16">
          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight transition-all duration-700 ${
              headVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            You've got product-market fit.
            <br />
            <span className="gradient-text">Now technical debt is slowing you down.</span>
          </h2>
        </div>

        {/* Problem list */}
        <div ref={listRef} className="space-y-4 sm:space-y-5 mb-16">
          {problems.map((problem, i) => {
            const Icon = problem.icon;
            return (
              <div
                key={i}
                className={`group flex items-start gap-4 sm:gap-6 p-5 sm:p-6 rounded-2xl border ${problem.border} ${problem.bg} transition-all duration-700 card-hover ${
                  listVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
                }`}
                style={{ transitionDelay: listVisible ? `${i * 150}ms` : '0ms' }}
              >
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${problem.bg} border ${problem.border} flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                  <Icon className={`w-6 h-6 ${problem.color}`} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    {problem.text}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {problem.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Closing line */}
        <div ref={closeRef} className="text-center">
          <p
            className={`text-xl sm:text-2xl font-bold text-gray-900 dark:text-white transition-all duration-700 ${
              closeVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            I step in, clean up the mess, and{' '}
            <span className="gradient-text">set you up for scale.</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
