import React from 'react';
import { useInView } from '@/hooks/useInView';

const technologies = [
  'React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis',
  'AWS', 'Docker', 'Kubernetes', 'GraphQL', 'Python', 'Go',
  'Terraform', 'CI/CD', 'Microservices', 'REST APIs',
];

const TechStackMarquee: React.FC = () => {
  const { ref, isInView } = useInView();

  return (
    <section ref={ref} className="py-12 bg-white dark:bg-[#0A1929] border-y border-gray-100 dark:border-white/5 overflow-hidden">
      <div
        className={`transition-all duration-700 ${
          isInView ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <p className="text-center text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-6 font-medium">
          Technologies I work with
        </p>
        <div className="relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white dark:from-[#0A1929] to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white dark:from-[#0A1929] to-transparent z-10" />

          {/* Marquee */}
          <div className="flex animate-marquee">
            {[...technologies, ...technologies].map((tech, i) => (
              <div
                key={i}
                className="flex-shrink-0 mx-4 px-5 py-2.5 rounded-lg bg-slate-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-500/30 transition-colors cursor-default"
              >
                {tech}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStackMarquee;
