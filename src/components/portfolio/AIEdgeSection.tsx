import React from 'react';
import { useInView } from '@/hooks/useInView';
import { Check, X, Zap, ArrowRight } from 'lucide-react';

const tools = [
  { name: 'Cursor', desc: 'AI-first IDE' },
  { name: 'Windsurf', desc: 'AI coding agent' },
  { name: 'GitHub Copilot', desc: 'Code completion' },
  { name: 'Claude', desc: 'Architecture reasoning' },
  { name: 'Custom GPTs', desc: 'Domain-specific AI' },
  { name: 'AI Testing', desc: 'Automated QA' },
];

const AIEdgeSection: React.FC = () => {
  const { ref: headRef, isInView: headVisible } = useInView();
  const { ref: compRef, isInView: compVisible } = useInView();
  const { ref: toolRef, isInView: toolVisible } = useInView();

  return (
    <section className="relative py-24 sm:py-32 bg-white dark:bg-[#0A1929] overflow-hidden">
      {/* Circuit board background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute inset-0 w-full h-full opacity-[0.03] dark:opacity-[0.05]" viewBox="0 0 1000 600">
          {/* Circuit lines */}
          {Array.from({ length: 20 }).map((_, i) => (
            <g key={i}>
              <line
                x1={50 + (i * 50)}
                y1={0}
                x2={50 + (i * 50)}
                y2={600}
                stroke="currentColor"
                strokeWidth="0.5"
              />
              <line
                x1={0}
                y1={30 + (i * 30)}
                x2={1000}
                y2={30 + (i * 30)}
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </g>
          ))}
          {/* Nodes */}
          {Array.from({ length: 15 }).map((_, i) => (
            <circle
              key={`node-${i}`}
              cx={100 + (i % 5) * 200}
              cy={100 + Math.floor(i / 5) * 200}
              r="4"
              fill="currentColor"
              opacity="0.3"
            />
          ))}
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={headRef} className="text-center mb-16 sm:mb-20">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 dark:bg-teal-500/10 border border-teal-100 dark:border-teal-500/20 mb-6 transition-all duration-700 ${
              headVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Zap className="w-4 h-4 text-teal-500" />
            <span className="text-sm font-medium text-teal-700 dark:text-teal-300">AI-Powered Development</span>
          </div>
          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight transition-all duration-700 delay-150 ${
              headVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <span className="text-gray-900 dark:text-white">I build </span>
            <span className="gradient-text">3x faster using AI</span>
            <br />
            <span className="text-gray-900 dark:text-white text-2xl sm:text-3xl lg:text-4xl">and I'll teach your team to do the same</span>
          </h2>
        </div>

        {/* Workflow comparison */}
        <div ref={compRef} className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-16">
          {/* Traditional */}
          <div
            className={`p-8 rounded-2xl bg-red-50/50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/10 transition-all duration-700 ${
              compVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
            }`}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-500/10 flex items-center justify-center">
                <X className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">Traditional Workflow</h3>
                <p className="text-xs text-red-500">Slow & expensive</p>
              </div>
            </div>

            <div className="space-y-3">
              {['Write code manually', 'Debug for hours', 'Repeat endlessly', 'Ship slowly'].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-500/10 flex items-center justify-center text-xs font-mono text-red-500 font-bold">
                    {i + 1}
                  </div>
                  <span className="text-gray-600 dark:text-gray-300 text-sm">{step}</span>
                  {i < 3 && <ArrowRight className="w-3 h-3 text-red-300 dark:text-red-500/40 ml-auto" />}
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-red-100 dark:border-red-500/10">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-red-100 dark:bg-red-500/10 rounded-full overflow-hidden">
                  <div className="h-full w-[35%] bg-red-400 rounded-full" />
                </div>
                <span className="text-xs text-red-500 font-mono">35% efficient</span>
              </div>
            </div>
          </div>

          {/* AI-Powered */}
          <div
            className={`p-8 rounded-2xl bg-green-50/50 dark:bg-green-500/5 border border-green-100 dark:border-green-500/10 transition-all duration-700 delay-200 ${
              compVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            }`}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-500/10 flex items-center justify-center">
                <Check className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">My AI Workflow</h3>
                <p className="text-xs text-green-500">Fast & scalable</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { step: 'Architect (human)', tag: 'Strategy' },
                { step: 'Generate (AI)', tag: 'Speed' },
                { step: 'Review (human)', tag: 'Quality' },
                { step: 'Deploy', tag: 'Ship' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-500/10 flex items-center justify-center text-xs font-mono text-green-500 font-bold">
                    {i + 1}
                  </div>
                  <span className="text-gray-600 dark:text-gray-300 text-sm">{item.step}</span>
                  <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400 font-medium">
                    {item.tag}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-green-100 dark:border-green-500/10">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-green-100 dark:bg-green-500/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-teal-400 rounded-full transition-all duration-1000"
                    style={{ width: compVisible ? '90%' : '0%' }}
                  />
                </div>
                <span className="text-xs text-green-500 font-mono">90% efficient</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tools grid */}
        <div ref={toolRef}>
          <h3
            className={`text-center text-lg font-semibold text-gray-900 dark:text-white mb-8 transition-all duration-700 ${
              toolVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Tools in my AI arsenal
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {tools.map((tool, i) => (
              <div
                key={i}
                className={`group p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-center transition-all duration-500 hover:shadow-lg hover:-translate-y-1 hover:border-blue-200 dark:hover:border-blue-500/30 ${
                  toolVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: toolVisible ? `${i * 80}ms` : '0ms' }}
              >
                <div className="text-sm font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {tool.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{tool.desc}</div>
              </div>
            ))}
          </div>

          {/* Bottom stat */}
          <div
            className={`mt-12 text-center transition-all duration-700 delay-500 ${
              toolVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-500/10 dark:to-teal-500/10 border border-blue-100 dark:border-blue-500/20">
              <Zap className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                Delivered <span className="text-blue-600 dark:text-blue-400">12+ projects</span> with{' '}
                <span className="text-teal-600 dark:text-teal-400">40-60% faster timelines</span> using AI augmentation
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIEdgeSection;
