import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer style={{
      background: 'var(--color-surface)',
      borderTop: '1px solid var(--color-border)',
      padding: '48px 32px 24px',
      marginTop: '40px',
    }}>
      <div style={{ maxWidth: '1024px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px', marginBottom: '40px' }}>
          <div>
            <span style={{
              fontSize: '1.2rem', fontWeight: 800,
              background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              display: 'block', marginBottom: '12px',
            }}>
              TicketResale
            </span>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>
              Buy and sell tickets safely. Concerts, travel, sports, movies and more.
            </p>
          </div>

          {[
            {
              title: 'Browse',
              links: [
                { label: 'Concerts', to: '/listings?category=Concert' },
                { label: 'Travel', to: '/listings?category=Travel' },
                { label: 'Sports', to: '/listings?category=Sports' },
                { label: 'Movies', to: '/listings?category=Movies' },
              ]
            },
            {
              title: 'Account',
              links: [
                { label: 'Login', to: '/login' },
                { label: 'Sign Up', to: '/signup' },
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Sell a Ticket', to: '/sell' },
              ]
            },
            {
              title: 'More',
              links: [
                { label: 'Analytics', to: '/analytics' },
              ],
              extra: ['Made by Devansh Singh', 'MUJ 2026']
            }
          ].map((col) => (
            <div key={col.title}>
              <p style={{ color: 'var(--color-text)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '16px' }}>
                {col.title}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {col.links.map((l) => (
                  <Link key={l.label} to={l.to} style={{
                    color: 'var(--color-muted)', textDecoration: 'none',
                    fontSize: '0.85rem', transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--color-muted)'}
                  >
                    {l.label}
                  </Link>
                ))}
                {col.extra?.map((t) => (
                  <span key={t} style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{
          borderTop: '1px solid var(--color-border)',
          paddingTop: '20px',
          textAlign: 'center',
          color: 'var(--color-muted)',
          fontSize: '0.8rem',
        }}>
          © 2026 TicketResale. Built with React, Node.js, MongoDB, PostgreSQL and ML.
        </div>
      </div>
    </footer>
  )
}

export default Footer
