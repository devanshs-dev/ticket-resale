import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import API from '../api'

function getTrustStyle(score) {
  if (score >= 90) return { color: '#34d399', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)', label: 'Highly Trusted' }
  if (score >= 75) return { color: '#fbbf24', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', label: 'Trusted' }
  return { color: '#f87171', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', label: 'Low Trust' }
}

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

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const { data } = await API.get('/tickets/' + id)
        setTicket(data)
      } catch (err) {
        setError('Ticket not found')
      }
      setLoading(false)
    }
    fetchTicket()
  }, [id])

  useEffect(() => {
    const socket = io('http://localhost:8000')
    socket.emit('viewingTicket', id)
    socket.on('viewerCount', (count) => setViewers(count))
    return () => {
      socket.emit('leaveTicket', id)
      socket.disconnect()
    }
  }, [id])

  const handleBuy = async () => {
    if (!user) { navigate('/login'); return }
    try {
      const { data } = await API.post('/orders/buy/' + id)
      setQrCode(data.qrCode)
      setPurchased(true)
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong')
    }
  }

  const centerStyle = { minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }

  if (loading) return <div style={centerStyle}><p style={{ color: 'var(--color-muted)', fontSize: '1.1rem' }}>Loading...</p></div>
  if (error || !ticket) return (
    <div style={centerStyle}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text)', fontSize: '1.3rem', fontWeight: 700, marginBottom: '12px' }}>Ticket not found</p>
        <Link to="/listings" style={{ color: '#a855f7', textDecoration: 'none' }}>← Back to listings</Link>
      </div>
    </div>
  )

  const trust = getTrustStyle(ticket.trustScore)

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh', padding: '32px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>

        <Link to="/listings" style={{ color: '#a855f7', textDecoration: 'none', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '24px' }}>
          ← Back to listings
        </Link>

        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '20px', overflow: 'hidden' }}>

          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #1a0533, #0f0f1a)',
            padding: '32px',
            borderBottom: '1px solid var(--color-border)',
          }}>
            <span style={{
              background: 'rgba(124,58,237,0.15)',
              border: '1px solid rgba(124,58,237,0.3)',
              color: '#a855f7',
              padding: '3px 12px',
              borderRadius: '999px',
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>
              {ticket.category}
            </span>
            <h1 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 800, marginTop: '12px', lineHeight: 1.2 }}>
              {ticket.title}
            </h1>
          </div>

          <div style={{ padding: '32px' }}>
            {/* Info grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
              {[
                { label: 'Date', value: ticket.date },
                { label: 'Location', value: ticket.location },
                { label: 'Seat', value: ticket.seats || 'General Admission' },
                { label: 'Seller', value: ticket.seller?.name || 'Anonymous' },
              ].map((item) => (
                <div key={item.label} style={{
                  background: 'var(--color-surface2)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '12px',
                  padding: '16px',
                }}>
                  <p style={{ color: 'var(--color-muted)', fontSize: '0.75rem', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.label}</p>
                  <p style={{ color: 'var(--color-text)', fontWeight: 600, fontSize: '0.95rem' }}>{item.value}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div style={{ marginBottom: '24px' }}>
              <p style={{ color: 'var(--color-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Description</p>
              <p style={{ color: 'var(--color-text)', lineHeight: 1.7, fontSize: '0.95rem' }}>{ticket.description}</p>
            </div>

            {/* Trust + Price */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: 'var(--color-surface2)',
              border: '1px solid var(--color-border)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '16px',
            }}>
              <div>
                <p style={{ color: 'var(--color-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Trust Score</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{
                    background: trust.bg,
                    border: `1px solid ${trust.border}`,
                    color: trust.color,
                    padding: '4px 14px',
                    borderRadius: '999px',
                    fontWeight: 700,
                    fontSize: '1rem',
                  }}>
                    {ticket.trustScore}/100
                  </span>
                  <span style={{ color: trust.color, fontSize: '0.8rem', fontWeight: 600 }}>{trust.label}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ color: 'var(--color-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Price</p>
                <p style={{ color: '#fff', fontWeight: 800, fontSize: '2rem' }}>₹{ticket.price}</p>
              </div>
            </div>

            {/* Viewers */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
              <span style={{ width: '8px', height: '8px', background: '#f59e0b', borderRadius: '50%', display: 'inline-block', animation: 'pulse 2s infinite' }} />
              <span style={{ color: '#f59e0b', fontSize: '0.85rem', fontWeight: 500 }}>
                {viewers} {viewers === 1 ? 'person' : 'people'} viewing this ticket
              </span>
            </div>

            {/* Buy / QR */}
            {purchased && qrCode ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  background: 'rgba(16,185,129,0.1)',
                  border: '1px solid rgba(16,185,129,0.3)',
                  color: '#34d399',
                  padding: '14px',
                  borderRadius: '12px',
                  marginBottom: '24px',
                  fontWeight: 600,
                }}>
                  ✅ Ticket purchased successfully!
                </div>
                <p style={{ color: 'var(--color-muted)', marginBottom: '16px', fontSize: '0.9rem' }}>Your QR Code — show this at entry</p>
                <img src={qrCode} alt="QR Code" style={{ width: '180px', height: '180px', margin: '0 auto', display: 'block', borderRadius: '12px' }} />
                <button
                  onClick={() => navigate('/dashboard')}
                  className="btn-primary"
                  style={{ width: '100%', marginTop: '24px', fontSize: '1rem', padding: '14px' }}
                >
                  Go to Dashboard
                </button>
              </div>
            ) : (
              <button
                onClick={handleBuy}
                className="btn-primary"
                style={{ width: '100%', fontSize: '1.1rem', padding: '16px' }}
              >
                Buy Now — ₹{ticket.price}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TicketDetail
