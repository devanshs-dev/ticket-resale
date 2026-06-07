import { useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Navbar({ user, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const logoRef = useRef(null);

  // Logo glitch effect — fires every 500ms, triggers only if random > 0.95
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.95 && logoRef.current) {
        const shift = (Math.random() * 4 - 2).toFixed(1);
        logoRef.current.style.transform = `translateX(${shift}px)`;
        setTimeout(() => {
          if (logoRef.current) logoRef.current.style.transform = '';
        }, 100);
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      position: 'relative',
      zIndex: 'var(--z-nav)',
      padding: '16px 40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid rgba(139,0,0,0.22)',
      background: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
    }}>
      {/* LOGO */}
      <Link to="/" style={{ textDecoration: 'none' }}>
        <div
          ref={logoRef}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.9rem',
            letterSpacing: '0.15em',
            color: 'var(--blood)',
            textShadow: '0 0 20px #cc0000, 0 0 40px #8b0000, 0 0 80px rgba(139,0,0,0.5)',
            animation: 'logoFlicker 8s infinite',
            display: 'inline-block',
            transition: 'transform 80ms linear',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          TicketResale
        </div>
      </Link>

      {/* NAV LINKS */}
      <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
        {[
          { label: 'BROWSE', path: '/listings' },
          { label: 'SELL',   path: '/sell' },
          { label: 'ANALYTICS', path: '/analytics' },
        ].map(({ label, path }) => (
          <Link
            key={path}
            to={path}
            style={{
              color: isActive(path) ? 'var(--blood)' : '#666',
              fontSize: '0.82rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-mono)',
              textDecoration: 'none',
              transition: 'all 0.25s',
              borderBottom: isActive(path) ? '1px solid var(--blood)' : '1px solid transparent',
              paddingBottom: '2px',
              textShadow: isActive(path) ? '0 0 10px rgba(204,0,0,0.6)' : 'none',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--blood)'; e.currentTarget.style.textShadow = '0 0 10px rgba(204,0,0,0.5)'; }}
            onMouseLeave={e => {
              if (!isActive(path)) {
                e.currentTarget.style.color = '#666';
                e.currentTarget.style.textShadow = 'none';
              }
            }}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* RIGHT SIDE */}
      <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
        {user ? (
          <>
            {/* Dashboard link */}
            <Link
              to="/dashboard"
              style={{
                color: isActive('/dashboard') ? 'var(--blood)' : '#555',
                fontSize: '0.78rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-mono)',
                textDecoration: 'none',
                transition: 'color 0.25s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--blood)'}
              onMouseLeave={e => { if (!isActive('/dashboard')) e.currentTarget.style.color = '#555'; }}
            >
              DASHBOARD
            </Link>

            {/* Admin badge */}
            {user.role === 'admin' && (
              <Link
                to="/admin"
                style={{
                  color: 'rgba(204,0,0,0.65)',
                  fontSize: '0.68rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-mono)',
                  textDecoration: 'none',
                  border: '1px solid rgba(204,0,0,0.33)',
                  padding: '5px 12px',
                  borderRadius: '2px',
                  transition: 'all 0.2s',
                  background: 'rgba(204,0,0,0.05)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--blood)';
                  e.currentTarget.style.color = 'var(--blood)';
                  e.currentTarget.style.boxShadow = '0 0 12px rgba(204,0,0,0.2)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(204,0,0,0.33)';
                  e.currentTarget.style.color = 'rgba(204,0,0,0.65)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                ◈ ADMIN
              </Link>
            )}

            {/* Avatar */}
            <div style={{
              width: '34px', height: '34px', borderRadius: '50%',
              background: '#1a0000', border: '1px solid var(--blood)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--blood)', fontWeight: '700', fontSize: '0.85rem',
              boxShadow: '0 0 10px rgba(204,0,0,0.33)',
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
              transition: 'box-shadow 0.2s',
            }}
            onClick={() => navigate('/profile')}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 20px rgba(204,0,0,0.5)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 10px rgba(204,0,0,0.33)'}
            title={user.name || user.email}
            >
              {(user.name || user.email || 'U')[0].toUpperCase()}
            </div>

            {/* Logout */}
            <button
              onClick={onLogout}
              style={{
                color: '#444',
                fontSize: '0.75rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-mono)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--blood)'}
              onMouseLeave={e => e.currentTarget.style.color = '#444'}
            >
              LOGOUT
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              style={{
                color: '#555', fontSize: '0.78rem', letterSpacing: '0.1em',
                textTransform: 'uppercase', fontFamily: 'var(--font-mono)',
                textDecoration: 'none', transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--blood)'}
              onMouseLeave={e => e.currentTarget.style.color = '#555'}
            >
              LOGIN
            </Link>
            <Link
              to="/signup"
              style={{
                color: '#000', fontSize: '0.78rem', letterSpacing: '0.1em',
                textTransform: 'uppercase', fontFamily: 'var(--font-display)',
                textDecoration: 'none', background: 'var(--blood)',
                padding: '8px 18px', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#ff1111'; e.currentTarget.style.boxShadow = '0 0 20px rgba(204,0,0,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--blood)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              SIGN UP →
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}