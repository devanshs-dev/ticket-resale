import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import TicketCard from '../components/TicketCard';
import api from '../api';

const CATEGORIES = ['ALL', 'CONCERTS', 'TRAVEL', 'SPORTS', 'MOVIES', 'THEATRE', 'SUBSCRIPTIONS', 'RESERVATIONS'];
const SORT_OPTIONS = [
  { value: 'recent',    label: 'NEWEST FIRST' },
  { value: 'price_asc', label: 'PRICE: LOW → HIGH' },
  { value: 'price_desc', label: 'PRICE: HIGH → LOW' },
  { value: 'trust',     label: 'TRUST SCORE' },
];

export default function Listings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('ALL');
  const [sort, setSort] = useState('recent');
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [inputVal, setInputVal] = useState(searchParams.get('q') || '');

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (query) params.set('search', query);
    if (category !== 'ALL') params.set('category', category.toLowerCase());
    if (sort) params.set('sort', sort);

    api.get(`/tickets?${params}`)
      .then(res => setTickets(res.data?.tickets || res.data || []))
      .catch(() => setTickets([]))
      .finally(() => setLoading(false));
  }, [query, category, sort]);

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(inputVal);
  };

  return (
    <div className="page-root">
      <div className="container" style={{ paddingTop: '48px', paddingBottom: '80px' }}>
        {/* Page heading */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div className="signal-dot" />
            <span style={{ color: 'rgba(204,0,0,0.5)', fontSize: '0.65rem', letterSpacing: '0.2em', fontFamily: 'var(--font-mono)' }}>
              LIVE FEED
            </span>
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            letterSpacing: '0.1em', color: '#fff', lineHeight: 1,
            textShadow: '0 0 30px rgba(204,0,0,0.2)',
          }}>
            ACTIVE <span style={{ color: 'var(--blood)', textShadow: '0 0 20px #cc0000, 0 0 40px #8b0000' }}>SIGNALS</span>
          </h1>
        </div>

        {/* Search + Sort row */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', flex: '1', minWidth: '260px', gap: '0' }}>
            <input
              className="st-input"
              style={{ flex: 1, borderRight: 'none' }}
              placeholder="SEARCH EVENTS..."
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
            />
            <button
              type="submit"
              style={{ padding: '0 20px', background: 'var(--blood)', border: '1px solid var(--blood)', color: '#000', fontFamily: 'var(--font-display)', letterSpacing: '0.1em', cursor: 'pointer' }}
            >
              SCAN →
            </button>
          </form>
          <select
            className="st-select"
            style={{ width: 'auto', minWidth: '200px' }}
            value={sort}
            onChange={e => setSort(e.target.value)}
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {/* Category pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '40px' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`cat-pill ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="section-header" style={{ marginBottom: '28px' }}>
          <div className="section-line" />
          <div className="section-title">
            {loading ? '// SCANNING...' : `// ${tickets.length} RESULTS`}
          </div>
          <div className="section-line reverse" />
        </div>

        {/* Results */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div className="st-spinner" />
            <span style={{ color: '#333', fontSize: '0.7rem', letterSpacing: '0.15em', fontFamily: 'var(--font-mono)' }}>
              SCANNING THE UPSIDE DOWN...
            </span>
          </div>
        ) : tickets.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-title">NO SIGNALS DETECTED</div>
            <div className="empty-state-sub">Try adjusting your frequency</div>
          </div>
        ) : (
          <div className="ticket-grid">
            {tickets.map((ticket, i) => (
              <TicketCard key={ticket._id || ticket.id || i} ticket={ticket} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
