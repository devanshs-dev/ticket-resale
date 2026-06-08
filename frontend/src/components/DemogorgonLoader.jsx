import { useEffect, useState } from 'react'

const FRAMES = [
`    )  (    
   (    )   
  )  /\\  (  
    /  \\   
   | oo |  
    \\  /   
     \\/    `,

`   (  )    
    )  (   
  (  /\\  ) 
    /  \\   
   | -- |  
    \\  /   
     \\/    `,

`    )  (   
   (    )  
  )  /\\  ( 
    /  \\   
   | ** |  
    \\  /   
     \\/    `,

`   (  )    
    )  (   
  (  /\\  ) 
    /  \\   
   | oo |  
    \\  /   
     \\/    `,
]

const MOUTH_FRAMES = [
  '   \\  /   \n    \\/    ',
  '   (  )   \n    --    ',
  '  (    )  \n   ----   ',
  '   \\  /   \n    \\/    ',
]

export default function DemogorgonLoader({ visible = true, label = 'SCANNING...' }) {
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    if (!visible) return
    const t = setInterval(() => setFrame(f => (f + 1) % FRAMES.length), 200)
    return () => clearInterval(t)
  }, [visible])

  if (!visible) return null

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: '16px', padding: '40px',
    }}>
      <pre style={{
        fontFamily: "'VT323', monospace",
        fontSize: '1.1rem',
        color: '#cc0000',
        textShadow: '0 0 10px rgba(204,0,0,0.6)',
        lineHeight: '1.4',
        textAlign: 'center',
        letterSpacing: '0.05em',
        animation: 'redGlow 2s ease-in-out infinite alternate',
        userSelect: 'none',
        margin: 0,
      }}>
        {`    _____    
   /     \\   
  | (o)(o)|  
  |   __  |  
   \\ (  ) /  
    |DMMG|   
${MOUTH_FRAMES[frame]}`}
      </pre>
      <div style={{
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: '0.7rem',
        color: 'rgba(204,0,0,0.5)',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        animation: 'blink 1.2s infinite',
      }}>
        {label}
      </div>
    </div>
  )
}
