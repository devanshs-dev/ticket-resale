// LOGIN
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../api'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const { data } = await API.post('/auth/login', { email, password })
      localStorage.setItem('user', JSON.stringify(data))
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    }
    setLoading(false)
  }

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '20px', padding: '48px', width: '100%', maxWidth: '420px' }}>
        <h1 style={{ color: '#fff', fontWeight: 800, fontSize: '1.8rem', marginBottom: '6px' }}>Welcome back</h1>
        <p style={{ color: 'var(--color-muted)', marginBottom: '32px' }}>Login to your account</p>

        {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '0.9rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {[
            { label: 'Email', type: 'email', val: email, set: setEmail, ph: 'you@example.com' },
            { label: 'Password', type: 'password', val: password, set: setPassword, ph: 'Enter your password' },
          ].map((f) => (
            <div key={f.label} style={{ marginBottom: '20px' }}>
              <label style={{ color: 'var(--color-text)', fontWeight: 600, fontSize: '0.85rem', display: 'block', marginBottom: '8px' }}>{f.label}</label>
              <input type={f.type} value={f.val} onChange={(e) => f.set(e.target.value)} placeholder={f.ph} required
                style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--color-border)', background: 'var(--color-surface2)', color: 'var(--color-text)', fontSize: '0.95rem', outline: 'none' }} />
            </div>
          ))}
          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', fontSize: '1rem', padding: '14px', marginTop: '8px', opacity: loading ? 0.6 : 1 }}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: 'var(--color-muted)', marginTop: '24px', fontSize: '0.9rem' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: '#a855f7', textDecoration: 'none', fontWeight: 600 }}>Sign up</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
