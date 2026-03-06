import React from 'react';
import { useInView, useCountUp } from '@/hooks/useInView';
import { BarChart3, ShoppingCart, Cpu, ArrowUpRight } from 'lucide-react';

const caseStudies = [
  {
    icon: BarChart3,
    title: 'SaaS Startup Scaling',
    subtitle: 'B2B SaaS company, post-Seed round',
    gradient: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-500/5',
    stats: [
      { label: 'Faster page loads', value: '3x', detail: '2.4s → 0.8s' },
      { label: 'Monthly savings', value: '$15K', detail: 'Projected server costs' },
      { label: 'Team velocity', value: '2x', detail: 'Increase in output' },
      { label: 'Seed round raised', value: '$500K', detail: 'Clean due diligence' },
    ],
  },
  {
    icon: ShoppingCart,
    title: 'E-commerce Platform',
    subtitle: 'Fast-growing D2C brand',
    gradient: 'from-teal-500 to-emerald-600',
    bg: 'bg-teal-500/5',
    stats: [
      { label: 'Uptime during Black Friday', value: '99.9%', detail: 'Zero downtime' },
      { label: 'Checkout abandonment', value: '18%', detail: 'Down from 42%' },
      { label: 'Revenue recovered', value: '$50K+', detail: 'Previously lost sales' },
      { label: 'Page speed score', value: '98', detail: 'Lighthouse performance' },
    ],
  },
  {
    icon: Cpu,
    title: 'AI Workflow Implementation',
    subtitle: 'Early-stage startup with 3 developers',
    gradient: 'from-purple-500 to-pink-600',
    bg: 'bg-purple-500/5',
    stats: [
      { label: 'Shipping speed', value: '3x', detail: 'Faster feature delivery' },
      { label: 'Runway extended', value: '6mo', detail: 'Through efficiency gains' },
      { label: 'AI adoption', value: '100%', detail: 'Team self-sufficient' },
      { label: 'Code quality', value: 'A+', detail: 'Maintained standards' },
    ],
  },
];

const CaseStudiesSection: React.FC = () => {
  const { ref: headRef, isInView: headVisible } = useInView();
  const { ref: gridRef, isInView: gridVisible } = useInView({ threshold: 0.05 });

  return (
    <section id="case-studies" className="relative py-24 sm:py-32 bg-white dark:bg-[#0A1929] overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-48 -right-48 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={headRef} className="text-center mb-16 sm:mb-20">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 dark:bg-teal-500/10 border border-teal-100 dark:border-teal-500/20 mb-6 transition-all duration-700 ${
              headVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <span className="text-sm font-medium text-teal-700 dark:text-teal-300">Proven Results</span>
          </div>
          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight transition-all duration-700 delay-150 ${
              headVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Real Results for
            <br />
            <span className="gradient-text">Growing Startups</span>
          </h2>
        </div>

        {/* Case study cards */}
        <div ref={gridRef} className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {caseStudies.map((study, i) => {
            const Icon = study.icon;
            return (
              <div
                key={i}
                className={`flip-card h-auto md:h-[480px] transition-all duration-700 ${
                  gridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: gridVisible ? `${i * 150}ms` : '0ms' }}
              >
                <div className="flip-card-inner relative w-full h-full">
                  {/* Front */}
                  <div className="flip-card-front relative md:absolute md:inset-0 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 p-6 sm:p-8 flex flex-col items-center justify-center text-center shadow-lg">
                    <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl ${study.bg} flex items-center justify-center mb-6`}>
                      <Icon className="w-10 h-10 text-blue-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                      {study.title}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">
                      {study.subtitle}
                    </p>

                    {/* Mini chart visualization */}
                    <div className="flex items-end gap-2 h-20">
                      {[30, 50, 45, 70, 65, 90, 85, 95].map((h, j) => (
                        <div
                          key={j}
                          className={`w-4 rounded-t-sm bg-gradient-to-t ${study.gradient} transition-all duration-500`}
                          style={{
                            height: gridVisible ? `${h}%` : '10%',
                            transitionDelay: `${i * 150 + j * 80}ms`,
                            opacity: gridVisible ? 0.4 + (j / 8) * 0.6 : 0.2,
                          }}
                        />
                      ))}
                    </div>

                    <div className="mt-6 hidden md:flex items-center gap-1 text-sm text-gray-400 dark:text-gray-500">
                      <span>Hover to see results</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </div>
                  </div>

                  {/* Back */}
                  <div className={`flip-card-back relative md:absolute md:inset-0 rounded-2xl bg-gradient-to-br ${study.gradient} p-6 sm:p-8 flex flex-col justify-center shadow-xl`}>
                    <h3 className="text-xl font-bold text-white mb-2">{study.title}</h3>
                    <p className="text-white/70 text-sm mb-8">{study.subtitle}</p>

                    <div className="space-y-5">
                      {study.stats.map((stat, j) => (
                        <div key={j} className="flex items-center justify-between">
                          <div>
                            <div className="text-white/80 text-sm">{stat.label}</div>
                            <div className="text-white/50 text-xs">{stat.detail}</div>
                          </div>
                          <div className="text-2xl font-bold text-white">{stat.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom stats bar */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCounter end={5} suffix="+" label="Startups Scaled" />
          <StatCounter end={13} suffix="+" label="Years Experience" />
          <StatCounter end={12} suffix="+" label="AI-Powered Projects" />
          <StatCounter end={40} suffix="%" label="Faster Timelines" />
        </div>
      </div>
    </section>
  );
};

const StatCounter: React.FC<{ end: number; suffix: string; label: string }> = ({ end, suffix, label }) => {
  const { count, ref } = useCountUp(end, 2000);
  return (
    <div ref={ref} className="text-center p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
      <div className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white font-mono">
        {count}{suffix}
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</div>
    </div>
  );
};

export default CaseStudiesSection;
