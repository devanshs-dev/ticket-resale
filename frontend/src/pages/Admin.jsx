import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api'

function Admin() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [flagged, setFlagged] = useState([])
  const [tab, setTab] = useState('stats')

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/'); return }
    fetchAll()
  }, []) // eslint-disable-line

  const fetchAll = async () => {
    try {
      const [statsRes, usersRes, flaggedRes] = await Promise.all([
        API.get('/admin/stats'),
        API.get('/admin/users'),
        API.get('/admin/flagged'),
      ])
      setStats(statsRes.data)
      setUsers(usersRes.data)
      setFlagged(flaggedRes.data)
    } catch (err) { console.error(err) }
  }

  const handleApprove = async (id) => { await API.put('/admin/tickets/' + id + '/approve'); fetchAll() }
  const handleDeleteTicket = async (id) => { await API.delete('/admin/tickets/' + id); fetchAll() }
  const handleBanUser = async (id) => { await API.delete('/admin/users/' + id); fetchAll() }

  const statCards = stats ? [
    { label: 'Total Users', value: stats.totalUsers, color: '#7c3aed', icon: '👥' },
    { label: 'Total Tickets', value: stats.totalTickets, color: '#06b6d4', icon: '🎫' },
    { label: 'Available', value: stats.availableTickets, color: '#10b981', icon: '✅' },
    { label: 'Sold', value: stats.soldTickets, color: '#a855f7', icon: '💸' },
    { label: 'Flagged', value: stats.flaggedTickets, color: '#f87171', icon: '🚩' },
  ] : []

  const surface = { background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '16px' }

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh', padding: '40px 32px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ color: '#fff', fontWeight: 800, fontSize: '2rem', marginBottom: '6px' }}>Admin Panel</h1>
          <p style={{ color: 'var(--color-muted)' }}>Manage users, tickets and flagged listings</p>
        </div>

        {/* Stat cards */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '14px', marginBottom: '32px' }}>
            {statCards.map((s) => (
              <div key={s.label} style={{ ...surface, padding: '20px', textAlign: 'center' }}>
                <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '8px' }}>{s.icon}</span>
                <p style={{ color: 'var(--color-muted)', fontSize: '0.75rem', marginBottom: '6px' }}>{s.label}</p>
                <p style={{ color: s.color, fontWeight: 800, fontSize: '1.6rem' }}>{s.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
          {['stats', 'users', 'flagged'].map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '10px 22px', borderRadius: '10px', fontWeight: 600,
              fontSize: '0.9rem', cursor: 'pointer', textTransform: 'capitalize',
              border: 'none', transition: 'all 0.2s',
              background: tab === t ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : 'var(--color-surface)',
              color: tab === t ? '#fff' : 'var(--color-muted)',
              outline: tab !== t ? '1px solid var(--color-border)' : 'none',
            }}>
              {t}
            </button>
          ))}
        </div>

        {/* Stats tab */}
        {tab === 'stats' && (
          <div style={{ ...surface, padding: '32px' }}>
            <h3 style={{ color: '#fff', fontWeight: 700, marginBottom: '12px' }}>Platform Overview</h3>
            <p style={{ color: 'var(--color-muted)', lineHeight: 1.7 }}>
              Total of <strong style={{ color: 'var(--color-text)' }}>{stats?.totalUsers}</strong> users have listed{' '}
              <strong style={{ color: 'var(--color-text)' }}>{stats?.totalTickets}</strong> tickets on the platform.{' '}
              <strong style={{ color: '#34d399' }}>{stats?.soldTickets}</strong> tickets have been sold successfully.{' '}
              <strong style={{ color: '#f87171' }}>{stats?.flaggedTickets}</strong> tickets are currently flagged for review.
            </p>
          </div>
        )}

        {/* Users tab */}
        {tab === 'users' && (
          <div style={{ ...surface, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  {['Name', 'Email', 'Role', 'Action'].map((h) => (
                    <th key={h} style={{ padding: '16px 20px', textAlign: 'left', color: 'var(--color-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '16px 20px', color: 'var(--color-text)', fontWeight: 600 }}>{u.name}</td>
                    <td style={{ padding: '16px 20px', color: 'var(--color-muted)', fontSize: '0.9rem' }}>{u.email}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{
                        background: u.role === 'admin' ? 'rgba(248,113,113,0.1)' : 'rgba(124,58,237,0.1)',
                        border: `1px solid ${u.role === 'admin' ? 'rgba(248,113,113,0.3)' : 'rgba(124,58,237,0.3)'}`,
                        color: u.role === 'admin' ? '#f87171' : '#a855f7',
                        padding: '2px 10px', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase',
                      }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <button onClick={() => handleBanUser(u._id)} style={{
                        background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                        color: '#f87171', padding: '6px 14px', borderRadius: '8px',
                        cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
                      }}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Flagged tab */}
        {tab === 'flagged' && (
          <div>
            {flagged.length === 0 ? (
              <div style={{ ...surface, padding: '60px', textAlign: 'center' }}>
                <p style={{ fontSize: '2rem', marginBottom: '12px' }}>✅</p>
                <p style={{ color: 'var(--color-muted)' }}>No flagged tickets — all clear!</p>
              </div>
            ) : flagged.map((t) => (
              <div key={t._id} style={{ ...surface, padding: '20px 24px', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ color: 'var(--color-text)', fontWeight: 700, marginBottom: '4px' }}>{t.title}</h3>
                  <p style={{ color: 'var(--color-muted)', fontSize: '0.8rem' }}>
                    Seller: {t.seller?.name} · Trust Score:{' '}
                    <span style={{ color: '#f87171', fontWeight: 600 }}>{t.trustScore}</span>
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => handleApprove(t._id)} style={{
                    background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
                    color: '#34d399', padding: '8px 18px', borderRadius: '8px',
                    cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
                  }}>
                    Approve
                  </button>
                  <button onClick={() => handleDeleteTicket(t._id)} style={{
                    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                    color: '#f87171', padding: '8px 18px', borderRadius: '8px',
                    cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
                  }}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Admin
