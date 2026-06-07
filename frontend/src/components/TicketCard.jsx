import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const CATEGORY_MAP = {
  concert:       { topClass: 'card-top-concert',  label: 'CONCERT',  ghost: 'CONCERT' },
  sports:        { topClass: 'card-top-sports',   label: 'SPORTS',   ghost: 'SPORTS'  },
  travel:        { topClass: 'card-top-travel',   label: 'TRAVEL',   ghost: 'TRAVEL'  },
  movies:        { topClass: 'card-top-movies',   label: 'MOVIE',    ghost: 'MOVIE'   },
  theatre:       { topClass: 'card-top-theatre',  label: 'THEATRE',  ghost: 'STAGE'   },
  subscriptions: { topClass: 'card-top-subs',     label: 'SUBS',     ghost: 'SUBS'    },
  reservations:  { topClass: 'card-top-concert',  label: 'RESERVE',  ghost: 'RSVP'    },
};

export default function TicketCard({ ticket, index = 0 }) {
  const navigate = useNavigate();
  const cardRef = useRef(null);

  const cat = CATEGORY_MAP[(ticket.category || '').toLowerCase()] || CATEGORY_MAP.concert;
  const trustScore = ticket.trustScore ?? ticket.trust_score ?? Math.floor(Math.random() * 15) + 82;

  // 3D tilt on mousemove
  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transition = 'none';
    card.style.transform = `translateY(-5px) rotateX(${(-y * 7).toFixed(2)}deg) rotateY(${(x * 7).toFixed(2)}deg)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transition = 'all 0.3s cubic-bezier(0.16,1,0.3,1)';
    card.style.transform = '';
  };

  const formatPrice = (price) => {
    if (!price) return '—';
    return Number(price).toLocaleString('en-IN');
  };

  return (
    <div
      ref={cardRef}
      className="ticket-card"
      style={{ animationDelay: `${index * 80}ms` }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => navigate(`/tickets/${ticket._id || ticket.id}`)}
    >
      {/* TOP BANNER */}
      <div className={`ticket-card-top ${cat.topClass}`}>
        {/* Scanlines */}
        <div className="scanline-overlay" />
        {/* Ghost background text */}
        <div className="card-ghost-text">{cat.ghost}</div>
      </div>

      {/* BODY */}
      <div className="ticket-card-body">
        {/* Trust badge */}
        <div className="trust-badge" style={{ marginBottom: '8px' }}>
          ■ TRUST SIGNAL: {trustScore}/100
        </div>

        {/* Category + signal bars */}
        <div className="ticket-card-category">
          <div className="signal-bars">
            <span /><span /><span /><span /><span />
          </div>
          {cat.label}
        </div>

        {/* Title */}
        <div className="ticket-card-title">{ticket.title || ticket.name || 'Untitled Event'}</div>

        {/* Meta */}
        {ticket.date && (
          <div className="ticket-card-meta">■ {new Date(ticket.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}</div>
        )}
        {(ticket.venue || ticket.location) && (
          <div className="ticket-card-meta">■ {(ticket.venue || ticket.location || '').toUpperCase()}</div>
        )}
        {ticket.quantity > 1 && (
          <div className="ticket-card-meta" style={{ color: 'rgba(204,0,0,0.5)' }}>■ {ticket.quantity} AVAILABLE</div>
        )}

        {/* Footer */}
        <div className="ticket-card-footer">
          <div className="ticket-card-price">
            ₹{formatPrice(ticket.price)}
            <small> /TICKET</small>
          </div>
          <button
            className="btn-ghost"
            style={{ padding: '7px 14px', fontSize: '0.75rem' }}
            onClick={(e) => { e.stopPropagation(); navigate(`/tickets/${ticket._id || ticket.id}`); }}
          >
            ENTER →
          </button>
        </div>
      </div>
    </div>
  );
}