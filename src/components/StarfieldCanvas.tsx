import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  z: number;
  pz: number;
  size: number;
  opacity: number;
}

export function StarfieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let stars: Star[] = [];
    let mouseTiltX = 0;
    let mouseTiltY = 0;
    let animationId: number;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const createStar = (): Star => ({
      x: (Math.random() - 0.5) * width * 2,
      y: (Math.random() - 0.5) * height * 2,
      z: Math.random() * width,
      pz: 0,
      size: 1,
      opacity: 1,
    });

    const initStars = (count: number) => {
      stars = [];
      for (let i = 0; i < count; i++) {
        const star = createStar();
        star.pz = star.z;
        stars.push(star);
      }
    };

    const drawGlow = () => {
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, width * 0.8);
      gradient.addColorStop(0, 'rgba(0, 255, 157, 0.15)');
      gradient.addColorStop(0.5, 'rgba(255, 0, 85, 0.05)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(-width, -height, width * 2, height * 2);
    };

    const drawStars = () => {
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        star.pz = star.z;
        star.z -= 15;

        if (star.z <= 0) {
          Object.assign(star, createStar());
          star.z = width;
          star.pz = star.z;
        }

        const k = 128.0 / star.z;
        const sx = star.x * k;
        const sy = star.y * k;

        const pk = 128.0 / star.pz;
        const px = star.x * pk;
        const py = star.y * pk;

        const size = (1 - star.z / width) * 3;

        // Draw trail
        ctx.strokeStyle = `rgba(255, 255, 255, ${star.opacity * (1 - star.z / width)})`;
        ctx.lineWidth = size;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.stroke();

        // Draw head
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(sx, sy, size, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, width, height);

      ctx.save();
      ctx.translate(width / 2 + mouseTiltX * 100, height / 2 + mouseTiltY * 100);
      drawGlow();
      drawStars();
      ctx.restore();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseTiltX = (e.clientX - width / 2) * 0.0005;
      mouseTiltY = (e.clientY - height / 2) * 0.0005;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    resize();
    initStars(800);
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-40"
      style={{ background: '#050505' }}
    />
  );
}
