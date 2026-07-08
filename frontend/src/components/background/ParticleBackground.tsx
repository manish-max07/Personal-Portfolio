"use client";

import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  baseOpacity: number;
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const dimensionsRef = useRef({ width: 0, height: 0 });

  const createParticles = useCallback((width: number, height: number) => {
    const isMobile = width < 768;
    const count = isMobile ? 40 : 80;
    const particles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const baseOpacity = 0.2 + Math.random() * 0.4;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: 1 + Math.random() * 1.5,
        opacity: baseOpacity,
        baseOpacity,
      });
    }

    return particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      dimensionsRef.current = { width, height };

      if (
        particlesRef.current.length === 0 ||
        Math.abs(width - dimensionsRef.current.width) > 200
      ) {
        particlesRef.current = createParticles(width, height);
      }
    };

    handleResize();
    particlesRef.current = createParticles(canvas.width, canvas.height);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    const connectionDistance = 150;
    const mouseRadius = 180;

    const animate = () => {
      const { width, height } = dimensionsRef.current;
      ctx.clearRect(0, 0, width, height);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Mouse interaction: drift away slightly + brighten
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);

        if (distToMouse < mouseRadius) {
          const force = (mouseRadius - distToMouse) / mouseRadius;
          p.vx -= (dx / distToMouse) * force * 0.015;
          p.vy -= (dy / distToMouse) * force * 0.015;
          p.opacity = Math.min(1, p.baseOpacity + force * 0.5);
        } else {
          p.opacity += (p.baseOpacity - p.opacity) * 0.02;
        }

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Damping
        p.vx *= 0.999;
        p.vy *= 0.999;

        // Wrap edges
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Draw particle with glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34, 200, 255, ${p.opacity})`;
        ctx.fill();

        // Subtle glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34, 200, 255, ${p.opacity * 0.15})`;
        ctx.fill();
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const lineOpacity =
              (1 - dist / connectionDistance) *
              0.15 *
              Math.min(particles[i].opacity, particles[j].opacity);

            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(34, 200, 255, ${lineOpacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [createParticles]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      {/* CSS Grid lines */}
      <div className="absolute inset-0 bg-grid" />

      {/* Radial glow */}
      <div className="absolute inset-0 bg-radial-glow" />

      {/* Canvas particles — needs pointer-events for mouse tracking */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: "auto" }}
      />
    </div>
  );
}
