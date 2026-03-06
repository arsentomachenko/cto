import React, { useEffect, useState } from 'react';

const GradientOrbs: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div
        className="absolute w-[500px] h-[500px] rounded-full bg-blue-500/[0.03] dark:bg-blue-500/[0.02] blur-3xl"
        style={{
          top: `${-100 + scrollY * 0.05}px`,
          right: `${-100 + scrollY * 0.02}px`,
          transition: 'top 0.3s ease-out, right 0.3s ease-out',
        }}
      />
      <div
        className="absolute w-[400px] h-[400px] rounded-full bg-teal-500/[0.03] dark:bg-teal-500/[0.02] blur-3xl"
        style={{
          bottom: `${-100 + scrollY * 0.03}px`,
          left: `${-100 + scrollY * 0.01}px`,
          transition: 'bottom 0.3s ease-out, left 0.3s ease-out',
        }}
      />
      <div
        className="absolute w-[300px] h-[300px] rounded-full bg-purple-500/[0.02] dark:bg-purple-500/[0.01] blur-3xl"
        style={{
          top: `${40 + scrollY * 0.04}%`,
          left: '30%',
          transition: 'top 0.3s ease-out',
        }}
      />
    </div>
  );
};

export default GradientOrbs;
