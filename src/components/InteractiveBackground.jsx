import React, { useEffect, useRef } from 'react';

export default function InteractiveBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.parentElement) return;
    const ctx = canvas.getContext('2d');
    const parent = canvas.parentElement;

    let animationId;
    let particles = [];
    let mouse = { x: null, y: null, radius: 120 };
    let isVisible = true;

    const resize = () => {
      if (!canvas || !parent) return;
      canvas.width = parent.offsetWidth || window.innerWidth;
      canvas.height = parent.offsetHeight || window.innerHeight;
      init();
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    parent.addEventListener('mousemove', handleMouseMove, { passive: true });
    parent.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    window.addEventListener('resize', resize, { passive: true });

    class Particle {
      constructor() {
        this.x = Math.random() * (canvas.width || 800);
        this.y = Math.random() * (canvas.height || 600);
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

        if (mouse.x !== null && mouse.y !== null) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < mouse.radius && dist > 0) {
            const force = (mouse.radius - dist) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            this.x += Math.cos(angle) * force * 2;
            this.y += Math.sin(angle) * force * 2;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        const isLightTheme = document.body.classList.contains('light-theme');
        ctx.fillStyle = isLightTheme ? 'rgba(180, 130, 30, 0.35)' : 'rgba(251, 191, 36, 0.25)';
        ctx.fill();
      }
    }

    const init = () => {
      particles = [];
      const w = canvas.width || 800;
      const h = canvas.height || 600;
      const count = Math.min(70, Math.max(25, Math.floor((w * h) / 14000)));
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    };

    resize();

    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const animate = () => {
      if (isVisible && canvas.width > 0 && canvas.height > 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.update();
          p.draw();

          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 90) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              const isLightTheme = document.body.classList.contains('light-theme');
              ctx.strokeStyle = isLightTheme 
                ? `rgba(180, 130, 30, ${0.18 * (1 - dist / 90)})` 
                : `rgba(251, 191, 36, ${0.12 * (1 - dist / 90)})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (parent) {
        parent.removeEventListener('mousemove', handleMouseMove);
        parent.removeEventListener('mouseleave', handleMouseLeave);
      }
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />;
}

