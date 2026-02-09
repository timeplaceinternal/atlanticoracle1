
import React, { useEffect, useRef } from 'react';

const CosmicBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let stars: Array<{ x: number, y: number, size: number, speed: number, opacity: number, color: string }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      stars = [];
      const count = Math.floor((canvas.width * canvas.height) / 3000);
      for (let i = 0; i < count; i++) {
        const isGold = Math.random() > 0.95;
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * (isGold ? 2.5 : 1.5),
          speed: Math.random() * 0.1,
          opacity: Math.random(),
          color: isGold ? '#d4af37' : '#ffffff'
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Deep Background
      const bgGradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width
      );
      bgGradient.addColorStop(0, '#0a0a1a');
      bgGradient.addColorStop(1, '#050508');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Constellation Lines (Very Subtle)
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.03)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dist = Math.hypot(stars[i].x - stars[j].x, stars[i].y - stars[j].y);
          if (dist < 100) {
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);
          }
        }
      }
      ctx.stroke();

      // Stars
      stars.forEach(star => {
        ctx.shadowBlur = star.color === '#d4af37' ? 10 : 0;
        ctx.shadowColor = star.color;
        ctx.fillStyle = star.color + Math.floor(star.opacity * 255).toString(16).padStart(2, '0');
        
        ctx.beginPath();
        if (star.size > 2) {
          // Draw diamond star
          ctx.moveTo(star.x, star.y - star.size);
          ctx.lineTo(star.x + star.size / 2, star.y);
          ctx.lineTo(star.x, star.y + star.size);
          ctx.lineTo(star.x - star.size / 2, star.y);
        } else {
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        }
        ctx.fill();

        star.y -= star.speed;
        if (star.y < 0) star.y = canvas.height;

        star.opacity += (Math.random() - 0.5) * 0.02;
        if (star.opacity < 0.1) star.opacity = 0.1;
        if (star.opacity > 1) star.opacity = 1;
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10 pointer-events-none" />;
};

export default CosmicBackground;
