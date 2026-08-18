import React, { useEffect, useRef, useState } from 'react';

/**
 * ScrollReveal — wraps children and reveals them when they scroll into view.
 * 
 * Props:
 *   direction  — 'up' | 'down' | 'left' | 'right' | 'scale' (default: 'up')
 *   delay      — delay in ms before the animation starts (default: 0)
 *   stagger    — if true, staggers children reveal with incremental delay
 *   staggerMs  — milliseconds between each staggered child (default: 80)
 *   threshold  — IntersectionObserver threshold (default: 0.15)
 *   className  — additional CSS class
 *   once       — if true, only animate once (default: true)
 */
export default function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  stagger = false,
  staggerMs = 80,
  threshold = 0.15,
  className = '',
  once = true,
}) {
  const ref = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsRevealed(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setIsRevealed(false);
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  const dirClass = `scroll-reveal-${direction}`;

  return (
    <div
      ref={ref}
      className={`scroll-reveal ${dirClass} ${isRevealed ? 'scroll-revealed' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {stagger
        ? React.Children.map(children, (child, i) => (
            <div
              className={`scroll-reveal-child ${isRevealed ? 'scroll-revealed' : ''}`}
              style={{ transitionDelay: `${delay + i * staggerMs}ms` }}
            >
              {child}
            </div>
          ))
        : children}
    </div>
  );
}
