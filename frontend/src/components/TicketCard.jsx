import { Link } from 'react-router-dom'

const categoryColors = {
  Concert: { bg: 'rgba(124,58,237,0.15)', border: 'rgba(124,58,237,0.3)', color: '#a855f7' },
  Travel:  { bg: 'rgba(6,182,212,0.15)',  border: 'rgba(6,182,212,0.3)',  color: '#22d3ee' },
  Sports:  { bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)', color: '#34d399' },
  Movies:  { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)', color: '#fbbf24' },
  Theatre: { bg: 'rgba(236,72,153,0.15)', border: 'rgba(236,72,153,0.3)', color: '#f472b6' },
  Subscription: { bg: 'rgba(99,102,241,0.15)', border: 'rgba(99,102,241,0.3)', color: '#818cf8' },
  Reservation:  { bg: 'rgba(239,68,68,0.15)',  border: 'rgba(239,68,68,0.3)',  color: '#f87171' },
}

function TicketCard({ ticket }) {
  const clr = categoryColors[ticket.category] || categoryColors.Concert

  return (
    <div className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Top accent bar */}
      <div style={{
        height: '4px',
        background: `linear-gradient(90deg, ${clr.color}, transparent)`,
      }} />

      <div style={{ padding: '20px' }}>
        <span style={{
          background: clr.bg,
          border: `1px solid ${clr.border}`,
          color: clr.color,
          padding: '3px 10px',
          borderRadius: '999px',
          fontSize: '0.65rem',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}>
          {ticket.category}
        </span>

        <h3 style={{
          color: 'var(--color-text)',
          fontWeight: 700,
          fontSize: '1rem',
          marginTop: '10px',
          marginBottom: '12px',
          lineHeight: 1.3,
          minHeight: '2.6rem',
        }}>
          {ticket.title}
        </h3>

        <div style={{ color: 'var(--color-muted)', fontSize: '0.8rem', marginBottom: '4px', display: 'flex', gap: '6px' }}>
          <span>📅</span><span>{ticket.date}</span>
        </div>
        <div style={{ color: 'var(--color-muted)', fontSize: '0.8rem', marginBottom: '16px', display: 'flex', gap: '6px' }}>
          <span>📍</span><span>{ticket.location}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-text)' }}>
              ₹{ticket.price}
            </span>
            <span style={{ color: 'var(--color-muted)', fontSize: '0.75rem', marginLeft: '4px' }}>/ticket</span>
          </div>
          <Link
            to={`/ticket/${ticket.id}`}
            style={{
              background: clr.bg,
              border: `1px solid ${clr.border}`,
              color: clr.color,
              padding: '7px 16px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.85rem',
              transition: 'all 0.2s',
            }}
          >
            View →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default TicketCard
