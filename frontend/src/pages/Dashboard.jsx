import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import API from '../api'

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'))
  const [orders, setOrders] = useState([])
  const [sales, setSales] = useState([])
  const [tab, setTab] = useState('orders')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, salesRes] = await Promise.all([
          API.get('/orders/my-orders'),
          API.get('/orders/my-sales')
        ])
        setOrders(ordersRes.data)
        setSales(salesRes.data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [])

  if (!user) return <div style={{ padding: '40px', color: 'var(--color-muted)' }}>Please login first.</div>

  const activeData = tab === 'orders' ? orders : sales
  const totalEarned = sales.reduce((sum, s) => sum + s.price, 0)

  const statCards = [
    { label: 'Tickets Bought', value: orders.length, icon: '🎟️', color: '#7c3aed' },
    { label: 'Tickets Sold', value: sales.length, icon: '💸', color: '#06b6d4' },
    { label: 'Total Earned', value: `₹${totalEarned}`, icon: '💰', color: '#10b981' },
  ]

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh', padding: '40px 32px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ color: '#fff', fontWeight: 800, fontSize: '2rem', marginBottom: '6px' }}>My Dashboard</h1>
          <p style={{ color: 'var(--color-muted)' }}>Welcome back, {user.name} 👋</p>
        </div>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
          {statCards.map((s) => (
            <div key={s.label} style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '16px',
              padding: '24px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}>{s.label}</p>
                <span style={{ fontSize: '1.4rem' }}>{s.icon}</span>
              </div>
              <p style={{ color: s.color, fontWeight: 800, fontSize: '1.8rem' }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
          {[['orders', 'My Purchases'], ['sales', 'My Listings']].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)} style={{
              padding: '10px 22px',
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              border: 'none',
              background: tab === key ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : 'var(--color-surface)',
              color: tab === key ? '#fff' : 'var(--color-muted)',
              outline: tab !== key ? '1px solid var(--color-border)' : 'none',
            }}>
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeData.length === 0 ? (
          <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '16px',
            padding: '60px',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🎫</p>
            <p style={{ color: 'var(--color-muted)', fontSize: '1rem', marginBottom: '16px' }}>Nothing here yet</p>
            {tab === 'orders'
              ? <Link to="/listings" style={{ color: '#a855f7', textDecoration: 'none', fontWeight: 600 }}>Browse tickets →</Link>
              : <Link to="/sell" style={{ color: '#a855f7', textDecoration: 'none', fontWeight: 600 }}>List a ticket →</Link>
            }
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activeData.map((item) => (
              <div key={item._id} style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: '16px',
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'border-color 0.2s',
              }}>
                <div>
                  <h3 style={{ color: 'var(--color-text)', fontWeight: 700, marginBottom: '6px' }}>{item.ticket?.title}</h3>
                  <p style={{ color: 'var(--color-muted)', fontSize: '0.8rem' }}>
                    {item.ticket?.date} · {item.ticket?.location}
                  </p>
                  <p style={{ color: 'var(--color-muted)', fontSize: '0.8rem', marginTop: '2px' }}>
                    {tab === 'orders' ? `Seller: ${item.seller?.name}` : `Buyer: ${item.buyer?.name}`}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ color: '#fff', fontWeight: 800, fontSize: '1.3rem', marginBottom: '6px' }}>₹{item.price}</p>
                  <span style={{
                    background: 'rgba(16,185,129,0.1)',
                    border: '1px solid rgba(16,185,129,0.3)',
                    color: '#34d399',
                    padding: '2px 12px',
                    borderRadius: '999px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
