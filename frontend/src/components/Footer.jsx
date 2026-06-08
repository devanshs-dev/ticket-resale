import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="st-footer" style={{ position: 'relative', zIndex: 5 }}>
      {/* Top gradient line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(204,0,0,0.44), transparent)' }} />

      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '48px', marginBottom: '48px' }}>
          {/* Brand */}
          <div>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: '1.6rem', letterSpacing: '0.15em',
              color: 'var(--blood)', textShadow: '0 0 20px rgba(204,0,0,0.5)',
              marginBottom: '12px',
            }}>
              TicketResale
            </div>
            <p style={{ color: '#333', fontSize: '0.72rem', letterSpacing: '0.08em', lineHeight: '1.8', fontFamily: 'var(--font-mono)' }}>
              // ML-powered marketplace<br />
              // Hawkins, Indiana — Est. 1983<br />
              // Cross into the marketplace.
            </p>
            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00cc44', boxShadow: '0 0 6px #00cc44', animation: 'blink 2s infinite' }} />
              <span style={{ color: '#333', fontSize: '0.65rem', letterSpacing: '0.1em', fontFamily: 'var(--font-mono)' }}>SIGNAL ACTIVE</span>
            </div>
          </div>

          {/* Links */}
          <div>
            <div style={{ color: 'rgba(204,0,0,0.6)', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '16px', fontFamily: 'var(--font-mono)' }}>
              // TRANSMISSIONS
            </div>
            {[
              { label: 'Browse Listings', path: '/listings' },
              { label: 'Sell a Ticket',   path: '/sell' },
              { label: 'Analytics',       path: '/analytics' },
              { label: 'Dashboard',       path: '/dashboard' },
            ].map(({ label, path }) => (
              <div key={path} style={{ marginBottom: '8px' }}>
                <Link
                  to={path}
                  style={{
                    color: '#333', fontSize: '0.75rem', letterSpacing: '0.06em',
                    fontFamily: 'var(--font-mono)', textDecoration: 'none', transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--blood)'}
                  onMouseLeave={e => e.currentTarget.style.color = '#333'}
                >
                  &#9632; {label}
                </Link>
              </div>
            ))}
          </div>

          {/* System status */}
          <div>
            <div style={{ color: 'rgba(204,0,0,0.6)', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '16px', fontFamily: 'var(--font-mono)' }}>
              // SYSTEM STATUS
            </div>
            {[
              { label: 'ML Fraud Detection', status: 'ONLINE' },
              { label: 'Real-time Socket',    status: 'ONLINE' },
              { label: 'QR Verification',     status: 'ONLINE' },
              { label: 'Database Cluster',    status: 'ONLINE' },
            ].map(({ label, status }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ color: '#333', fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>{label}</span>
                <span style={{ color: '#00cc44', fontSize: '0.6rem', letterSpacing: '0.1em', fontFamily: 'var(--font-mono)' }}>{status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(204,0,0,0.1)', paddingTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <span style={{ color: '#222', fontSize: '0.65rem', letterSpacing: '0.1em', fontFamily: 'var(--font-mono)' }}>
            © 2026 TICKETRESALE // HAWKINS UNDERGROUND NETWORK // ALL SIGNALS RESERVED
          </span>
          <span style={{ color: '#222', fontSize: '0.6rem', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)' }}>
            ML ▸ SKLEARN + FLASK // REALTIME ▸ SOCKET.IO // DB ▸ MONGODB + POSTGRESQL
          </span>
        </div>
      </div>
    </footer>
  );
}
