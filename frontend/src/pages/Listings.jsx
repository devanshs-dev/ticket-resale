import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import TicketCard from '../components/TicketCard'
import API from '../api'

const categories = ['All', 'Concert', 'Travel', 'Sports', 'Movies', 'Theatre', 'Subscription', 'Reservation']

function Listings() {
  const [tickets, setTickets] = useState([])
  const [selected, setSelected] = useState('All')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const socket = io('https://ticket-resale-backend.onrender.com')
    socket.on('ticketSold', ({ ticketId }) => {
      setTickets((prev) => prev.filter((t) => t._id.toString() !== ticketId.toString()))
    })
    return () => socket.disconnect()
  }, [])

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true)
      try {
        const { data } = await API.get('/tickets', { params: { category: selected, search } })
        setTickets(data)
      } catch (error) {
        console.error(error)
      }
      setLoading(false)
    }
    fetchTickets()
  }, [selected, search])

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1a0533 0%, #0f0f1a 100%)',
        borderBottom: '1px solid var(--color-border)',
        padding: '48px 32px',
        textAlign: 'center',
      }}>
        <h1 style={{ color: '#fff', fontWeight: 800, fontSize: '2.2rem', marginBottom: '20px' }}>
          Browse All Tickets
        </h1>
        <div style={{ maxWidth: '500px', margin: '0 auto', position: 'relative' }}>
          <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '1rem' }}>🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tickets..."
            style={{
              width: '100%',
              padding: '14px 20px 14px 44px',
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
              background: 'rgba(255,255,255,0.06)',
              color: 'var(--color-text)',
              fontSize: '1rem',
              outline: 'none',
            }}
          />
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px' }}>
        {/* Category filters */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '32px' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelected(cat)}
              style={{
                padding: '8px 18px',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                border: selected === cat ? 'none' : '1px solid var(--color-border)',
                background: selected === cat
                  ? 'linear-gradient(135deg, #7c3aed, #a855f7)'
                  : 'var(--color-surface)',
                color: selected === cat ? '#fff' : 'var(--color-muted)',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--color-muted)', fontSize: '1.1rem' }}>
            Loading tickets...
          </div>
        ) : (
          <>
            <p style={{ color: 'var(--color-muted)', marginBottom: '24px', fontSize: '0.9rem' }}>
              {tickets.length} ticket{tickets.length !== 1 ? 's' : ''} found
            </p>
            {tickets.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <p style={{ fontSize: '3rem', marginBottom: '16px' }}>🎫</p>
                <p style={{ color: 'var(--color-muted)', fontSize: '1.1rem' }}>No tickets found</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
                {tickets.map((ticket) => (
                  <TicketCard key={ticket._id} ticket={{ ...ticket, id: ticket._id }} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Listings
