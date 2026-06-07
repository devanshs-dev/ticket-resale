import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Profile() {
  const user = JSON.parse(localStorage.getItem('user'))
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)

  if (!user) { navigate('/login'); return null }

  const handleCopy = () => {
    navigator.clipboard.writeText(user.email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const infoCard = (label, value, onClick) => (
    <div onClick={onClick} style={{
      background: 'var(--color-surface2)',
      border: '1px solid var(--color-border)',
      borderRadius: '12px',
      padding: '16px',
      cursor: onClick ? 'pointer' : 'default',
    }}>
      <p style={{ color: 'var(--color-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>{label}</p>
      <p style={{ color: 'var(--color-text)', fontWeight: 600 }}>{value}</p>
    </div>
  )

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh', padding: '40px 32px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ color: '#fff', fontWeight: 800, fontSize: '2rem', marginBottom: '32px' }}>My Profile</h1>

        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '20px', padding: '32px', marginBottom: '20px' }}>
          {/* Avatar row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
            <div style={{
              width: '72px', height: '72px',
              background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: '1.8rem', fontWeight: 800,
            }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style={{ color: '#fff', fontWeight: 700, fontSize: '1.3rem', marginBottom: '4px' }}>{user.name}</h2>
              <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>{user.email}</p>
              <span style={{
                background: 'rgba(124,58,237,0.15)',
                border: '1px solid rgba(124,58,237,0.3)',
                color: '#a855f7',
                padding: '2px 12px',
                borderRadius: '999px',
                fontSize: '0.7rem',
                fontWeight: 700,
                textTransform: 'uppercase',
              }}>
                {user.role}
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {infoCard('Full Name', user.name)}
            {infoCard(`Email${copied ? ' — Copied! ✓' : ''}`, user.email, handleCopy)}
            {infoCard('Account Type', user.role)}
            {infoCard('User ID', user._id?.slice(-8) + '...')}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <button onClick={() => navigate('/dashboard')} className="btn-primary" style={{ fontSize: '0.95rem', padding: '14px' }}>
            My Dashboard
          </button>
          <button onClick={() => navigate('/sell')} style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text)',
            padding: '14px',
            borderRadius: '10px',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '0.95rem',
            transition: 'all 0.2s',
          }}>
            Sell a Ticket
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile
