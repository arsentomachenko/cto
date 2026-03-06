import React, { Suspense, useMemo, useState } from 'react';
import { useInView } from '@/hooks/useInView';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePrefersReducedMotion } from '@/hooks/use-reduced-motion';
import { useWebGLSupport } from '@/hooks/use-webgl-support';
import { Search, Network, Brain, Filter, Crown } from 'lucide-react';
import type { Service3DKind } from './three/ServiceIcon3D';

const LazyServiceIcon3D = React.lazy(() => import('./three/ServiceIcon3D'));

const services = [
  {
    icon: Search,
    title: 'Technical Due Diligence',
    kind: 'diligence' as Service3DKind,
    description: "1-week full codebase audit. I'll tell you what's going to break when you hit 10k users—and exactly how to fix it.",
    details: ['Architecture review', 'Security audit', 'Performance profiling', 'Actionable report'],
    gradient: 'from-blue-500 to-indigo-600',
    glow: 'shadow-blue-500/20',
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-500',
  },
  {
    icon: Network,
    title: 'Scaling Architecture',
    kind: 'architecture' as Service3DKind,
    description: "Your database is slowing down. Your API is brittle. I'll redesign your infrastructure to handle 100x growth.",
    details: ['Database optimization', 'API redesign', 'Caching strategy', 'Load balancing'],
    gradient: 'from-teal-500 to-emerald-600',
    glow: 'shadow-teal-500/20',
    iconBg: 'bg-teal-500/10',
    iconColor: 'text-teal-500',
  },
  {
    icon: Brain,
    title: 'AI Development Acceleration',
    kind: 'acceleration' as Service3DKind,
    description: 'I implement AI workflows (Cursor, Copilot, custom LLMs) that make your dev team 3x faster without burning out.',
    details: ['AI tool integration', 'Custom GPT workflows', 'Team training', 'Process optimization'],
    gradient: 'from-purple-500 to-pink-600',
    glow: 'shadow-purple-500/20',
    iconBg: 'bg-purple-500/10',
    iconColor: 'text-purple-500',
  },
  {
    icon: Filter,
    title: 'Bottleneck Elimination',
    kind: 'bottleneck' as Service3DKind,
    description: 'I find the 20% of technical problems causing 80% of your slowdown and fix them permanently.',
    details: ['Performance profiling', 'Query optimization', 'Code refactoring', 'CI/CD pipeline'],
    gradient: 'from-orange-500 to-red-600',
    glow: 'shadow-orange-500/20',
    iconBg: 'bg-orange-500/10',
    iconColor: 'text-orange-500',
  },
  {
    icon: Crown,
    title: 'Fractional CTO Mentorship',
    kind: 'mentorship' as Service3DKind,
    description: '10-20 hours/week working alongside your team, reviewing code, and teaching senior-level thinking.',
    details: ['Code reviews', 'Architecture decisions', 'Hiring guidance', 'Team mentorship'],
    gradient: 'from-amber-500 to-yellow-600',
    glow: 'shadow-amber-500/20',
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-500',
  },
];


const ServicesSection: React.FC = () => {
  const { ref: headRef, isInView: headVisible } = useInView();
  const { ref: gridRef, isInView: gridVisible } = useInView({ threshold: 0.05 });
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const isMobile = useIsMobile();
  const prefersReducedMotion = usePrefersReducedMotion();
  const webglSupported = useWebGLSupport();
  const show3D = useMemo(
    () => webglSupported && gridVisible && !isMobile && !prefersReducedMotion,
    [webglSupported, gridVisible, isMobile, prefersReducedMotion]
  );

  return (
    <section id="services" className="relative py-24 sm:py-32 bg-slate-50 dark:bg-[#0d1f33] overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={headRef} className="text-center mb-16 sm:mb-20">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 mb-6 transition-all duration-700 ${
              headVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">What I Do</span>
          </div>
          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight transition-all duration-700 delay-150 ${
              headVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            CTO-Level Services for
            <br />
            <span className="gradient-text">Growing Startups</span>
          </h2>
        </div>

        {/* Services grid */}
        <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => {
            const Icon = service.icon;
            const isExpanded = expandedCard === i;
            return (
              <div
                key={i}
                className={`group relative p-6 sm:p-8 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 transition-all duration-700 cursor-pointer ${
                  isExpanded ? `shadow-2xl ${service.glow} scale-[1.02] -translate-y-2` : 'hover:shadow-xl hover:-translate-y-1'
                } ${
                  gridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                } ${i >= 3 ? 'lg:col-span-1' : ''}`}
                style={{ transitionDelay: gridVisible ? `${i * 100}ms` : '0ms' }}
                onClick={() => setExpandedCard(isExpanded ? null : i)}
              >
                {/* Gradient top border */}
                <div className={`absolute top-0 left-6 right-6 h-1 rounded-b-full bg-gradient-to-r ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                {/* Icon */}
                <div className={`relative w-14 h-14 rounded-2xl ${service.iconBg} flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                  {show3D ? (
                    <Suspense fallback={<Icon className={`w-7 h-7 ${service.iconColor}`} />}>
                      <LazyServiceIcon3D kind={service.kind} />
                    </Suspense>
                  ) : (
                    <Icon className={`w-7 h-7 ${service.iconColor}`} />
                  )}

                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                </div>


                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                  {service.description}
                </p>

                {/* Expandable details */}
                <div
                  className={`overflow-hidden transition-all duration-500 ${
                    isExpanded ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="pt-4 border-t border-gray-100 dark:border-white/10">
                    <ul className="space-y-2">
                      {service.details.map((detail, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                          <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${service.gradient}`} />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Click hint */}
                <div className="mt-4 flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                  <span>{isExpanded ? 'Click to collapse' : 'Click for details'}</span>
                  <svg className={`w-3 h-3 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
