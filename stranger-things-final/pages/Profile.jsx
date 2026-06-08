import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function Profile() {
  const user = JSON.parse(localStorage.getItem('user'))
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  const mono = "'Share Tech Mono', monospace"
  const display = "'Bebas Neue', cursive"

  if (!user) { navigate('/login'); return null }

  const handleCopy = () => {
    navigator.clipboard.writeText(user.email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const fields = [
    { label:'AGENT NAME', value: user.name },
    { label: copied ? 'EMAIL — COPIED ✓' : 'EMAIL // CLICK TO COPY', value: user.email, onClick: handleCopy },
    { label:'CLEARANCE LEVEL', value: (user.role || 'user').toUpperCase() },
    { label:'AGENT ID', value: '...' + (user._id || '').slice(-8) },
  ]

  return (
    <div style={{ background:'#000', minHeight:'100vh', padding:'80px 32px 40px', position:'relative' }}>
      <div style={{ position:'fixed', inset:0, background:'radial-gradient(ellipse at 50% 20%,rgba(20,0,0,0.8),rgba(0,0,0,1) 70%)', zIndex:0, pointerEvents:'none' }} />

      <div style={{ position:'relative', zIndex:5, maxWidth:'600px', margin:'0 auto' }}>

        <div style={{ marginBottom:'32px' }}>
          <div style={{ fontFamily:display, fontSize:'2.5rem', letterSpacing:'0.15em', color:'#cc0000', textShadow:'0 0 20px rgba(204,0,0,0.5)', marginBottom:'4px' }}>AGENT PROFILE</div>
          <div style={{ color:'#333', fontFamily:mono, fontSize:'0.7rem', letterSpacing:'0.15em' }}>// HAWKINS NETWORK — CLASSIFIED DOSSIER</div>
        </div>

        {/* Avatar card */}
        <div style={{ background:'#050000', border:'1px solid rgba(204,0,0,0.2)', padding:'32px', marginBottom:'16px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'20px', marginBottom:'32px' }}>
            <div style={{
              width:'72px', height:'72px', borderRadius:'50%',
              background:'#1a0000', border:'2px solid #cc0000',
              display:'flex', alignItems:'center', justifyContent:'center',
              color:'#cc0000', fontSize:'1.8rem', fontFamily:display,
              boxShadow:'0 0 20px rgba(204,0,0,0.4)',
            }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontFamily:display, fontSize:'1.8rem', letterSpacing:'0.1em', color:'#fff', marginBottom:'4px' }}>{user.name.toUpperCase()}</div>
              <div style={{ color:'#444', fontFamily:mono, fontSize:'0.75rem', marginBottom:'8px' }}>{user.email}</div>
              <span style={{ background:'rgba(204,0,0,0.1)', border:'1px solid rgba(204,0,0,0.3)', color:'#cc0000', padding:'2px 12px', fontFamily:mono, fontSize:'0.65rem', letterSpacing:'0.1em', textTransform:'uppercase' }}>
                {user.role === 'admin' ? '◈ ADMIN — LEVEL 5' : '● AGENT — LEVEL 1'}
              </span>
            </div>
          </div>

          {/* Info grid */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
            {fields.map(f => (
              <div key={f.label} onClick={f.onClick} style={{
                background:'#0a0000', border:'1px solid rgba(204,0,0,0.12)', padding:'16px',
                cursor: f.onClick ? 'pointer' : 'default', transition:'border-color 0.2s',
              }}
                onMouseEnter={e => { if (f.onClick) e.currentTarget.style.borderColor='rgba(204,0,0,0.4)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(204,0,0,0.12)' }}
              >
                <div style={{ color:'rgba(204,0,0,0.5)', fontSize:'0.62rem', letterSpacing:'0.15em', textTransform:'uppercase', fontFamily:mono, marginBottom:'6px' }}>{f.label}</div>
                <div style={{ color:'#ccc', fontFamily:mono, fontSize:'0.85rem' }}>{f.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
          <button onClick={() => navigate('/dashboard')} style={{
            padding:'14px', background:'#cc0000', border:'none', color:'#000',
            fontFamily:display, fontSize:'1rem', letterSpacing:'0.15em', cursor:'pointer',
            boxShadow:'0 0 20px rgba(204,0,0,0.3)', transition:'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background='#ff1111'; e.currentTarget.style.boxShadow='0 0 30px rgba(204,0,0,0.5)' }}
            onMouseLeave={e => { e.currentTarget.style.background='#cc0000'; e.currentTarget.style.boxShadow='0 0 20px rgba(204,0,0,0.3)' }}
          >
            AGENT TERMINAL →
          </button>
          <button onClick={() => navigate('/sell')} style={{
            padding:'14px', background:'transparent', border:'1px solid rgba(204,0,0,0.4)',
            color:'#cc0000', fontFamily:mono, fontSize:'0.8rem', letterSpacing:'0.1em',
            cursor:'pointer', transition:'all 0.2s', textTransform:'uppercase',
          }}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(204,0,0,0.1)'; e.currentTarget.style.borderColor='#cc0000' }}
            onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='rgba(204,0,0,0.4)' }}
          >
            TRANSMIT SIGNAL →
          </button>
        </div>

      </div>
    </div>
  )
}

export default Profile
