import React, { useState, useEffect, useCallback } from 'react';
import { useInView } from '@/hooks/useInView';
import { useIsMobile } from '@/hooks/use-mobile';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    text: "He didn't just fix our code—he fixed how we think about building. Our dev team is 3x more productive and actually enjoys coding again.",
    author: 'Sarah M.',
    role: 'Founder, B2B SaaS',
    detail: 'Raised $2M after working together',
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    text: "We were weeks from running out of cash. He came in, showed us how to use AI effectively, and we shipped our MVP in 6 weeks instead of 6 months.",
    author: 'David K.',
    role: 'CEO, Early-stage Startup',
    detail: 'Extended runway by 6 months',
    gradient: 'from-teal-500 to-emerald-600',
  },
  {
    text: "Our site kept crashing on every product launch. He redesigned our architecture in 2 weeks and we haven't had a single outage since.",
    author: 'Michelle R.',
    role: 'CTO, D2C E-commerce',
    detail: '99.9% uptime since engagement',
    gradient: 'from-purple-500 to-pink-600',
  },
  {
    text: "James brought clarity to our technical chaos. He identified the exact bottlenecks holding us back and created a roadmap that our team could actually execute.",
    author: 'Alex T.',
    role: 'Co-founder, FinTech Startup',
    detail: 'Shipped 3 major features in 4 weeks',
    gradient: 'from-orange-500 to-red-600',
  },
];

const TestimonialsSection: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const { ref, isInView } = useInView();
  const isMobile = useIsMobile();

  const goTo = useCallback((index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent(index);
    setTimeout(() => setIsAnimating(false), 600);
  }, [isAnimating]);

  const next = useCallback(() => {
    goTo((current + 1) % testimonials.length);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + testimonials.length) % testimonials.length);
  }, [current, goTo]);

  // Auto-advance
  useEffect(() => {
    if (!isInView) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [isInView, next]);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({
      x: (0.5 - y) * 4,
      y: (x - 0.5) * 6,
    });
  };

  const handleCardMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <section className="relative py-24 sm:py-32 bg-white dark:bg-[#0A1929] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div ref={ref} className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 mb-6 transition-all duration-700 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Quote className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Testimonials</span>
          </div>
          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight transition-all duration-700 delay-150 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Trusted by founders
            <br />
            <span className="gradient-text">who needed to scale</span>
          </h2>
        </div>

        {/* Testimonial card */}
        <div
          className={`relative transition-all duration-700 delay-300 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
          onMouseMove={handleCardMouseMove}
          onMouseLeave={handleCardMouseLeave}
        >
          <div
            className="relative overflow-hidden rounded-2xl bg-slate-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 p-8 sm:p-12 min-h-[300px] transition-transform duration-300 will-change-transform"
            style={
              isMobile
                ? undefined
                : { transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }
            }
          >
            {/* Large quote mark */}
            <div className="absolute top-6 left-8 opacity-5">
              <Quote className="w-24 h-24" />
            </div>

            {/* Testimonial content */}
            <div className="relative">
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className={`transition-all duration-600 ${
                    i === current
                      ? 'opacity-100 translate-y-0 relative'
                      : 'opacity-0 translate-y-4 absolute inset-0 pointer-events-none'
                  }`}
                >
                  <blockquote className="text-xl sm:text-2xl lg:text-3xl font-medium text-gray-900 dark:text-white leading-relaxed mb-8">
                    "{t.text}"
                  </blockquote>

                  <div className="flex items-center gap-4">
                    {/* Avatar placeholder */}
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white font-bold text-lg`}>
                      {t.author[0]}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white">{t.author}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{t.role}</div>
                      <div className={`text-xs font-medium bg-gradient-to-r ${t.gradient} bg-clip-text text-transparent`}>
                        {t.detail}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            {/* Dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`transition-all duration-300 rounded-full ${
                    i === current
                      ? 'w-8 h-2.5 bg-blue-500'
                      : 'w-2.5 h-2.5 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            {/* Arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={prev}
                className="w-10 h-10 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/20 transition-all hover:scale-105"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                className="w-10 h-10 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/20 transition-all hover:scale-105"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
