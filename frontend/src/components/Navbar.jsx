import { Link, useNavigate, useLocation } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem('user'))

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  const linkStyle = (path) => ({
    color: isActive(path) ? '#a855f7' : 'var(--color-muted)',
    fontWeight: 500,
    fontSize: '0.9rem',
    textDecoration: 'none',
    padding: '6px 12px',
    borderRadius: '8px',
    background: isActive(path) ? 'rgba(168,85,247,0.1)' : 'transparent',
    transition: 'all 0.2s',
  })

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(10,10,15,0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--color-border)',
      padding: '0 32px',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <span style={{
          fontSize: '1.25rem',
          fontWeight: 800,
          background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          TicketResale
        </span>
      </Link>

      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
        <Link to="/listings" style={linkStyle('/listings')}>Browse</Link>
        <Link to="/sell" style={linkStyle('/sell')}>Sell</Link>
        <Link to="/analytics" style={linkStyle('/analytics')}>Analytics</Link>
      </div>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        {user ? (
          <>
            <Link to="/profile" style={{
              color: 'var(--color-text)',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span style={{
                width: '30px', height: '30px',
                background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.8rem', fontWeight: 700, color: '#fff',
              }}>
                {user.name.charAt(0).toUpperCase()}
              </span>
              {user.name.split(' ')[0]}
            </Link>
            {user.role === 'admin' && (
              <Link to="/admin" style={{
                color: '#f87171',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: 600,
                padding: '4px 12px',
                border: '1px solid rgba(248,113,113,0.3)',
                borderRadius: '8px',
                background: 'rgba(248,113,113,0.08)',
              }}>
                Admin
              </Link>
            )}
            <button onClick={handleLogout} style={{
              background: 'transparent',
              border: '1px solid var(--color-border)',
              color: 'var(--color-muted)',
              padding: '6px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 500,
              transition: 'all 0.2s',
            }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{
              color: 'var(--color-muted)',
              textDecoration: 'none',
              fontWeight: 500,
              fontSize: '0.9rem',
              padding: '6px 16px',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
            }}>
              Login
            </Link>
            <Link to="/signup" className="btn-primary" style={{ textDecoration: 'none', fontSize: '0.9rem', padding: '8px 18px' }}>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
