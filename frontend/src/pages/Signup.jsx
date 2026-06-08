import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

export default function Signup({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('ACCESS CODES DO NOT MATCH.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/register', { name: form.name, email: form.email, password: form.password });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      if (onLogin) onLogin(user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'REGISTRATION FAILED. TRY AGAIN.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-root" style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px', position: 'relative',
    }}>
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse at 50% 40%, rgba(26,0,0,0.4) 0%, #000 70%)', zIndex: 0, pointerEvents: 'none' }} />
      <div className="static-noise" style={{ position: 'fixed' }} />

      <div style={{ position: 'relative', zIndex: 5, width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Link to="/" style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', letterSpacing: '0.15em', color: 'var(--blood)', textShadow: '0 0 20px rgba(204,0,0,0.5)', display: 'inline-block', marginBottom: '20px' }}>
            TicketResale
          </Link>
          <div className="signal-badge" style={{ display: 'inline-flex' }}>
            <div className="signal-dot" />
            NEW AGENT REGISTRATION
          </div>
        </div>

        <div className="auth-card">
          <h1 className="auth-title">JOIN THE<br /><span style={{ color: 'var(--blood)', textShadow: '0 0 20px #cc0000, 0 0 40px #8b0000' }}>NETWORK</span></h1>
          <p className="auth-subtitle">Establish your signal in the marketplace</p>

          {error && (
            <div style={{ background: 'rgba(204,0,0,0.08)', border: '1px solid rgba(204,0,0,0.3)', padding: '12px 16px', marginBottom: '24px', color: 'var(--blood)', fontSize: '0.75rem', letterSpacing: '0.05em', fontFamily: 'var(--font-mono)' }}>
              ■ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label className="st-label">// AGENT NAME</label>
              <input className="st-input" type="text" placeholder="YOUR NAME" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="st-label">// SIGNAL ID (EMAIL)</label>
              <input className="st-input" type="email" placeholder="YOUR EMAIL" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label className="st-label">// ACCESS CODE (PASSWORD)</label>
              <input className="st-input" type="password" placeholder="MIN 6 CHARACTERS" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
            </div>
            <div>
              <label className="st-label">// CONFIRM ACCESS CODE</label>
              <input className="st-input" type="password" placeholder="REPEAT PASSWORD" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} required />
            </div>

            <button type="submit" className="btn-red" style={{ width: '100%', justifyContent: 'center', marginTop: '8px', fontSize: '1.05rem', padding: '16px' }} disabled={loading}>
              {loading ? (
                <><div className="st-spinner" style={{ width: '16px', height: '16px', borderWidth: '2px', borderTopColor: '#000' }} /> ESTABLISHING SIGNAL...</>
              ) : 'JOIN THE NETWORK →'}
            </button>
          </form>

          <p style={{ marginTop: '28px', textAlign: 'center', color: '#333', fontSize: '0.72rem', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)' }}>
            ALREADY TRANSMITTING?{' '}
            <Link to="/login" style={{ color: 'var(--blood)', textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.textShadow = '0 0 10px rgba(204,0,0,0.5)'}
              onMouseLeave={e => e.currentTarget.style.textShadow = 'none'}
            >
              ACCESS PORTAL →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
