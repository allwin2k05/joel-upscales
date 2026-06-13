import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

interface GrainyDotsBackgroundProps {
  className?: string;
  dotColor?: string;
  interactionRadius?: number;
  density?: number; // Space between dots
  grainIntensity?: number; // Noise overlay opacity (0 to 1)
  position?: 'absolute' | 'fixed';
}

const GrainyDotsBackground: React.FC<GrainyDotsBackgroundProps> = ({
  className = '',
  dotColor = 'rgba(239, 68, 68, 0.45)', // Red-500 semi-transparent default
  interactionRadius = 130,
  density = 35,
  grainIntensity = 0.08,
  position = 'absolute',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const initParticles = () => {
      particles = [];
      const cols = Math.floor(width / density);
      const rows = Math.floor(height / density);
      const offsetX = (width - cols * density) / 2;
      const offsetY = (height - rows * density) / 2;

      for (let c = 0; c <= cols; c++) {
        for (let r = 0; r <= rows; r++) {
          const x = offsetX + c * density;
          const y = offsetY + r * density;
          particles.push({
            x: x,
            y: y,
            baseX: x,
            baseY: y,
            vx: 0,
            vy: 0,
            size: Math.random() * 1.5 + 1, // Random small grain-like size
            color: dotColor,
          });
        }
      }
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      initParticles();
    };

    window.addEventListener('resize', handleResize);
    initParticles();

    // Mouse events
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
      mouseRef.current.active = false;
    };

    // Listen globally on window/document to capture mouse tracking regardless of overlaying elements
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    const springStrength = 0.04;
    const damping = 0.88;
    const mouseForce = 0.08;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Physics: return to original position (spring force)
        const dxBase = p.baseX - p.x;
        const dyBase = p.baseY - p.y;
        p.vx += dxBase * springStrength;
        p.vy += dyBase * springStrength;

        // Interaction with mouse (repulsion)
        if (mx > -500) {
          const dxMouse = p.x - mx;
          const dyMouse = p.y - my;
          const distSquare = dxMouse * dxMouse + dyMouse * dyMouse;
          const dist = Math.sqrt(distSquare);

          if (dist < interactionRadius) {
            // Stronger push when closer
            const force = (interactionRadius - dist) / interactionRadius;
            const pushX = (dxMouse / dist) * force * mouseForce * 60;
            const pushY = (dyMouse / dist) * force * mouseForce * 60;
            
            p.vx += pushX;
            p.vy += pushY;
          }
        }

        // Apply friction and move
        p.vx *= damping;
        p.vy *= damping;
        p.x += p.vx;
        p.y += p.vy;

        // Draw dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [dotColor, interactionRadius, density]);

  return (
    <div className={`${position} inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Canvas for particles */}
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Grain overlay SVG Filter */}
      <svg className="hidden">
        <filter id="noiseFilter">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.8" 
            numOctaves="3" 
            stitchTiles="stitch" 
          />
          <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.15 0" />
        </filter>
      </svg>

      {/* Grain noise overlay div */}
      <div 
        className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30 bg-repeat"
        style={{
          opacity: grainIntensity,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0%200%20200%20200'%20xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter%20id='noiseFilter'%3E%3CfeTurbulence%20type='fractalNoise'%20baseFrequency='0.75'%20numOctaves='3'%20stitchTiles='stitch'/%3E%3C/filter%3E%3Crect%20width='100%25'%20height='100%25'%20filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};

export default GrainyDotsBackground;
