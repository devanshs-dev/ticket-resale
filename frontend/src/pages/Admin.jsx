import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const TABS = ['OVERVIEW', 'AGENTS', 'SIGNALS', 'INFECTED'];

export default function Admin() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [tab, setTab] = useState('OVERVIEW');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [flagged, setFlagged] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user.role !== 'admin') { navigate('/'); return; }
    Promise.all([
      api.get('/admin/stats').catch(() => ({ data: {} })),
      api.get('/admin/users').catch(() => ({ data: [] })),
      api.get('/admin/tickets').catch(() => ({ data: [] })),
      api.get('/admin/flagged').catch(() => ({ data: [] })),
    ]).then(([s, u, t, f]) => {
      setStats(s.data);
      setUsers(u.data?.users || u.data || []);
      setTickets(t.data?.tickets || t.data || []);
      setFlagged(f.data?.tickets || f.data || []);
    }).finally(() => setLoading(false));
  }, []);

  const statItems = stats ? [
    { label: 'TOTAL AGENTS', value: stats.totalUsers || users.length },
    { label: 'ACTIVE SIGNALS', value: stats.activeTickets || tickets.length },
    { label: 'INFECTED SIGNALS', value: stats.flaggedTickets || flagged.length, danger: true },
    { label: 'TOTAL ORDERS', value: stats.totalOrders || 0 },
    { label: 'REVENUE (₹)', value: (stats.totalRevenue || 0).toLocaleString('en-IN') },
    { label: 'AVG TRUST SCORE', value: stats.avgTrustScore ? Math.round(stats.avgTrustScore) : '—' },
  ] : [];

  return (
    <div className="page-root">
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(26,0,0,0.3), #000 60%)', zIndex: 0, pointerEvents: 'none' }} />

      <div className="container" style={{ paddingTop: '48px', paddingBottom: '80px', position: 'relative', zIndex: 5 }}>
        {/* Header */}
        <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div className="signal-badge" style={{ marginBottom: '12px' }}>
              <div className="signal-dot" />
              HAWKINS LABORATORY — CLASSIFIED
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3.5rem', letterSpacing: '0.1em', color: '#fff', lineHeight: 1, textShadow: '0 0 30px rgba(204,0,0,0.2)' }}>
              ADMIN <span style={{ color: 'var(--blood)', textShadow: '0 0 20px #cc0000' }}>CONTROL</span>
            </h1>
            <p style={{ color: '#333', fontSize: '0.7rem', letterSpacing: '0.12em', fontFamily: 'var(--font-mono)', marginTop: '8px' }}>
              // DR. {(user.name || 'BRENNER').toUpperCase()} — CLEARANCE: LEVEL 5
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ border: '1px solid rgba(204,0,0,0.2)', padding: '10px 16px', background: 'rgba(0,0,0,0.5)' }}>
              <div style={{ color: '#333', fontSize: '0.6rem', letterSpacing: '0.15em', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>SYSTEM</div>
              <div style={{ color: '#00cc44', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}>● ALL SYSTEMS ONLINE</div>
            </div>
          </div>
        </div>

        {/* Stat grid */}
        {!loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '14px', marginBottom: '48px' }}>
            {statItems.map((s, i) => (
              <div key={i} className="stat-card" style={s.danger ? { borderColor: 'rgba(204,0,0,0.3)', boxShadow: '0 0 20px rgba(204,0,0,0.07)' } : {}}>
                <div className="stat-value" style={s.danger ? { color: 'var(--blood)', textShadow: '0 0 20px rgba(204,0,0,0.4)' } : {}}>{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid rgba(204,0,0,0.13)', marginBottom: '32px' }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '12px 24px', background: 'none', border: 'none',
              borderBottom: tab === t ? '2px solid var(--blood)' : '2px solid transparent',
              color: tab === t ? 'var(--blood)' : '#333',
              fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.12em',
              textTransform: 'uppercase', cursor: 'pointer', transition: 'all .2s', marginBottom: '-1px',
            }}>
              {t}{t === 'INFECTED' && flagged.length > 0 ? ` (${flagged.length})` : ''}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: '80px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div className="st-spinner" />
            <span style={{ color: '#333', fontSize: '0.7rem', letterSpacing: '0.15em', fontFamily: 'var(--font-mono)' }}>SCANNING HAWKINS LAB DATABASE...</span>
          </div>
        ) : (
          <>
            {/* OVERVIEW */}
            {tab === 'OVERVIEW' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="chart-card">
                  <div className="chart-title">// SIGNAL FEED (RECENT)</div>
                  {tickets.slice(0,5).map((t, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(204,0,0,0.08)' }}>
                      <span style={{ color: '#888', fontSize: '0.78rem', fontFamily: 'var(--font-mono)' }}>{t.title || 'Event'}</span>
                      <span style={{ color: 'rgba(204,0,0,0.6)', fontSize: '0.68rem', fontFamily: 'var(--font-mono)' }}>₹{Number(t.price||0).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                  {tickets.length === 0 && <div style={{ color: '#222', fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>NO SIGNALS DETECTED</div>}
                </div>
                <div className="chart-card">
                  <div className="chart-title">// RECENT AGENTS</div>
                  {users.slice(0,5).map((u, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(204,0,0,0.08)' }}>
                      <div>
                        <div style={{ color: '#888', fontSize: '0.78rem', fontFamily: 'var(--font-mono)' }}>{u.name || 'Agent'}</div>
                        <div style={{ color: '#333', fontSize: '0.65rem', fontFamily: 'var(--font-mono)' }}>{u.email}</div>
                      </div>
                      <span className={`badge ${u.role === 'admin' ? 'badge-red' : 'badge-gray'}`}>{(u.role||'user').toUpperCase()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AGENTS (users) */}
            {tab === 'AGENTS' && (
              <div style={{ overflowX: 'auto' }}>
                <table className="st-table">
                  <thead><tr><th>NAME</th><th>EMAIL</th><th>ROLE</th><th>JOINED</th><th>LISTINGS</th></tr></thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id || u.id}>
                        <td>{u.name || '—'}</td>
                        <td style={{ color: '#555' }}>{u.email}</td>
                        <td><span className={`badge ${u.role === 'admin' ? 'badge-red' : 'badge-gray'}`}>{(u.role||'USER').toUpperCase()}</span></td>
                        <td style={{ color: '#333' }}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                        <td style={{ color: 'rgba(204,0,0,0.6)', fontFamily: 'var(--font-mono)' }}>{u.ticketCount || 0}</td>
                      </tr>
                    ))}
                    {users.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', color: '#222', padding: '40px' }}>NO AGENTS REGISTERED</td></tr>}
                  </tbody>
                </table>
              </div>
            )}

            {/* SIGNALS (all tickets) */}
            {tab === 'SIGNALS' && (
              <div style={{ overflowX: 'auto' }}>
                <table className="st-table">
                  <thead><tr><th>SIGNAL</th><th>CATEGORY</th><th>PRICE</th><th>TRUST</th><th>STATUS</th><th>TRANSMITTER</th></tr></thead>
                  <tbody>
                    {tickets.map(t => (
                      <tr key={t._id || t.id}>
                        <td style={{ maxWidth: '200px' }}>{t.title || '—'}</td>
                        <td><span className="badge badge-gray">{(t.category||'').toUpperCase()}</span></td>
                        <td style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem' }}>₹{Number(t.price||0).toLocaleString('en-IN')}</td>
                        <td>
                          <span style={{ color: (t.trustScore||0)>=80 ? '#00cc44' : (t.trustScore||0)>=60 ? '#ffaa00' : '#cc0000', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
                            {t.trustScore||'—'}/100
                          </span>
                        </td>
                        <td><span className={`badge ${t.status==='sold'?'badge-red':t.status==='flagged'?'badge-yellow':'badge-green'}`}>{(t.status||'ACTIVE').toUpperCase()}</span></td>
                        <td style={{ color: '#333' }}>{t.seller?.name || t.sellerName || '—'}</td>
                      </tr>
                    ))}
                    {tickets.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', color: '#222', padding: '40px' }}>NO SIGNALS DETECTED</td></tr>}
                  </tbody>
                </table>
              </div>
            )}

            {/* INFECTED (flagged) */}
            {tab === 'INFECTED' && (
              flagged.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-title" style={{ color: '#00cc44' }}>NO INFECTED SIGNALS</div>
                  <div className="empty-state-sub">Hawkins is clean. For now.</div>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  {/* Warning banner */}
                  <div style={{ border: '1px solid rgba(204,0,0,0.4)', background: 'rgba(204,0,0,0.06)', padding: '14px 18px', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span style={{ color: 'var(--blood)', fontSize: '1.2rem' }}>⚠</span>
                    <span style={{ color: 'var(--blood)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.08em' }}>
                      {flagged.length} INFECTED SIGNAL{flagged.length !== 1 ? 'S' : ''} DETECTED — REVIEW AND QUARANTINE
                    </span>
                  </div>
                  <table className="st-table">
                    <thead><tr><th>SIGNAL</th><th>TRUST SCORE</th><th>PRICE</th><th>TRANSMITTER</th><th>ACTIONS</th></tr></thead>
                    <tbody>
                      {flagged.map(t => (
                        <tr key={t._id || t.id} style={{ background: 'rgba(204,0,0,0.03)' }}>
                          <td>{t.title || '—'}</td>
                          <td><span style={{ color: 'var(--blood)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', textShadow: '0 0 10px rgba(204,0,0,0.4)' }}>■ {t.trustScore||0}/100 — INFECTED</span></td>
                          <td style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem' }}>₹{Number(t.price||0).toLocaleString('en-IN')}</td>
                          <td style={{ color: '#444' }}>{t.seller?.name || t.sellerName || '—'}</td>
                          <td style={{ display: 'flex', gap: '8px' }}>
                            <button className="btn-ghost" style={{ padding: '4px 12px', fontSize: '0.6rem', borderColor: 'rgba(204,0,0,0.6)', color: 'var(--blood)' }}
                              onClick={() => api.delete(`/admin/tickets/${t._id||t.id}`).then(() => setFlagged(f => f.filter(x => x._id !== t._id)))}
                            >
                              QUARANTINE
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
}
