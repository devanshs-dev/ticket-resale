import { useEffect, useState } from 'react'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const BULB_COLORS = ['#ff0000','#ff4400','#ffaa00','#ff6600','#cc0000','#ff2200','#ffcc00','#00ff00','#0044ff','#ff0066']

export default function WillsWall({ message = 'NO SIGNALS' }) {
  const [litIndex, setLitIndex] = useState(-1)
  const [phase, setPhase] = useState('random') // 'random' | 'spell'
  const [spellPos, setSpellPos] = useState(0)

  const letters = ALPHABET.split('')
  const msg = message.toUpperCase().replace(/[^A-Z ]/g, '')

  // Map each letter to a bulb color
  const letterColors = {}
  letters.forEach((l, i) => {
    letterColors[l] = BULB_COLORS[i % BULB_COLORS.length]
  })

  useEffect(() => {
    let timer

    // Phase 1: random flicker for 3s
    if (phase === 'random') {
      timer = setInterval(() => {
        setLitIndex(Math.floor(Math.random() * 26))
      }, 120)
      setTimeout(() => {
        setPhase('spell')
        clearInterval(timer)
      }, 3000)
    }

    // Phase 2: spell out the message
    if (phase === 'spell') {
      let pos = 0
      function next() {
        if (pos >= msg.length) {
          pos = 0
          setTimeout(next, 800)
          return
        }
        const ch = msg[pos]
        if (ch === ' ') {
          setLitIndex(-1)
        } else {
          setLitIndex(letters.indexOf(ch))
        }
        pos++
        timer = setTimeout(next, 380)
      }
      next()
    }

    return () => { clearInterval(timer); clearTimeout(timer) }
  }, [phase, msg])

  return (
    <div style={{
      background: '#050000',
      border: '1px solid rgba(204,0,0,0.2)',
      padding: '40px 32px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Wall texture */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(204,0,0,0.03) 28px, rgba(204,0,0,0.03) 29px)',
        pointerEvents: 'none',
      }} />

      <div style={{
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: '0.65rem', letterSpacing: '0.2em',
        color: 'rgba(204,0,0,0.4)', marginBottom: '24px',
        textTransform: 'uppercase',
      }}>
        // JOYCE'S WALL — {message}
      </div>

      {/* Alphabet grid with bulbs */}
      <div style={{
        display: 'flex', flexWrap: 'wrap',
        justifyContent: 'center', gap: '6px',
        maxWidth: '520px', margin: '0 auto',
        position: 'relative', zIndex: 2,
      }}>
        {letters.map((letter, i) => {
          const isLit = litIndex === i
          const color = letterColors[letter]
          return (
            <div key={letter} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
              width: '36px',
            }}>
              {/* Bulb */}
              <div style={{
                width: '12px', height: '12px', borderRadius: '50%',
                background: isLit ? color : '#1a0000',
                border: `1px solid ${isLit ? color : '#2a0000'}`,
                boxShadow: isLit ? `0 0 8px ${color}, 0 0 16px ${color}, 0 0 24px ${color}` : 'none',
                transition: 'all 0.06s ease',
                flexShrink: 0,
              }} />
              {/* Letter */}
              <div style={{
                fontFamily: "'Bebas Neue', cursive",
                fontSize: '1.1rem', letterSpacing: '0.05em',
                color: isLit ? color : 'rgba(204,0,0,0.2)',
                textShadow: isLit ? `0 0 10px ${color}, 0 0 20px ${color}` : 'none',
                transition: 'all 0.06s ease',
              }}>
                {letter}
              </div>
            </div>
          )
        })}
      </div>

      <div style={{
        marginTop: '24px',
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: '0.7rem', color: '#222',
        letterSpacing: '0.1em',
      }}>
        // THE UPSIDE DOWN IS QUIET
      </div>
    </div>
  )
}
