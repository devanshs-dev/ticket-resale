import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import API from '../api'

function TicketDetail() {
  const { id } = useParams()
  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [qrCode, setQrCode] = useState(null)
  const [purchased, setPurchased] = useState(false)
  const [viewers, setViewers] = useState(1)
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))
  const mono = "'Share Tech Mono', monospace"
  const display = "'Bebas Neue', cursive"

  useEffect(() => {
    API.get('/tickets/' + id)
      .then(({ data }) => setTicket(data))
      .catch(() => setError('SIGNAL NOT FOUND'))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    const socket = io('https://ticket-resale-backend.onrender.com')
    socket.emit('viewingTicket', id)
    socket.on('viewerCount', (count) => setViewers(count))
    return () => { socket.emit('leaveTicket', id); socket.disconnect() }
  }, [id])

  const handleBuy = async () => {
    if (!user) { navigate('/login'); return }
    try {
      const { data } = await API.post('/orders/buy/' + id)
      setQrCode(data.qrCode)
      setPurchased(true)
    } catch (err) {
      alert(err.response?.data?.message || 'TRANSMISSION FAILED')
    }
  }

  const trustColor = (s) => s >= 80 ? '#00cc44' : s >= 60 ? '#ffaa00' : '#cc0000'
  const trustLabel = (s) => s >= 80 ? 'TRUSTED SIGNAL' : s >= 60 ? 'CAUTION' : '⚠ INFECTED SIGNAL'

  if (loading) return (
    <div style={{ background:'#000', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ width:'24px', height:'24px', border:'2px solid rgba(204,0,0,0.15)', borderTopColor:'#cc0000', borderRadius:'50%', animation:'spinnerRotate 0.7s linear infinite', margin:'0 auto 16px' }} />
        <div style={{ color:'rgba(204,0,0,0.5)', fontFamily:mono, fontSize:'0.7rem', letterSpacing:'0.2em' }}>LOCATING SIGNAL...</div>
      </div>
    </div>
  )

  if (error || !ticket) return (
    <div style={{ background:'#000', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontFamily:display, fontSize:'3rem', color:'rgba(204,0,0,0.3)', letterSpacing:'0.1em', marginBottom:'12px' }}>SIGNAL LOST</div>
        <div style={{ color:'#333', fontFamily:mono, fontSize:'0.75rem', marginBottom:'24px' }}>// {error || 'TICKET NOT FOUND'}</div>
        <Link to="/listings" style={{ color:'#cc0000', fontFamily:mono, fontSize:'0.8rem', letterSpacing:'0.1em' }}>← RETURN TO SIGNALS</Link>
      </div>
    </div>
  )

  const tc = trustColor(ticket.trustScore)

  return (
    <div style={{ background:'#000', minHeight:'100vh', padding:'80px 32px 40px', position:'relative' }}>
      <div style={{ position:'fixed', inset:0, background:'radial-gradient(ellipse at 50% 20%,rgba(20,0,0,0.8),rgba(0,0,0,1) 70%)', zIndex:0, pointerEvents:'none' }} />

      <div style={{ position:'relative', zIndex:5, maxWidth:'720px', margin:'0 auto' }}>

        <Link to="/listings" style={{ color:'rgba(204,0,0,0.5)', fontFamily:mono, fontSize:'0.75rem', letterSpacing:'0.1em', display:'inline-flex', alignItems:'center', gap:'6px', marginBottom:'32px', textDecoration:'none', transition:'color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.color='#cc0000'}
          onMouseLeave={e => e.currentTarget.style.color='rgba(204,0,0,0.5)'}
        >
          ← BACK TO SIGNALS
        </Link>

        {/* Header card */}
        <div style={{ background:'#050000', border:'1px solid rgba(204,0,0,0.2)', marginBottom:'16px', overflow:'hidden' }}>
          <div style={{ background:'linear-gradient(135deg,#1a0000,#0a0000)', padding:'32px', borderBottom:'1px solid rgba(204,0,0,0.15)', position:'relative' }}>
            <div style={{ position:'absolute', inset:0, backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.28) 2px,rgba(0,0,0,0.28) 4px)', pointerEvents:'none' }} />
            <span style={{ background:'rgba(204,0,0,0.1)', border:'1px solid rgba(204,0,0,0.3)', color:'#cc0000', padding:'3px 12px', fontFamily:mono, fontSize:'0.65rem', letterSpacing:'0.1em', textTransform:'uppercase' }}>
              {ticket.category}
            </span>
            <div style={{ fontFamily:display, fontSize:'2.5rem', letterSpacing:'0.08em', color:'#fff', marginTop:'12px', lineHeight:1.1, textShadow:'0 0 30px rgba(204,0,0,0.2)', position:'relative', zIndex:1 }}>
              {ticket.title}
            </div>
          </div>

          <div style={{ padding:'32px' }}>
            {/* Info grid */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'24px' }}>
              {[
                { label:'DATE', value: ticket.date },
                { label:'LOCATION', value: ticket.location },
                { label:'SEAT / SECTION', value: ticket.seats || 'GENERAL ADMISSION' },
                { label:'TRANSMITTER', value: ticket.seller?.name || 'ANONYMOUS' },
              ].map(item => (
                <div key={item.label} style={{ background:'#0a0000', border:'1px solid rgba(204,0,0,0.12)', padding:'16px' }}>
                  <div style={{ color:'rgba(204,0,0,0.5)', fontSize:'0.62rem', letterSpacing:'0.15em', textTransform:'uppercase', fontFamily:mono, marginBottom:'6px' }}>{item.label}</div>
                  <div style={{ color:'#ccc', fontFamily:mono, fontSize:'0.85rem' }}>{item.value}</div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div style={{ marginBottom:'24px' }}>
              <div style={{ color:'rgba(204,0,0,0.5)', fontSize:'0.62rem', letterSpacing:'0.15em', textTransform:'uppercase', fontFamily:mono, marginBottom:'10px' }}>// TRANSMISSION DETAILS</div>
              <p style={{ color:'#555', fontFamily:mono, fontSize:'0.85rem', lineHeight:1.8 }}>{ticket.description}</p>
            </div>

            {/* Trust + Price */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', background:'#0a0000', border:`1px solid ${tc}33`, padding:'20px', marginBottom:'16px' }}>
              <div>
                <div style={{ color:'rgba(204,0,0,0.5)', fontSize:'0.62rem', letterSpacing:'0.15em', fontFamily:mono, marginBottom:'8px' }}>SIGNAL STRENGTH</div>
                <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                  <span style={{ background:`${tc}15`, border:`1px solid ${tc}44`, color:tc, padding:'4px 14px', fontFamily:mono, fontWeight:700, fontSize:'1rem', letterSpacing:'0.05em' }}>
                    {ticket.trustScore}/100
                  </span>
                  <span style={{ color:tc, fontSize:'0.75rem', fontFamily:mono, letterSpacing:'0.08em' }}>{trustLabel(ticket.trustScore)}</span>
                </div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ color:'rgba(204,0,0,0.5)', fontSize:'0.62rem', letterSpacing:'0.15em', fontFamily:mono, marginBottom:'4px' }}>PRICE</div>
                <div style={{ fontFamily:display, fontSize:'2.5rem', color:'#fff', letterSpacing:'0.05em' }}>₹{ticket.price}</div>
              </div>
            </div>

            {/* Viewers */}
            <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'24px' }}>
              <span style={{ width:'7px', height:'7px', background:'#ffaa00', borderRadius:'50%', display:'inline-block', animation:'blink 1.5s infinite' }} />
              <span style={{ color:'#ffaa00', fontSize:'0.75rem', fontFamily:mono, letterSpacing:'0.08em' }}>
                {viewers} AGENT{viewers !== 1 ? 'S' : ''} MONITORING THIS SIGNAL
              </span>
            </div>

            {/* Buy / QR */}
            {purchased && qrCode ? (
              <div style={{ textAlign:'center' }}>
                <div style={{ background:'rgba(0,204,68,0.08)', border:'1px solid rgba(0,204,68,0.3)', color:'#00cc44', padding:'14px', fontFamily:mono, fontSize:'0.8rem', letterSpacing:'0.08em', marginBottom:'24px' }}>
                  ■ SIGNAL ACQUIRED — SHOW QR CODE AT ENTRY
                </div>
                <div style={{ color:'rgba(204,0,0,0.5)', fontFamily:mono, fontSize:'0.7rem', letterSpacing:'0.1em', marginBottom:'16px' }}>// YOUR ACCESS CODE</div>
                <img src={qrCode} alt="QR Code" style={{ width:'180px', height:'180px', margin:'0 auto', display:'block', border:'1px solid rgba(204,0,0,0.3)' }} />
                <button onClick={() => navigate('/dashboard')} style={{
                  width:'100%', padding:'14px', background:'#cc0000', border:'none', color:'#000',
                  fontFamily:display, fontSize:'1.1rem', letterSpacing:'0.15em', cursor:'pointer',
                  marginTop:'24px', boxShadow:'0 0 20px rgba(204,0,0,0.4)',
                }}>
                  GO TO TERMINAL →
                </button>
              </div>
            ) : (
              <button onClick={handleBuy} style={{
                width:'100%', padding:'16px', background:'#cc0000', border:'none', color:'#000',
                fontFamily:display, fontSize:'1.2rem', letterSpacing:'0.15em', cursor:'pointer',
                boxShadow:'0 0 20px rgba(204,0,0,0.4)', transition:'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background='#ff1111'; e.currentTarget.style.boxShadow='0 0 40px rgba(204,0,0,0.6)' }}
                onMouseLeave={e => { e.currentTarget.style.background='#cc0000'; e.currentTarget.style.boxShadow='0 0 20px rgba(204,0,0,0.4)' }}
              >
                CROSS INTO THE MARKETPLACE — ₹{ticket.price}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TicketDetail
