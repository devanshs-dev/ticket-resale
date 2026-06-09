import { useEffect, useState } from 'react'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const BULB_COLORS = [
  '#ff0000','#ff4400','#ffaa00','#ff6600','#cc0000',
  '#ff2200','#ffcc00','#00ff00','#0044ff','#ff0066',
  '#ff0000','#ffaa00','#ff4400','#00ff00','#ff6600',
  '#0044ff','#ff2200','#ffcc00','#ff0066','#cc0000',
  '#ff0000','#ff4400','#ffaa00','#00ff00','#ff6600','#0044ff'
]

export default function WillsWall({ message = 'BUY SELL TICKETS' }) {
  const [litIndex, setLitIndex] = useState(-1)
  const [phase, setPhase] = useState('random')
  const letters = ALPHABET.split('')
  const msg = message.toUpperCase().replace(/[^A-Z ]/g, '')

  useEffect(() => {
    let timer
    if (phase === 'random') {
      timer = setInterval(() => {
        setLitIndex(Math.floor(Math.random() * 26))
      }, 300)
      setTimeout(() => {
        setPhase('spell')
        clearInterval(timer)
      }, 4000)
    }
    if (phase === 'spell') {
      let pos = 0
      function next() {
        if (pos >= msg.length) {
          pos = 0
          timer = setTimeout(next, 1500)
          return
        }
        const ch = msg[pos]
        setLitIndex(ch === ' ' ? -1 : letters.indexOf(ch))
        pos++
        timer = setTimeout(next, 600)
      }
      next()
    }
    return () => { clearInterval(timer); clearTimeout(timer) }
  }, [phase, msg])

  return (
    <div style={{
      background: 'linear-gradient(180deg, #0a0000 0%, #050000 100%)',
      border: '1px solid rgba(204,0,0,0.15)',
      padding: '48px 24px 36px',
      position: 'relative',
      overflow: 'hidden',
      margin: '0 40px',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(80,20,0,0.06) 40px, rgba(80,20,0,0.06) 41px), repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(80,20,0,0.04) 60px, rgba(80,20,0,0.04) 61px)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: '68px', left: '20px', right: '20px', height: '2px',
        background: 'linear-gradient(90deg, transparent, #2a1a00 5%, #3a2a10 50%, #2a1a00 95%, transparent)',
        zIndex: 1,
      }} />
      <div style={{ fontFamily:"'Share Tech Mono', monospace", fontSize:'0.6rem', letterSpacing:'0.25em', color:'rgba(204,0,0,0.35)', marginBottom:'32px', textTransform:'uppercase', textAlign:'center', position:'relative', zIndex:2 }}>
        // JOYCE'S WALL
      </div>
      <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'center', gap:'2px', maxWidth:'780px', margin:'0 auto', position:'relative', zIndex:2 }}>
        {letters.map((letter, i) => {
          const isLit = litIndex === i
          const color = BULB_COLORS[i]
          return (
            <div key={letter} style={{ display:'flex', flexDirection:'column', alignItems:'center', width:'44px', padding:'0 2px' }}>
              <div style={{ width:'1px', height:'12px', background: isLit ? `${color}88` : '#2a1a0033', marginBottom:'2px' }} />
              <div style={{
                width:'14px', height:'14px', borderRadius:'50%',
                background: isLit ? color : '#110500',
                border: `1px solid ${isLit ? color : '#2a0a00'}`,
                boxShadow: isLit ? `0 0 6px ${color}, 0 0 14px ${color}, 0 0 28px ${color}, 0 0 50px ${color}44` : 'none',
                transition:'all 0.08s ease', flexShrink:0, marginBottom:'10px',
              }} />
              <div style={{
                fontFamily:"'Bebas Neue', cursive", fontSize:'1.4rem', letterSpacing:'0.05em',
                color: isLit ? color : 'rgba(180,60,0,0.25)',
                textShadow: isLit ? `0 0 8px ${color}, 0 0 20px ${color}, 0 0 40px ${color}` : 'none',
                transition:'all 0.08s ease', lineHeight:1,
                transform: `rotate(${(i % 3 === 0 ? -1 : i % 3 === 1 ? 0.5 : -0.5)}deg)`,
              }}>{letter}</div>
            </div>
          )
        })}
      </div>
      <div style={{ marginTop:'28px', textAlign:'center', fontFamily:"'Share Tech Mono', monospace", fontSize:'0.65rem', color:'#1a0800', letterSpacing:'0.15em', textTransform:'uppercase', position:'relative', zIndex:2 }}>
        // SIGNALS FROM THE OTHER SIDE
      </div>
    </div>
  )
}
