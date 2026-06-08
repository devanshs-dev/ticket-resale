import { useEffect, useRef } from 'react';

/**
 * VineEnergy
 * Full-page canvas overlay that draws red Mind Flayer tendrils
 * flowing toward the mouse cursor — simulating energy/life being
 * "sucked" through the Upside Down vines.
 *
 * Props:
 *   intensity: 0-1 (default 1)  — controls particle density
 *   active: bool (default true) — can be toggled off
 */
export default function VineEnergy({ intensity = 1, active = true }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -999, y: -999 });
  const activeRef = useRef(active);

  useEffect(() => { activeRef.current = active; }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let particles = [];

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const onTouch = (e) => {
      const t = e.touches[0];
      if (t) mouseRef.current = { x: t.clientX, y: t.clientY };
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onTouch, { passive: true });

    function spawnParticle() {
      if (!activeRef.current) return;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      if (mx < 0) return;

      const count = Math.ceil(intensity * 3);
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = 100 + Math.random() * 220;
        // Each particle is a vine "tendril" moving toward mouse
        particles.push({
          x: mx + Math.cos(angle) * dist,
          y: my + Math.sin(angle) * dist,
          tx: mx,
          ty: my,
          life: 35 + Math.random() * 35,
          maxLife: 70,
          segs: [],          // trail segments
          speed: 1.8 + Math.random() * 1.8,
          thickness: 0.4 + Math.random() * 1.2,
          wobble: (Math.random() - 0.5) * 1.5,
          phase: Math.random() * Math.PI * 2,
          // Red channel varies slightly for organic look
          r: 130 + Math.floor(Math.random() * 80),
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn new vines
      if (Math.random() > 0.45) spawnParticle();

      // Kill dead
      particles = particles.filter(p => p.life > 0);

      // Max particles cap
      if (particles.length > 260) particles.splice(0, particles.length - 260);

      particles.forEach(p => {
        p.life--;
        p.phase += 0.08;

        // Move toward target with wobble
        const dx = p.tx - p.x;
        const dy = p.ty - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 4) {
          const nx = dx / dist;
          const ny = dy / dist;
          // Perpendicular wobble
          p.x += nx * p.speed + ny * Math.sin(p.phase) * p.wobble;
          p.y += ny * p.speed - nx * Math.sin(p.phase) * p.wobble;
        }

        // Trail
        p.segs.push({ x: p.x, y: p.y });
        if (p.segs.length > 14) p.segs.shift();

        if (p.segs.length < 2) return;

        const alpha = (p.life / p.maxLife);
        ctx.beginPath();
        ctx.moveTo(p.segs[0].x, p.segs[0].y);
        for (let i = 1; i < p.segs.length; i++) {
          // Smooth with midpoints
          const mx = (p.segs[i - 1].x + p.segs[i].x) / 2;
          const my = (p.segs[i - 1].y + p.segs[i].y) / 2;
          ctx.quadraticCurveTo(p.segs[i - 1].x, p.segs[i - 1].y, mx, my);
        }
        ctx.strokeStyle = `rgba(${p.r}, 0, 0, ${(alpha * 0.75).toFixed(3)})`;
        ctx.lineWidth = p.thickness * alpha;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        // Glow tip
        if (p.segs.length > 3) {
          const tip = p.segs[p.segs.length - 1];
          ctx.beginPath();
          ctx.arc(tip.x, tip.y, p.thickness * 1.4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.r}, 0, 0, ${(alpha * 0.55).toFixed(3)})`;
          ctx.fill();
        }
      });

      animId = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onTouch);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 3,
        pointerEvents: 'none',
        width: '100%',
        height: '100%',
      }}
    />
  );
}
