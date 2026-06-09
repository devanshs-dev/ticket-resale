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
      setTimeout(() => { setPhase('spell'); clearInterval(timer) }, 4000)
    }
    if (phase === 'spell') {
      let pos = 0
      function next() {
        if (pos >= msg.length) { pos = 0; timer = setTimeout(next, 1500); return }
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
      background: '#080200',
      border: '1px solid rgba(204,0,0,0.2)',
      padding: '32px 16px 28px',
      position: 'relative',
      overflow: 'hidden',
      margin: '0',
    }}>
      {/* wallpaper lines */}
      <div style={{ position:'absolute',inset:0,backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 40px,rgba(80,20,0,0.08) 40px,rgba(80,20,0,0.08) 41px)',pointerEvents:'none' }} />

      <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'0.6rem',letterSpacing:'0.25em',color:'rgba(204,0,0,0.4)',marginBottom:'24px',textTransform:'uppercase',textAlign:'center',position:'relative',zIndex:2 }}>
        // JOYCE'S WALL
      </div>

      {/* wire */}
      <div style={{ position:'relative',zIndex:2,height:'2px',background:'linear-gradient(90deg,transparent,#4a3010 5%,#5a4020 50%,#4a3010 95%,transparent)',marginBottom:'0',marginLeft:'8px',marginRight:'8px' }} />

      {/* letters + bulbs */}
      <div style={{ display:'flex',justifyContent:'space-between',overflowX:'auto',position:'relative',zIndex:2,padding:'0 4px',width:'100%' }}>
        {letters.map((letter, i) => {
          const isLit = litIndex === i
          const color = BULB_COLORS[i]
          return (
            <div key={letter} style={{ display:'flex',flexDirection:'column',alignItems:'center',flex:'1',minWidth:'0',flexShrink:1 }}>
              {/* wire drop */}
              <div style={{ width:'2px',height:'10px',background: isLit ? color : '#4a3010' }} />
              {/* bulb cap */}
              <div style={{ width:'8px',height:'5px',background: isLit ? color : '#5a3010',borderRadius:'2px 2px 0 0' }} />
              {/* bulb body */}
              <div style={{
                width:'18px',height:'18px',borderRadius:'50%',
               background: isLit ? color : '#6b2a08',
              border:`2px solid ${isLit ? color : '#aa4a15'}`,
                boxShadow: isLit ? `0 0 8px ${color},0 0 20px ${color},0 0 40px ${color}` : 'none',
                transition:'all 0.08s',
                marginBottom:'8px',
              }} />
              {/* letter */}
              <div style={{
                fontFamily:"'Bebas Neue',cursive",
                fontSize:'1rem',
                color: isLit ? color : 'rgba(160,50,0,0.3)',
                textShadow: isLit ? `0 0 10px ${color},0 0 25px ${color}` : 'none',
                transition:'all 0.08s',
                lineHeight:1,
                transform:`rotate(${i%3===0?-1:i%3===1?0.5:-0.5}deg)`,
              }}>{letter}</div>
            </div>
          )
        })}
      </div>

      <div style={{ marginTop:'20px',textAlign:'center',fontFamily:"'Share Tech Mono',monospace",fontSize:'0.62rem',color:'#2a1000',letterSpacing:'0.15em',textTransform:'uppercase',position:'relative',zIndex:2 }}>
        // SIGNALS FROM THE OTHER SIDE
      </div>
    </div>
  )
}
