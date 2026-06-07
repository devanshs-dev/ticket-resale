import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import TicketCard from '../components/TicketCard'
import API from '../api'

const categories = [
  { label: '🎵 Concerts', value: 'Concert' },
  { label: '🚂 Travel', value: 'Travel' },
  { label: '🏏 Sports', value: 'Sports' },
  { label: '🎬 Movies', value: 'Movies' },
  { label: '🎭 Theatre', value: 'Theatre' },
  { label: '📺 Subscriptions', value: 'Subscription' },
  { label: '🍽️ Reservations', value: 'Reservation' },
]

function Home() {
  const [tickets, setTickets] = useState([])

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { data } = await API.get('/tickets')
        setTickets(data.slice(0, 4))
      } catch (error) {
        console.error(error)
      }
    }
    fetchTickets()
  }, [])

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #1a0533 0%, #0f0f1a 50%, #0a1628 100%)',
        borderBottom: '1px solid var(--color-border)',
        padding: '80px 32px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* glow orbs */}
        <div style={{
          position: 'absolute', top: '-80px', left: '50%', transform: 'translateX(-50%)',
          width: '600px', height: '300px',
          background: 'radial-gradient(ellipse, rgba(124,58,237,0.3) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <span style={{
            background: 'rgba(124,58,237,0.15)',
            border: '1px solid rgba(124,58,237,0.4)',
            color: '#a855f7',
            padding: '4px 16px',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            display: 'inline-block',
            marginBottom: '20px',
          }}>
            🔒 Verified & Secure Marketplace
          </span>

          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 800,
            color: '#fff',
            marginBottom: '16px',
            lineHeight: 1.1,
          }}>
            Buy and Sell Tickets <br />
            <span style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Safely
            </span>
          </h1>

          <p style={{ color: 'var(--color-muted)', fontSize: '1.1rem', marginBottom: '36px' }}>
            Concerts, travel, sports, movies and more — all in one place
          </p>

          <div style={{ maxWidth: '560px', margin: '0 auto', display: 'flex', gap: '12px' }}>
            <input
              type="text"
              placeholder="Search events, routes, teams..."
              style={{
                flex: 1,
                padding: '14px 20px',
                borderRadius: '12px',
                border: '1px solid var(--color-border)',
                background: 'rgba(255,255,255,0.06)',
                color: 'var(--color-text)',
                fontSize: '1rem',
                outline: 'none',
              }}
            />
            <Link to="/listings" className="btn-primary" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', whiteSpace: 'nowrap' }}>
              Search
            </Link>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div style={{ maxWidth: '1024px', margin: '0 auto', padding: '48px 32px 0' }}>
        <h2 style={{ color: 'var(--color-text)', fontWeight: 700, fontSize: '1.3rem', marginBottom: '20px' }}>
          Browse by Category
        </h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <Link
              key={cat.value}
              to={`/listings?category=${cat.value}`}
              style={{
                padding: '10px 20px',
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
                color: 'var(--color-text)',
                fontWeight: 500,
                fontSize: '0.9rem',
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#7c3aed'
                e.currentTarget.style.color = '#a855f7'
                e.currentTarget.style.background = 'rgba(124,58,237,0.08)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--color-border)'
                e.currentTarget.style.color = 'var(--color-text)'
                e.currentTarget.style.background = 'var(--color-surface)'
              }}
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Tickets */}
      {tickets.length > 0 && (
        <div style={{ maxWidth: '1024px', margin: '0 auto', padding: '48px 32px' }}>
          <h2 style={{ color: 'var(--color-text)', fontWeight: 700, fontSize: '1.3rem', marginBottom: '24px' }}>
            Featured Tickets
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
            {tickets.map((ticket) => (
              <TicketCard key={ticket._id} ticket={{ ...ticket, id: ticket._id }} />
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div style={{
        borderTop: '1px solid var(--color-border)',
        background: 'linear-gradient(135deg, #0f0a1e, #0a0a0f)',
        padding: '80px 32px',
        textAlign: 'center',
      }}>
        <h2 style={{ color: '#fff', fontWeight: 800, fontSize: '2rem', marginBottom: '12px' }}>
          Have something you can't use?
        </h2>
        <p style={{ color: 'var(--color-muted)', fontSize: '1.1rem', marginBottom: '32px' }}>
          Tickets, subscriptions, reservations — list it in minutes
        </p>
        <Link to="/sell" className="btn-primary" style={{ textDecoration: 'none', fontSize: '1rem' }}>
          List Now →
        </Link>
      </div>

    </div>
  )
}

export default Home