import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import API from '../api'

const COLORS = ['#7c3aed', '#06b6d4', '#10b981', '#f59e0b', '#f87171', '#a855f7', '#ec4899']

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#1c1c28', border: '1px solid #2a2a3a', borderRadius: '10px', padding: '10px 16px' }}>
        <p style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '0.85rem' }}>{label}</p>
        <p style={{ color: '#a855f7', fontWeight: 700 }}>{payload[0].name}: {payload[0].value}</p>
      </div>
    )
  }
  return null
}

function Analytics() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await API.get('/orders/analytics')
        setData(data)
      } catch (err) { console.error(err) }
      setLoading(false)
    }
    fetchAnalytics()
  }, [])

  if (!user) return <div style={{ padding: '40px', color: 'var(--color-muted)' }}>Please login first.</div>
  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--color-muted)', fontSize: '1.1rem' }}>Loading analytics...</p>
    </div>
  )

  const surface = { background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '16px' }

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh', padding: '40px 32px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ color: '#fff', fontWeight: 800, fontSize: '2rem', marginBottom: '6px' }}>Analytics Dashboard</h1>
          <p style={{ color: 'var(--color-muted)' }}>Powered by PostgreSQL 🐘</p>
        </div>

        {/* Top stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
          {[
            { label: 'Total Revenue', value: `₹${data?.totalRevenue || 0}`, color: '#10b981', icon: '💰' },
            { label: 'Total Orders', value: data?.totalOrders || 0, color: '#7c3aed', icon: '📦' },
          ].map((s) => (
            <div key={s.label} style={{ ...surface, padding: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}>{s.label}</p>
                <span style={{ fontSize: '1.5rem' }}>{s.icon}</span>
              </div>
              <p style={{ color: s.color, fontWeight: 800, fontSize: '2rem' }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        {data?.byCategory?.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
            <div style={{ ...surface, padding: '24px' }}>
              <h3 style={{ color: '#fff', fontWeight: 700, marginBottom: '20px' }}>Revenue by Category</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={data.byCategory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" />
                  <XAxis dataKey="category" tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="revenue" fill="#7c3aed" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={{ ...surface, padding: '24px' }}>
              <h3 style={{ color: '#fff', fontWeight: 700, marginBottom: '20px' }}>Orders by Category</h3>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={data.byCategory} dataKey="count" nameKey="category" cx="50%" cy="50%" outerRadius={85} label={({ category }) => category}>
                    {data.byCategory.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Recent transactions */}
        {data?.recentOrders?.length > 0 ? (
          <div style={{ ...surface, padding: '24px' }}>
            <h3 style={{ color: '#fff', fontWeight: 700, marginBottom: '20px' }}>Recent Transactions</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  {['Ticket', 'Category', 'Buyer', 'Price', 'Date'].map((h) => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--color-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.recentOrders.map((order) => (
                  <tr key={order.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '14px 16px', color: 'var(--color-text)', fontWeight: 600, fontSize: '0.9rem' }}>{order.ticket_title}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--color-muted)', fontSize: '0.85rem' }}>{order.category}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--color-muted)', fontSize: '0.85rem' }}>{order.buyer_name}</td>
                    <td style={{ padding: '14px 16px', color: '#34d399', fontWeight: 700, fontSize: '0.95rem' }}>₹{order.price}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--color-muted)', fontSize: '0.85rem' }}>{new Date(order.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ ...surface, padding: '60px', textAlign: 'center' }}>
            <p style={{ fontSize: '2rem', marginBottom: '12px' }}>📊</p>
            <p style={{ color: 'var(--color-muted)', fontSize: '1rem' }}>No transactions yet</p>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem', marginTop: '6px' }}>Buy a ticket to see analytics here</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Analytics
