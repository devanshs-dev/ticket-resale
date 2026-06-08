import { useEffect, useRef, useState } from 'react';

/**
 * WillsWall
 * Empty-state component: Joyce's alphabet wall with flickering lights
 * that spell out a message (like Will communicating from the Upside Down).
 *
 * Props:
 *   message: string (default "NO SIGNALS")
 */
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const BULB_COLORS = {
  A: '#ff0000', B: '#ff4400', C: '#ffaa00', D: '#00cc00', E: '#0044ff',
  F: '#ff0066', G: '#ff8800', H: '#cc0000', I: '#ffcc00', J: '#00aaff',
  K: '#ff2200', L: '#44ff00', M: '#ff0044', N: '#ff6600', O: '#0066ff',
  P: '#ff00aa', Q: '#aaff00', R: '#ff3300', S: '#ff0000', T: '#ffaa00',
  U: '#00ffaa', V: '#ff6600', W: '#ff0000', X: '#aa00ff', Y: '#ffcc00', Z: '#00ccff',
};
const ROW_LEN = 13; // letters per row

export default function WillsWall({ message = 'NO SIGNALS' }) {
  const [litLetters, setLitLetters] = useState(new Set());
  const phaseRef = useRef(0); // 0 = random, 1 = spelling
  const idxRef = useRef(0);
  const timerRef = useRef(null);

  const TARGET = message.toUpperCase().replace(/[^A-Z]/g, '');

  useEffect(() => {
    const phaseSwitch = setTimeout(() => { phaseRef.current = 1; }, 3500);

    function animate() {
      if (phaseRef.current === 0) {
        // Random flickering
        const n = new Set();
        const count = Math.floor(Math.random() * 4) + 1;
        for (let i = 0; i < count; i++) {
          n.add(ALPHABET[Math.floor(Math.random() * 26)]);
        }
        setLitLetters(n);
        timerRef.current = setTimeout(animate, 60 + Math.random() * 200);
      } else {
        // Spell the message letter by letter
        const i = idxRef.current;
        const letter = TARGET[i % TARGET.length];
        setLitLetters(new Set(letter ? [letter] : []));
        idxRef.current++;
        // Pause at end of message
        const delay = i > 0 && i % TARGET.length === 0 ? 1200 : 350;
        timerRef.current = setTimeout(animate, delay);
      }
    }
    animate();

    return () => {
      clearTimeout(phaseSwitch);
      clearTimeout(timerRef.current);
    };
  }, [TARGET]);

  const rows = [];
  for (let r = 0; r < Math.ceil(26 / ROW_LEN); r++) {
    rows.push(ALPHABET.slice(r * ROW_LEN, (r + 1) * ROW_LEN).split(''));
  }

  return (
    <div style={{ padding: '60px 24px', textAlign: 'center' }}>
      {/* Wallpaper texture */}
      <div style={{
        background: 'repeating-linear-gradient(0deg, rgba(204,0,0,0.02) 0px, rgba(204,0,0,0.02) 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, rgba(204,0,0,0.02) 0px, rgba(204,0,0,0.02) 1px, transparent 1px, transparent 40px)',
        border: '1px solid rgba(204,0,0,0.1)',
        padding: '40px 32px 32px',
        position: 'relative',
        maxWidth: '680px',
        margin: '0 auto',
      }}>
        {/* Alphabet rows with light bulbs above each letter */}
        {rows.map((row, ri) => (
          <div key={ri} style={{ display: 'flex', justifyContent: 'center', gap: '0', marginBottom: '8px' }}>
            {row.map((letter) => {
              const isLit = litLetters.has(letter);
              const color = BULB_COLORS[letter] || '#cc0000';
              return (
                <div
                  key={letter}
                  style={{
                    width: '48px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  {/* Bulb */}
                  <div style={{
                    width: '12px', height: '12px', borderRadius: '50%',
                    background: isLit ? color : '#0a0000',
                    border: '1px solid',
                    borderColor: isLit ? color : '#1a0000',
                    boxShadow: isLit ? `0 0 8px ${color}, 0 0 18px ${color}, 0 0 30px ${color}` : 'none',
                    transition: isLit ? 'all 0.04s' : 'all 0.2s',
                    position: 'relative',
                    flexShrink: 0,
                  }}>
                    <div style={{
                      position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)',
                      width: '1px', height: '10px', background: '#1a0000',
                    }} />
                  </div>

                  {/* Letter */}
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.9rem',
                    letterSpacing: '0.05em',
                    color: isLit ? color : '#1a0000',
                    textShadow: isLit ? `0 0 12px ${color}, 0 0 24px ${color}` : 'none',
                    transition: isLit ? 'all 0.04s' : 'all 0.3s',
                    fontWeight: isLit ? '700' : '400',
                    userSelect: 'none',
                  }}>
                    {letter}
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {/* Hanging wire across top */}
        <div style={{ position: 'absolute', top: '20px', left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, #1a1a1a, transparent)' }} />

        {/* Message below */}
        <div style={{ marginTop: '28px', borderTop: '1px solid rgba(204,0,0,0.1)', paddingTop: '20px' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', letterSpacing: '0.15em', color: 'rgba(204,0,0,0.25)', marginBottom: '8px' }}>
            {message}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#1a1a1a', letterSpacing: '0.12em' }}>
            // The upside down is quiet right now
          </div>
        </div>
      </div>
    </div>
  );
}
