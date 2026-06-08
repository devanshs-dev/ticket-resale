import { useEffect, useState } from 'react'

const TOAST_DURATION = 4000

export default function SignalToast({ socket }) {
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = 'new') => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev.slice(-3), { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, TOAST_DURATION)
  }

  useEffect(() => {
    if (!socket) return

    socket.on('ticket:new', (ticket) => {
      addToast(`■ NEW SIGNAL DETECTED — ${(ticket?.title || 'UNKNOWN').toUpperCase()}`, 'new')
    })

    socket.on('ticket:flagged', (ticket) => {
      addToast(`⚠ INFECTED SIGNAL — ${(ticket?.title || 'UNKNOWN').toUpperCase()}`, 'infected')
    })

    socket.on('ticket:sold', (ticket) => {
      addToast(`◈ GATE IS OPEN — SIGNAL CROSSED`, 'sold')
    })

    socket.on('connect', () => {
      addToast('● CONNECTED TO HAWKINS NETWORK', 'system')
    })

    return () => {
      socket.off('ticket:new')
      socket.off('ticket:flagged')
      socket.off('ticket:sold')
      socket.off('connect')
    }
  }, [socket])

  const colors = {
    new:      { border: 'rgba(204,0,0,0.6)',  text: '#cc0000',  left: '#cc0000' },
    infected: { border: 'rgba(255,100,0,0.6)', text: '#ff6400', left: '#ff6400' },
    sold:     { border: 'rgba(0,204,68,0.5)',  text: '#00cc44', left: '#00cc44' },
    system:   { border: 'rgba(204,0,0,0.3)',   text: '#555',    left: 'rgba(204,0,0,0.4)' },
  }

  return (
    <div style={{
      position: 'fixed', bottom: '32px', right: '32px',
      zIndex: 500, display: 'flex', flexDirection: 'column', gap: '10px',
      pointerEvents: 'none',
    }}>
      {toasts.map(toast => {
        const c = colors[toast.type] || colors.new
        return (
          <div key={toast.id} style={{
            background: '#050000',
            border: `1px solid ${c.border}`,
            borderLeft: `3px solid ${c.left}`,
            padding: '12px 18px',
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '0.75rem',
            color: c.text,
            letterSpacing: '0.06em',
            boxShadow: `0 0 20px rgba(204,0,0,0.15)`,
            maxWidth: '320px',
            animation: 'slideUp 0.3s cubic-bezier(0.16,1,0.3,1)',
            pointerEvents: 'auto',
          }}>
            {toast.message}
          </div>
        )
      })}
    </div>
  )
}
