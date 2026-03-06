import React, { useEffect, useRef, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

const interactiveSelector = 'a, button, [role="button"], input, textarea, select, label, summary';

const CustomCursor: React.FC = () => {
  const isMobile = useIsMobile();
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const ringPosRef = useRef({ x: 0, y: 0 });
  const hoveredRef = useRef(false);
  const visibleRef = useRef(false);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [supportsCursor, setSupportsCursor] = useState(false);

  useEffect(() => {
    const hoverMedia = window.matchMedia('(hover: hover) and (pointer: fine)');
    const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');

    const updateSupport = () => {
      setSupportsCursor(hoverMedia.matches);
      setReducedMotion(motionMedia.matches);
    };

    updateSupport();
    hoverMedia.addEventListener('change', updateSupport);
    motionMedia.addEventListener('change', updateSupport);

    return () => {
      hoverMedia.removeEventListener('change', updateSupport);
      motionMedia.removeEventListener('change', updateSupport);
    };
  }, []);

  const enabled = supportsCursor && !isMobile && !reducedMotion;

  useEffect(() => {
    if (!enabled) {
      visibleRef.current = false;
      setVisible(false);
      document.documentElement.classList.remove('custom-cursor-enabled');
      return;
    }

    document.documentElement.classList.add('custom-cursor-enabled');

    let rafId = 0;

    const animate = () => {
      ringPosRef.current.x += (mouseRef.current.x - ringPosRef.current.x) * 0.18;
      ringPosRef.current.y += (mouseRef.current.y - ringPosRef.current.y) * 0.18;

      const ringScale = hoveredRef.current ? 1.35 : 1;
      const dotScale = hoveredRef.current ? 0.65 : 1;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPosRef.current.x}px, ${ringPosRef.current.y}px, 0) scale(${ringScale})`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseRef.current.x}px, ${mouseRef.current.y}px, 0) scale(${dotScale})`;
      }

      rafId = window.requestAnimationFrame(animate);
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = event.clientX;
      mouseRef.current.y = event.clientY;
      if (!visibleRef.current) {
        ringPosRef.current = { ...mouseRef.current };
        visibleRef.current = true;
        setVisible(true);
      }
    };

    const handleMouseOver = (event: Event) => {
      const target = event.target as Element | null;
      hoveredRef.current = !!target?.closest(interactiveSelector);
    };

    const handleMouseLeaveWindow = () => {
      visibleRef.current = false;
      setVisible(false);
      hoveredRef.current = false;
    };

    const handleWindowMouseOut = (event: MouseEvent) => {
      if (!event.relatedTarget) {
        handleMouseLeaveWindow();
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    window.addEventListener('mouseout', handleWindowMouseOut);
    window.addEventListener('blur', handleMouseLeaveWindow);
    rafId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleWindowMouseOut);
      window.removeEventListener('blur', handleMouseLeaveWindow);
      document.documentElement.classList.remove('custom-cursor-enabled');
    };
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  return (
    <>
      <div className={`custom-cursor-ring ${visible ? 'is-visible' : ''}`} ref={ringRef} aria-hidden />
      <div className={`custom-cursor-dot ${visible ? 'is-visible' : ''}`} ref={dotRef} aria-hidden />
    </>
  );
};

export default CustomCursor;
