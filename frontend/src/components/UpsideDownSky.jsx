import { useEffect, useRef, useState } from 'react';

/**
 * UpsideDownSky
 * Full-page animated canvas: storm clouds, Mind Flayer silhouette, lightning,
 * plus the Upside Down Mode toggle button.
 */
export default function UpsideDownSky() {
  const skyRef = useRef(null);
  const [upsideDown, setUpsideDown] = useState(false);

  useEffect(() => {
    const canvas = skyRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let t = 0;
    let lightnings = [];

    // Cloud particles
    let clouds = [];
    function initClouds(w, h) {
      clouds = Array.from({ length: 100 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h * 0.65,
        r: 40 + Math.random() * 110,
        alpha: 0.05 + Math.random() * 0.14,
        drift: (Math.random() - 0.5) * 0.18,
        phase: Math.random() * Math.PI * 2,
        color: Math.random() > 0.55 ? '#8b0000' : '#3d0000',
      }));
    }

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initClouds(canvas.width, canvas.height);
    }
    resize();
    window.addEventListener('resize', resize);

    function spawnLightning(w, h) {
      if (Math.random() > 0.988) {
        const sx = 80 + Math.random() * (w - 160);
        const segs = [];
        let cx = sx, cy = 0;
        while (cy < h * 0.55) {
          const nx = cx + (Math.random() - 0.5) * 60;
          const ny = cy + 28 + Math.random() * 38;
          segs.push([cx, cy, nx, ny]);
          cx = nx; cy = ny;
        }
        lightnings.push({ segs, life: 14, maxLife: 14 });
      }
    }

    // Mind Flayer silhouette
    function drawMindFlayer(ctx, x, y, scale, alpha) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(x, y);
      ctx.scale(scale, scale);

      // Central body
      ctx.beginPath();
      ctx.ellipse(0, 0, 50, 32, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#1a0000';
      ctx.fill();

      // Tentacles
      const tendrils = [
        { cp1: [-80, -50], end: [-130, -80] },
        { cp1: [80, -50],  end: [130, -80] },
        { cp1: [-60, 10],  end: [-120, 40] },
        { cp1: [60, 10],   end: [120, 40] },
        { cp1: [-30, 25],  end: [-55, 90] },
        { cp1: [30, 25],   end: [55, 90] },
        { cp1: [0, -40],   end: [0, -100] },
        { cp1: [-15, 28],  end: [-30, 100] },
        { cp1: [15, 28],   end: [30, 100] },
      ];
      ctx.strokeStyle = '#2a0000';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      tendrils.forEach(({ cp1, end }) => {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(cp1[0], cp1[1], end[0], end[1]);
        ctx.stroke();
      });

      ctx.restore();
    }

    function draw() {
      const w = canvas.width;
      const h = canvas.height;
      t += 0.004;

      ctx.clearRect(0, 0, w, h);

      // Deep background radial
      const bg = ctx.createRadialGradient(w * 0.5, h * 0.3, 0, w * 0.5, h * 0.5, w * 0.75);
      bg.addColorStop(0, '#1a0000');
      bg.addColorStop(0.4, '#0d0000');
      bg.addColorStop(1, '#000000');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Storm clouds
      clouds.forEach(c => {
        c.x += c.drift;
        if (c.x > w + c.r) c.x = -c.r;
        if (c.x < -c.r) c.x = w + c.r;
        const pulse = 0.85 + 0.15 * Math.sin(t * 1.2 + c.phase);
        ctx.beginPath();
        ctx.arc(c.x, c.y + Math.sin(t + c.x * 0.006) * 7, c.r, 0, Math.PI * 2);
        ctx.fillStyle = c.color;
        ctx.globalAlpha = c.alpha * pulse;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Central fire glow
      const glow = ctx.createRadialGradient(
        w * 0.5 + Math.sin(t * 0.28) * 35, h * 0.26 + Math.cos(t * 0.18) * 18, 0,
        w * 0.5, h * 0.3, 200
      );
      glow.addColorStop(0, 'rgba(220, 80, 0, 0.22)');
      glow.addColorStop(0.45, 'rgba(180, 0, 0, 0.10)');
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      // Mind Flayer
      const mfScale = 1.3 + 0.07 * Math.sin(t * 0.45);
      const mfAlpha = 0.14 + 0.04 * Math.sin(t * 0.6);
      drawMindFlayer(ctx, w * 0.5, h * 0.22, mfScale, mfAlpha);

      // Lightning
      spawnLightning(w, h);
      lightnings = lightnings.filter(l => l.life > 0);
      lightnings.forEach(l => {
        l.life--;
        const alpha = l.life / l.maxLife;
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = `rgba(255, 140, 140, ${alpha})`;
        ctx.lineWidth = 1.5;
        l.segs.forEach(([x1, y1, x2, y2]) => {
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        });
        // Glow branch
        if (Math.random() > 0.7 && l.life > 5) {
          const seg = l.segs[Math.floor(Math.random() * l.segs.length)];
          if (seg) {
            ctx.strokeStyle = `rgba(255, 180, 180, ${alpha * 0.5})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(seg[2], seg[3]);
            ctx.lineTo(seg[2] + (Math.random() - 0.5) * 60, seg[3] + Math.random() * 50);
            ctx.stroke();
          }
        }
        ctx.globalAlpha = 1;
      });

      // Ground fade
      const mist = ctx.createLinearGradient(0, h * 0.6, 0, h);
      mist.addColorStop(0, 'rgba(0,0,0,0)');
      mist.addColorStop(0.45, 'rgba(8,0,0,0.55)');
      mist.addColorStop(1, 'rgba(0,0,0,0.97)');
      ctx.fillStyle = mist;
      ctx.fillRect(0, 0, w, h);

      animId = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const toggleUD = () => {
    setUpsideDown(u => !u);
    const root = document.getElementById('app-root') || document.body;
    const current = root.style.transform;
    if (!current || current === 'rotate(0deg)') {
      root.style.transition = 'transform 0.8s cubic-bezier(0.65,0,0.35,1)';
      root.style.transform = 'rotate(180deg)';
      root.style.background = '#000';
    } else {
      root.style.transition = 'transform 0.8s cubic-bezier(0.65,0,0.35,1)';
      root.style.transform = 'rotate(0deg)';
    }
  };

  return (
    <>
      <canvas
        ref={skyRef}
        style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', width: '100%', height: '100%' }}
      />
      {/* Upside Down toggle */}
      <button
        onClick={toggleUD}
        style={{
          position: 'absolute', top: '20px', right: '20px', zIndex: 20,
          border: '1px solid rgba(204,0,0,0.45)', background: 'rgba(0,0,0,0.65)',
          color: upsideDown ? '#ff4444' : 'rgba(204,0,0,0.7)',
          padding: '9px 18px', fontFamily: 'var(--font-mono)',
          fontSize: '0.68rem', letterSpacing: '0.12em', cursor: 'pointer',
          textTransform: 'uppercase', backdropFilter: 'blur(8px)',
          transition: 'all 0.3s',
          boxShadow: upsideDown ? '0 0 20px rgba(204,0,0,0.4)' : 'none',
          transform: upsideDown ? 'rotate(180deg)' : 'none',
        }}
        title="Toggle Upside Down mode"
      >
        ↕ {upsideDown ? 'BACK TO REALITY' : 'UPSIDE DOWN'}
      </button>
    </>
  );
}
