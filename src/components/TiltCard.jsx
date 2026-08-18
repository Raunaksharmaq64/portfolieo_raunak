import React, { useRef, useState, useEffect } from 'react';

export default function TiltCard({ children, className, onClick, restTransform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)' }) {
  const cardRef = useRef(null);
  const [isHoverSupported, setIsHoverSupported] = useState(true);

  useEffect(() => {
    const checkHover = () => {
      const isMobile = window.innerWidth <= 992 || (window.matchMedia && !window.matchMedia('(hover: hover)').matches);
      setIsHoverSupported(!isMobile);
    };
    checkHover();
    window.addEventListener('resize', checkHover);
    return () => window.removeEventListener('resize', checkHover);
  }, []);

  const activeRestTransform = isHoverSupported ? restTransform : 'none';

  const handleMouseMove = (e) => {
    if (!isHoverSupported) return;
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -(y - centerY) / 14;
    const rotateY = (x - centerX) / 14;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = activeRestTransform;
  };

  return (
    <div
      ref={cardRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transition: 'transform 0.15s ease-out, border-color 0.3s ease, box-shadow 0.3s ease',
        transformStyle: isHoverSupported ? 'preserve-3d' : 'flat',
        transform: activeRestTransform,
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
}

