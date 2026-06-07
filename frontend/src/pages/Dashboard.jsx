import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const TABS = ['MY SIGNALS', 'PURCHASES', 'SOLD'];

export default function Dashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('MY SIGNALS');
  const [myTickets, setMyTickets] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    Promise.all([
      api.get('/tickets/my').catch(() => ({ data: [] })),
      api.get('/orders/my').catch(() => ({ data: [] })),
    ]).then(([tRes, oRes]) => {
      setMyTickets(tRes.data?.tickets || tRes.data || []);
      setOrders(oRes.data?.orders || oRes.data || []);
    }).finally(() => setLoading(false));
  }, []);

  const purchases = orders.filter(o => o.type !== 'sale');
  const sales = orders.filter(o => o.type === 'sale');
  const totalRevenue = sales.reduce((s, o) => s + (o.price || 0), 0);

  return (
    <div className="page-root">
      <div className="container" style={{ paddingTop: '48px', paddingBottom: '80px' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div className="signal-dot" />
            <span style={{ color: 'rgba(204,0,0,0.5)', fontSize: '0.65rem', letterSpacing: '0.2em', fontFamily: 'var(--font-mono)' }}>AGENT TERMINAL</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3.5rem', letterSpacing: '0.1em', color: '#fff', lineHeight: 1, textShadow: '0 0 30px rgba(204,0,0,0.2)' }}>
            WELCOME,{' '}<span style={{ color: 'var(--blood)', textShadow: '0 0 20px #cc0000' }}>{(user.name || 'AGENT').toUpperCase()}</span>
          </h1>
          <p style={{ color: '#333', fontSize: '0.72rem', letterSpacing: '0.12em', fontFamily: 'var(--font-mono)', marginTop: '8px' }}>
            // {user.email} — CLEARANCE LEVEL: {user.role === 'admin' ? 'ADMIN' : 'STANDARD'}
          </p>
        </div>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px', marginBottom: '48px' }}>
          {[
            { label: 'ACTIVE LISTINGS', value: myTickets.filter(t => t.status !== 'sold').length },
            { label: 'TOTAL PURCHASES', value: purchases.length },
            { label: 'TICKETS SOLD',    value: sales.length },
            { label: 'REVENUE (₹)',     value: totalRevenue.toLocaleString('en-IN') },
          ].map((s, i) => (
            <div key={i} className="stat-card">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Quick action */}
        <div style={{ marginBottom: '48px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button className="btn-red" onClick={() => navigate('/sell')}>
            + LIST A TICKET →
          </button>
          <button className="btn-ghost" onClick={() => navigate('/listings')}>
            BROWSE SIGNALS →
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0', marginBottom: '32px', borderBottom: '1px solid rgba(204,0,0,0.13)' }}>
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '12px 24px', background: 'none',
                border: 'none', borderBottom: tab === t ? '2px solid var(--blood)' : '2px solid transparent',
                color: tab === t ? 'var(--blood)' : '#444',
                fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.12em',
                textTransform: 'uppercase', cursor: 'pointer',
                transition: 'all 0.2s', marginBottom: '-1px',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {loading ? (
          <div style={{ padding: '60px 0', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div className="st-spinner" />
            <span style={{ color: '#333', fontSize: '0.7rem', letterSpacing: '0.15em', fontFamily: 'var(--font-mono)' }}>LOADING SIGNALS...</span>
          </div>
        ) : (
          <>
            {tab === 'MY SIGNALS' && (
              myTickets.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-title">NO LISTINGS YET</div>
                  <div className="empty-state-sub">Start transmitting — list your first ticket</div>
                  <button className="btn-red" style={{ marginTop: '24px' }} onClick={() => navigate('/sell')}>LIST NOW →</button>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table className="st-table">
                    <thead>
                      <tr>
                        <th>EVENT</th><th>CATEGORY</th><th>PRICE</th><th>STATUS</th><th>TRUST</th><th>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myTickets.map(t => (
                        <tr key={t._id || t.id}>
                          <td>{t.title || t.name}</td>
                          <td><span className="badge badge-gray">{(t.category || '').toUpperCase()}</span></td>
                          <td style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>₹{Number(t.price || 0).toLocaleString('en-IN')}</td>
                          <td><span className={`badge ${t.status === 'sold' ? 'badge-red' : 'badge-green'}`}>{(t.status || 'ACTIVE').toUpperCase()}</span></td>
                          <td style={{ color: 'rgba(204,0,0,0.7)', fontFamily: 'var(--font-mono)' }}>{t.trustScore || t.trust_score || '—'}</td>
                          <td>
                            <button className="btn-ghost" style={{ padding: '5px 12px', fontSize: '0.65rem' }} onClick={() => navigate(`/tickets/${t._id || t.id}`)}>VIEW</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}

            {tab === 'PURCHASES' && (
              purchases.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-title">NO PURCHASES YET</div>
                  <div className="empty-state-sub">Browse active signals to find your next event</div>
                  <button className="btn-ghost" style={{ marginTop: '24px' }} onClick={() => navigate('/listings')}>BROWSE →</button>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table className="st-table">
                    <thead><tr><th>EVENT</th><th>DATE</th><th>PAID</th><th>QR</th><th>STATUS</th></tr></thead>
                    <tbody>
                      {purchases.map(o => (
                        <tr key={o._id || o.id}>
                          <td>{o.ticket?.title || o.ticketTitle || 'Event'}</td>
                          <td style={{ color: '#444' }}>{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '—'}</td>
                          <td style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>₹{Number(o.price || 0).toLocaleString('en-IN')}</td>
                          <td><span className="badge badge-green">QR ISSUED</span></td>
                          <td><span className="badge badge-green">CONFIRMED</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}

            {tab === 'SOLD' && (
              sales.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-title">NO SALES YET</div>
                  <div className="empty-state-sub">List a ticket to start earning</div>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table className="st-table">
                    <thead><tr><th>EVENT</th><th>SOLD DATE</th><th>PRICE</th><th>BUYER</th></tr></thead>
                    <tbody>
                      {sales.map(o => (
                        <tr key={o._id || o.id}>
                          <td>{o.ticket?.title || o.ticketTitle || 'Event'}</td>
                          <td style={{ color: '#444' }}>{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '—'}</td>
                          <td style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: '#00cc44' }}>₹{Number(o.price || 0).toLocaleString('en-IN')}</td>
                          <td style={{ color: '#444' }}>{o.buyer?.name || o.buyerName || '—'}</td>
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