import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const CATEGORIES = ['Concerts','Travel','Sports','Movies','Theatre','Subscriptions','Reservations'];

export default function Sell() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [trustScore, setTrustScore] = useState(null);
  const [form, setForm] = useState({
    title: '', category: '', price: '', quantity: 1,
    date: '', venue: '', description: '',
  });

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await api.post('/tickets', form);
      setTrustScore(res.data.ticket?.trustScore || res.data.trustScore || null);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'TRANSMISSION FAILED. TRY AGAIN.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-root">
      {/* BG */}
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(26,0,0,0.35) 0%, #000 60%)', zIndex: 0, pointerEvents: 'none' }} />
      <div className="static-noise" style={{ position: 'fixed' }} />

      <div className="container-sm" style={{ paddingTop: '60px', paddingBottom: '80px', position: 'relative', zIndex: 5 }}>
        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
          <div className="signal-badge" style={{ marginBottom: '20px' }}>
            <div className="signal-dot" />
            SIGNAL TRANSMISSION
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '0.1em', color: '#fff', lineHeight: 1 }}>
            LIST A <span style={{ color: 'var(--blood)', textShadow: '0 0 20px #cc0000, 0 0 40px #8b0000' }}>SIGNAL</span>
          </h1>
          <p style={{ color: '#333', fontSize: '0.72rem', letterSpacing: '0.12em', fontFamily: 'var(--font-mono)', marginTop: '8px' }}>
            // Your ticket will be scanned by Hawkins ML Fraud Detection before going live.
          </p>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '48px' }}>
          {[
            { n: 1, label: 'EVENT INFO' },
            { n: 2, label: 'PRICING' },
            { n: 3, label: 'TRANSMITTED' },
          ].map(({ n, label }, i) => (
            <div key={n} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  border: step >= n ? '1px solid var(--blood)' : '1px solid rgba(204,0,0,0.2)',
                  background: step >= n ? 'rgba(204,0,0,0.12)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-display)', fontSize: '1rem',
                  color: step >= n ? 'var(--blood)' : '#222',
                  boxShadow: step === n ? '0 0 14px rgba(204,0,0,0.35)' : 'none',
                  transition: 'all 0.4s',
                }}>
                  {step > n ? '✓' : n}
                </div>
                <span style={{ color: step >= n ? 'rgba(204,0,0,0.7)' : '#222', fontSize: '0.58rem', letterSpacing: '0.1em', fontFamily: 'var(--font-mono)' }}>{label}</span>
              </div>
              {i < 2 && <div style={{ flex: 1, height: '1px', background: step > n ? 'rgba(204,0,0,0.4)' : 'rgba(204,0,0,0.1)', margin: '0 8px', marginBottom: '20px' }} />}
            </div>
          ))}
        </div>

        {/* STEP 1 & 2 combined form */}
        {step < 3 && (
          <div className="auth-card">
            {error && (
              <div style={{ background: 'rgba(204,0,0,0.08)', border: '1px solid rgba(204,0,0,0.3)', padding: '12px 16px', marginBottom: '24px', color: 'var(--blood)', fontSize: '0.75rem', letterSpacing: '0.05em', fontFamily: 'var(--font-mono)' }}>
                ■ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label className="st-label">// EVENT TITLE</label>
                <input className="st-input" placeholder="E.G. COLDPLAY WORLD TOUR MUMBAI" value={form.title} onChange={e => update('title', e.target.value)} required />
              </div>
              <div>
                <label className="st-label">// SIGNAL TYPE (CATEGORY)</label>
                <select className="st-select" value={form.category} onChange={e => update('category', e.target.value)} required>
                  <option value="">SELECT CATEGORY</option>
                  {CATEGORIES.map(c => <option key={c} value={c.toLowerCase()}>{c.toUpperCase()}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="st-label">// DATE</label>
                  <input className="st-input" type="date" value={form.date} onChange={e => update('date', e.target.value)} />
                </div>
                <div>
                  <label className="st-label">// VENUE / LOCATION</label>
                  <input className="st-input" placeholder="MUMBAI, INDIA" value={form.venue} onChange={e => update('venue', e.target.value)} />
                </div>
              </div>
              <div>
                <label className="st-label">// DESCRIPTION</label>
                <textarea
                  className="st-input"
                  style={{ minHeight: '80px', resize: 'vertical' }}
                  placeholder="DESCRIBE THE SIGNAL..."
                  value={form.description}
                  onChange={e => update('description', e.target.value)}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                <div>
                  <label className="st-label">// PRICE PER TICKET (₹)</label>
                  <input className="st-input" type="number" placeholder="2500" min="1" value={form.price} onChange={e => update('price', e.target.value)} required />
                </div>
                <div>
                  <label className="st-label">// QUANTITY</label>
                  <input className="st-input" type="number" min="1" max="10" value={form.quantity} onChange={e => update('quantity', parseInt(e.target.value) || 1)} required />
                </div>
              </div>

              {/* ML note */}
              <div style={{ padding: '14px 16px', background: 'rgba(204,0,0,0.04)', border: '1px solid rgba(204,0,0,0.13)', borderLeft: '2px solid rgba(204,0,0,0.4)', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#333', letterSpacing: '0.06em', lineHeight: '1.7' }}>
                ■ HAWKINS ML ENGINE will analyze this signal for fraud patterns.<br />
                ■ SIGNAL STRENGTH (Trust Score) is calculated automatically.<br />
                ■ LOW TRUST SIGNALS (&lt;60) will be flagged as INFECTED.
              </div>

              <button type="submit" className="btn-red" style={{ width: '100%', justifyContent: 'center', padding: '17px', fontSize: '1.1rem', marginTop: '4px' }} disabled={loading}>
                {loading ? (
                  <><div className="st-spinner" style={{ width: '16px', height: '16px', borderWidth: '2px', borderTopColor: '#000' }} /> TRANSMITTING SIGNAL...</>
                ) : 'OPEN THE GATE →'}
              </button>
            </form>
          </div>
        )}

        {/* STEP 3 — SUCCESS */}
        {step === 3 && (
          <div style={{ textAlign: 'center' }}>
            <div className="auth-card" style={{ textAlign: 'left' }}>
              {/* Top success line */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, #00cc44, transparent)' }} />
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', color: '#00cc44', letterSpacing: '0.1em', textShadow: '0 0 20px rgba(0,204,68,0.4)' }}>SIGNAL SENT</div>
                <p style={{ color: '#333', fontSize: '0.72rem', letterSpacing: '0.12em', fontFamily: 'var(--font-mono)', marginTop: '8px' }}>
                  // Your ticket is now live in the Hawkins marketplace
                </p>
              </div>

              {trustScore !== null && (
                <div style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(204,0,0,0.2)', padding: '20px', marginBottom: '24px', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#333', letterSpacing: '0.15em', marginBottom: '8px' }}>// ML SIGNAL STRENGTH RESULT</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '3.5rem', letterSpacing: '0.08em', color: trustScore >= 80 ? '#00cc44' : trustScore >= 60 ? '#ffaa00' : 'var(--blood)', textShadow: trustScore >= 80 ? '0 0 20px rgba(0,204,68,0.5)' : '0 0 20px rgba(204,0,0,0.5)' }}>
                    {trustScore}<span style={{ fontSize: '1.2rem', color: '#333' }}>/100</span>
                  </div>
                  <div className="trust-badge" style={{ display: 'inline-flex', marginTop: '8px' }}>
                    ■ {trustScore >= 80 ? 'STRONG SIGNAL' : trustScore >= 60 ? 'MODERATE SIGNAL' : '⚠ INFECTED SIGNAL — LOW TRUST'}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button className="btn-red" onClick={() => navigate('/listings')}>VIEW MARKETPLACE →</button>
                <button className="btn-ghost" onClick={() => { setStep(1); setTrustScore(null); setForm({ title:'',category:'',price:'',quantity:1,date:'',venue:'',description:'' }); }}>
                  TRANSMIT ANOTHER
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
