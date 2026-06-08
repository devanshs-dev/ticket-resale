import { useEffect, useState } from 'react';

/**
 * DemogorgonLoader
 * Full-page loading screen with animated ASCII Demogorgon / Mind Flayer.
 * Shows while data is loading, fades out when done.
 *
 * Props:
 *   message: string — what to show below
 *   visible: bool   — control visibility
 */

const FRAMES = [
`
    ,     ,
   (\\____/)
    (_oo_)
      (O)
    __||__    \\)
 []/______\\[] /
 / \\______/ \\/
/    /__\\
(\\   /__)
`,
`
     ,   ,
    (\\__/)
     (0 0)
      (O)
    __||__    \\)
 []/______\\[] /
 / \\______/ \\/
/    /__\\
(\\   /__)
`,
`
      , ,
     (\\/)
    (o . o)
      (O)
    __||__    \\)
 []/______\\[] /
 / \\______/ \\/
/    /__\\
(\\   /__)
`,
`
   ,     ,
   (\\____/)
    (-  -)
      (O)
    __||__    \\)
 []/______\\[] /
 / \\______/ \\/
/    /__\\
(\\   /__)
`,
];

const MESSAGES = [
  'SCANNING THE UPSIDE DOWN...',
  'CONTACTING HAWKINS LAB...',
  'DECODING SIGNAL...',
  'ANALYZING TRUST SCORE...',
  'CROSS-REFERENCING AGENTS...',
  'GATE IS OPENING...',
];

export default function DemogorgonLoader({ message, visible = true }) {
  const [frame, setFrame] = useState(0);
  const [msgIdx, setMsgIdx] = useState(0);
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (!visible) return;
    const f = setInterval(() => setFrame(p => (p + 1) % FRAMES.length), 280);
    const m = setInterval(() => setMsgIdx(p => (p + 1) % MESSAGES.length), 2200);
    const d = setInterval(() => setDots(p => p.length >= 3 ? '' : p + '.'), 400);
    return () => { clearInterval(f); clearInterval(m); clearInterval(d); };
  }, [visible]);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)',
      backdropFilter: 'blur(6px)', zIndex: 200,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      animation: 'fadeIn 0.3s ease',
    }}>
      {/* Scanlines */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.04,
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(204,0,0,0.8) 2px, rgba(204,0,0,0.8) 4px)',
        pointerEvents: 'none',
      }} />

      {/* ASCII art */}
      <pre style={{
        fontFamily: 'var(--font-retro)',
        fontSize: '1.2rem',
        color: 'var(--blood)',
        textShadow: '0 0 10px rgba(204,0,0,0.6), 0 0 20px rgba(204,0,0,0.3)',
        lineHeight: 1.4,
        marginBottom: '32px',
        userSelect: 'none',
        letterSpacing: '0.05em',
      }}>
        {FRAMES[frame]}
      </pre>

      {/* Message */}
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.85rem',
        color: 'rgba(204,0,0,0.7)', letterSpacing: '0.15em',
        textTransform: 'uppercase', marginBottom: '8px',
      }}>
        {message || MESSAGES[msgIdx]}{dots}
      </div>

      {/* Signal bars (animated) */}
      <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', marginTop: '16px' }}>
        {[1,2,3,4,5].map(i => (
          <div key={i} style={{
            width: '4px',
            height: `${i * 6}px`,
            background: 'var(--blood)',
            opacity: 0.3 + i * 0.14,
            animation: `barPulse ${0.5 + i * 0.12}s ease-in-out infinite alternate`,
          }} />
        ))}
      </div>

      <style>{`
        @keyframes barPulse {
          from { opacity: 0.15; transform: scaleY(0.6); }
          to   { opacity: 0.8;  transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}
