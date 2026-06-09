import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', form);
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      if (onLogin) onLogin(user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'AUTHENTICATION FAILED. CHECK YOUR CREDENTIALS.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-root" style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px', position: 'relative',
    }}>
      {/* BG effects */}
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse at 50% 40%, rgba(26,0,0,0.4) 0%, #000 70%)', zIndex: 0, pointerEvents: 'none' }} />
      <div className="static-noise" style={{ position: 'fixed' }} />

      <div style={{ position: 'relative', zIndex: 5, width: '100%', maxWidth: '440px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Link to="/" style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', letterSpacing: '0.15em', color: 'var(--blood)', textShadow: '0 0 20px rgba(204,0,0,0.5)', display: 'inline-block', marginBottom: '20px' }}>
            TicketResale
          </Link>
          <div className="signal-badge" style={{ display: 'inline-flex' }}>
            <div className="signal-dot" />
            IDENTITY VERIFICATION
          </div>
        </div>

        <div className="auth-card">
          <h1 className="auth-title">ACCESS<br /><span style={{ color: 'var(--blood)', textShadow: '0 0 20px #cc0000, 0 0 40px #8b0000' }}>PORTAL</span></h1>
          <p className="auth-subtitle">Enter your credentials to cross into the marketplace</p>

          {error && (
            <div style={{ background: 'rgba(204,0,0,0.08)', border: '1px solid rgba(204,0,0,0.3)', padding: '12px 16px', marginBottom: '24px', color: 'var(--blood)', fontSize: '0.75rem', letterSpacing: '0.05em', fontFamily: 'var(--font-mono)' }}>
              ■ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label className="st-label">// SIGNAL ID (EMAIL)</label>
              <input
                className="st-input"
                type="email"
                placeholder="ENTER YOUR EMAIL"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="st-label">// ACCESS CODE (PASSWORD)</label>
              <input
                className="st-input"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            <button
              type="submit"
              className="btn-red"
              style={{ width: '100%', justifyContent: 'center', marginTop: '8px', fontSize: '1.05rem', padding: '16px' }}
              disabled={loading}
            >
              {loading ? (
                <><div className="st-spinner" style={{ width: '16px', height: '16px', borderWidth: '2px', borderTopColor: '#000' }} /> AUTHENTICATING...</>
              ) : 'ENTER THE PORTAL →'}
            </button>
          </form>

          <p style={{ marginTop: '28px', textAlign: 'center', color: '#333', fontSize: '0.72rem', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)' }}>
            NO SIGNAL YET?{' '}
            <Link to="/signup" style={{ color: 'var(--blood)', textDecoration: 'none', transition: 'text-shadow 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.textShadow = '0 0 10px rgba(204,0,0,0.5)'}
              onMouseLeave={e => e.currentTarget.style.textShadow = 'none'}
            >
              JOIN THE NETWORK →
            </Link>
          </p>

          {/* Seeded creds hint */}
          
          </div>
        </div>
      </div>
    
  );
}
