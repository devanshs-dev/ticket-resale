import { useEffect, useState } from 'react';
import api from '../api';

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/analytics')
      .then(res => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const stats = data ? [
    { label: 'TOTAL SIGNALS', value: data.totalTickets || 0 },
    { label: 'SIGNALS SOLD', value: data.soldTickets || 0 },
    { label: 'TOTAL ORDERS', value: data.totalOrders || 0 },
    { label: 'AVG TRUST SCORE', value: data.avgTrustScore ? Math.round(data.avgTrustScore) : '—' },
    { label: 'TOTAL REVENUE', value: '₹' + (data.totalRevenue || 0).toLocaleString('en-IN') },
    { label: 'INFECTED SIGNALS', value: data.flaggedTickets || 0, danger: true },
  ] : [];

  const catData = data?.byCategory || {};

  return (
    <div className="page-root">
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(26,0,0,0.3), #000 60%)', zIndex: 0, pointerEvents: 'none' }} />

      <div className="container" style={{ paddingTop: '48px', paddingBottom: '80px', position: 'relative', zIndex: 5 }}>
        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
          <div className="signal-badge" style={{ marginBottom: '16px' }}>
            <div className="signal-dot" />
            SIGNAL INTELLIGENCE — HAWKINS ANALYSIS
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '0.1em', color: '#fff', lineHeight: 1, textShadow: '0 0 30px rgba(204,0,0,0.2)' }}>
            SIGNAL <span style={{ color: 'var(--blood)', textShadow: '0 0 20px #cc0000, 0 0 40px #8b0000' }}>ANALYTICS</span>
          </h1>
        </div>

        {loading ? (
          <div style={{ padding: '80px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div className="st-spinner" />
            <span style={{ color: '#333', fontSize: '0.7rem', letterSpacing: '0.15em', fontFamily: 'var(--font-mono)' }}>ANALYZING SIGNAL DATA...</span>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '14px', marginBottom: '48px' }}>
              {stats.map((s, i) => (
                <div key={i} className="stat-card" style={s.danger ? { borderColor: 'rgba(204,0,0,0.3)' } : {}}>
                  <div className="stat-value" style={s.danger ? { color: 'var(--blood)' } : {}}>{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Category breakdown */}
            {Object.keys(catData).length > 0 && (
              <div className="chart-card" style={{ marginBottom: '24px' }}>
                <div className="chart-title">// SIGNAL DISTRIBUTION BY TYPE</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {Object.entries(catData).map(([cat, count]) => {
                    const total = Object.values(catData).reduce((a, b) => a + b, 0);
                    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                    return (
                      <div key={cat}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ color: '#555', fontSize: '0.72rem', letterSpacing: '0.1em', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>{cat}</span>
                          <span style={{ color: 'rgba(204,0,0,0.7)', fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>{count} — {pct}%</span>
                        </div>
                        <div style={{ height: '4px', background: 'rgba(204,0,0,0.08)', borderRadius: '0' }}>
                          <div style={{ height: '100%', width: pct + '%', background: 'var(--blood)', boxShadow: '0 0 8px rgba(204,0,0,0.5)', transition: 'width 1s cubic-bezier(0.16,1,0.3,1)' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Trust score distribution (visual bars) */}
            {data?.trustDistribution && (
              <div className="chart-card">
                <div className="chart-title">// TRUST SCORE DISTRIBUTION</div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '120px', padding: '0 4px' }}>
                  {Object.entries(data.trustDistribution).map(([range, count]) => {
                    const max = Math.max(...Object.values(data.trustDistribution));
                    const h = max > 0 ? (count / max) * 100 : 0;
                    const isLow = range.startsWith('0') || range.startsWith('20') || range.startsWith('40') || range.startsWith('60');
                    return (
                      <div key={range} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: '#222', fontSize: '0.58rem', fontFamily: 'var(--font-mono)' }}>{count}</span>
                        <div style={{ width: '100%', height: h + '%', background: isLow ? 'rgba(204,0,0,0.6)' : 'rgba(0,204,68,0.5)', boxShadow: isLow ? '0 0 8px rgba(204,0,0,0.3)' : 'none', minHeight: '4px', transition: 'height 1s cubic-bezier(0.16,1,0.3,1)' }} />
                        <span style={{ color: '#333', fontSize: '0.58rem', fontFamily: 'var(--font-mono)', transform: 'rotate(-45deg)', transformOrigin: 'top center', whiteSpace: 'nowrap' }}>{range}</span>
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: 'flex', gap: '16px', marginTop: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '10px', height: '10px', background: 'rgba(0,204,68,0.5)' }} />
                    <span style={{ color: '#333', fontSize: '0.62rem', fontFamily: 'var(--font-mono)' }}>TRUSTED SIGNAL</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '10px', height: '10px', background: 'rgba(204,0,0,0.6)' }} />
                    <span style={{ color: '#333', fontSize: '0.62rem', fontFamily: 'var(--font-mono)' }}>INFECTED SIGNAL</span>
                  </div>
                </div>
              </div>
            )}

            {/* Fallback empty */}
            {!data && (
              <div className="empty-state">
                <div className="empty-state-title">NO DATA RECEIVED</div>
                <div className="empty-state-sub">Analytics endpoint not responding — check the ML service</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
