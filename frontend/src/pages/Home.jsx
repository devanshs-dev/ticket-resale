import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TicketCard from '../components/TicketCard';
import api from '../api';

const BULB_COLORS = ['#ff0000','#ff4400','#ffaa00','#ff6600','#cc0000','#ff2200','#ffcc00','#ff0066','#cc4400','#ff8800','#00ff00','#0044ff'];
const WIRE_WIDTHS = [20,16,22,18,24,14,20,18,16,22,20,18];
const LETTERS = ['H','A','W','K','I','N','S',' ','L','I','V','E'];
const CATEGORIES = ['ALL', 'CONCERTS', 'TRAVEL', 'SPORTS', 'MOVIES', 'THEATRE', 'SUBSCRIPTIONS', 'RESERVATIONS'];

function ChristmasLights() {
  const [bulbStates, setBulbStates] = useState(Array(12).fill(false));
  const phaseRef = useRef(0);
  const liRef = useRef(0);
  const timerRef = useRef(null);

  useEffect(() => {
    const phaseSwitch = setTimeout(() => { phaseRef.current = 1; }, 4000);
    function animate() {
      if (phaseRef.current === 0) {
        setBulbStates(() => {
          const next = Array(12).fill(false);
          const on = Math.floor(Math.random() * 12);
          next[on] = true;
          if (Math.random() > 0.7) next[(on + 1) % 12] = true;
          return next;
        });
        timerRef.current = setTimeout(animate, 80 + Math.random() * 200);
      } else {
        const li = liRef.current;
        setBulbStates(() => {
          const next = Array(12).fill(false);
          if (li < LETTERS.length && LETTERS[li] !== ' ') next[li % 12] = true;
          return next;
        });
        liRef.current = (li + 1) % LETTERS.length;
        timerRef.current = setTimeout(animate, 300);
      }
    }
    animate();
    return () => { clearTimeout(phaseSwitch); clearTimeout(timerRef.current); };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="lights-row">
        {BULB_COLORS.map((color, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
            {i > 0 && <div className="bulb-wire" style={{ width: WIRE_WIDTHS[i] + 'px' }} />}
            <div className={`light-bulb ${bulbStates[i] ? 'on' : ''}`} style={{ '--bulb-color': color }} />
          </div>
        ))}
      </div>
      <div className="lights-label">// Live marketplace signal</div>
    </div>
  );
}

function ParticleCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;
    let particles = [];
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = Math.max(document.body.scrollHeight, window.innerHeight);
    }
    function initParticles() {
      particles = Array.from({ length: 250 }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight * 3,
        r: Math.random() * 3 + 0.5,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -Math.random() * 1.2 - 0.3,
        o: Math.random() * 0.8 + 0.2,
        flicker: Math.random() * Math.PI * 2,
      }));
    }
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.flicker += 0.02;
        const fo = p.o * (0.7 + 0.3 * Math.sin(p.flicker));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,0,0,${fo.toFixed(3)})`;
        ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.y < -10) p.y = window.innerHeight + 10;
        if (p.x < 0) p.x = window.innerWidth;
        if (p.x > window.innerWidth) p.x = 0;
      });
      animId = requestAnimationFrame(draw);
    }
    resize(); initParticles(); draw();
    window.addEventListener('resize', resize);
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animId); };
  }, []);
  return <canvas ref={canvasRef} id="particles" style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />;
}

function TVFlicker() {
  const [visible, setVisible] = useState(true);
  useEffect(() => { const t = setTimeout(() => setVisible(false), 2600); return () => clearTimeout(t); }, []);
  if (!visible) return null;
  return <div id="flicker-overlay" />;
}

function StatCounters() {
  const [counts, setCounts] = useState({ tickets: 0, sold: 0, agents: 0 });
  const targets = { tickets: 847, sold: 234, agents: 1203 };
  useEffect(() => {
    const steps = 60;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const ease = 1 - Math.pow(1 - step / steps, 3);
      setCounts({
        tickets: Math.floor(targets.tickets * ease),
        sold: Math.floor(targets.sold * ease),
        agents: Math.floor(targets.agents * ease),
      });
      if (step >= steps) clearInterval(timer);
    }, 2000 / steps);
    return () => clearInterval(timer);
  }, []);

  return (
    <section style={{ position: 'relative', zIndex: 5, padding: '60px 0', borderTop: '1px solid rgba(204,0,0,0.13)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {[
            { label: 'TICKETS LISTED', value: counts.tickets },
            { label: 'SOLD', value: counts.sold },
            { label: 'AGENTS', value: counts.agents },
          ].map((s) => (
            <div key={s.label} style={{ background: 'rgba(204,0,0,0.04)', border: '1px solid rgba(204,0,0,0.13)', padding: '32px 24px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '3.5rem', color: 'var(--blood)', textShadow: '0 0 20px rgba(204,0,0,0.4)', letterSpacing: '0.05em', lineHeight: 1 }}>
                {s.value.toLocaleString('en-IN')}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#444', letterSpacing: '0.15em', marginTop: '8px' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ActivityTicker() {
  const activities = [
    'RAHUL just listed Coldplay tickets',
    'PRIYA bought IPL Final 2026',
    'AMIT listed Delhi to Mumbai Rajdhani',
    'SNEHA listed Netflix Premium 3 months',
    '12 ACTIVE SIGNALS right now',
    'VIKRAM listed Goa Beach Resort',
    'NEHA bought Arijit Singh Live',
  ];
  const text = activities.map(a => '■ ' + a).join('   ·   ') + '   ·   ';
  return (
    <div style={{ position: 'relative', zIndex: 5, borderTop: '1px solid rgba(204,0,0,0.15)', borderBottom: '1px solid rgba(204,0,0,0.15)', background: 'rgba(204,0,0,0.04)', padding: '10px 0', overflow: 'hidden' }}>
      <div style={{ display: 'flex', whiteSpace: 'nowrap' }}>
        <div style={{ display: 'inline-block', animation: 'tickerScroll 20s linear infinite', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'rgba(204,0,0,0.6)', letterSpacing: '0.08em' }}>
          {text}{text}
        </div>
      </div>
      <style>{`@keyframes tickerScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/tickets?limit=8')
      .then(res => setTickets(res.data?.tickets || res.data || []))
      .catch(() => setTickets([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/listings?q=${encodeURIComponent(query)}`);
  };

  const filteredTickets = activeCategory === 'ALL'
    ? tickets
    : tickets.filter(t => (t.category || '').toLowerCase() === activeCategory.toLowerCase());

  return (
    <>
      <TVFlicker />
      <ParticleCanvas />
      <div className="page-root">

        {/* HERO */}
        <section style={{ position: 'relative', zIndex: 5, minHeight: '88vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '60px 24px', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 40%, rgba(26,0,0,0.55) 0%, #000 70%)' }} />
          <div className="upside-down-sky" />
          <div className="static-noise" />

          <div className="signal-badge" style={{ marginBottom: '32px', position: 'relative', zIndex: 2 }}>
            <div className="signal-dot" />
            SIGNAL DETECTED — HAWKINS, IN
          </div>

          {/* Hero flex row */}
          <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '60px', width: '100%', maxWidth: '1000px' }}>

            {/* Left — text + search */}
            <div style={{ flex: 1, textAlign: 'left' }}>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3.5rem, 9vw, 7.5rem)', letterSpacing: '0.08em', lineHeight: 0.95, marginBottom: '8px', color: '#fff', textShadow: '0 0 40px rgba(204,0,0,0.33)', animation: 'titleFlicker 10s infinite' }}>
                BUY &amp; SELL
                <span style={{ display: 'block', color: 'var(--blood)', textShadow: '0 0 30px #cc0000, 0 0 60px #8b0000', animation: 'redGlow 3s ease-in-out infinite alternate' }}>
                  TICKETS
                </span>
                SAFELY
              </h1>
              <p style={{ color: '#444', fontSize: '0.82rem', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '32px', fontFamily: 'var(--font-mono)', marginTop: '20px' }}>
                ML FRAUD DETECTION <span style={{ color: 'rgba(204,0,0,0.5)' }}>///</span> REAL-TIME <span style={{ color: 'rgba(204,0,0,0.5)' }}>///</span> QR VERIFIED
              </p>
              <form onSubmit={handleSearch} style={{ display: 'flex', maxWidth: '480px', width: '100%', marginBottom: '24px' }}>
                <input className="st-input" style={{ flex: 1, borderRight: 'none', color: 'var(--blood)' }} placeholder="SEARCH EVENTS, CONCERTS, TRAVEL..." value={query} onChange={e => setQuery(e.target.value)} />
                <button type="submit" style={{ padding: '0 28px', background: 'var(--blood)', border: '1px solid var(--blood)', color: '#000', fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '0.1em', cursor: 'pointer', whiteSpace: 'nowrap' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#ff1111'; e.currentTarget.style.boxShadow = '0 0 30px rgba(204,0,0,0.6)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--blood)'; e.currentTarget.style.boxShadow = 'none'; }}>
                  ENTER →
                </button>
              </form>
            </div>

            {/* Right — floating card */}
            <div style={{ flexShrink: 0, transform: 'rotate(3deg) translateY(-12px)', filter: 'drop-shadow(0 12px 40px rgba(204,0,0,0.25))' }}>
              <div style={{ background: '#0f0000', border: '1px solid rgba(204,0,0,0.4)', borderRadius: '4px', width: '200px', overflow: 'hidden' }}>
                <div style={{ background: 'linear-gradient(135deg, #1a0000, #330000)', height: '80px', position: 'relative', display: 'flex', alignItems: 'flex-end', padding: '8px 12px' }}>
                  <div style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'rgba(204,0,0,0.13)', letterSpacing: '0.08em' }}>CONCERT</div>
                  <div style={{ background: 'rgba(0,204,68,0.1)', border: '1px solid rgba(0,204,68,0.25)', color: '#00cc44', fontFamily: 'var(--font-mono)', fontSize: '0.55rem', padding: '2px 6px', letterSpacing: '0.08em' }}>TRUST: 97/100</div>
                </div>
                <div style={{ padding: '14px' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#ddd', marginBottom: '6px' }}>Coldplay World Tour</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'rgba(204,0,0,0.5)', marginBottom: '10px' }}>■ DY PATIL STADIUM</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: '#fff' }}>₹4,500</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ position: 'relative', zIndex: 2, marginTop: '48px' }}>
            <ChristmasLights />
          </div>
        </section>

        <div className="divider-h" />

        {/* LISTINGS */}
        <section style={{ position: 'relative', zIndex: 5, padding: '60px 0' }}>
          <div className="container">
            <div className="section-header">
              <div className="section-line" />
              <div className="section-title">// TRANSMISSIONS</div>
              <div className="section-line reverse" />
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '52px' }}>
              {CATEGORIES.map(cat => (
                <button key={cat} className={`cat-pill ${activeCategory === cat ? 'active' : ''}`} onClick={() => setActiveCategory(cat)}>
                  {cat}
                </button>
              ))}
            </div>
            <div className="section-header">
              <div className="section-line" />
              <div className="section-title">// ACTIVE SIGNALS</div>
              <div className="section-line reverse" />
            </div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '80px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <div className="st-spinner" />
                <span style={{ color: '#333', fontSize: '0.72rem', letterSpacing: '0.15em', fontFamily: 'var(--font-mono)' }}>SCANNING SIGNALS...</span>
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-title">NO SIGNALS DETECTED</div>
                <div className="empty-state-sub">The upside down is quiet right now</div>
              </div>
            ) : (
              <div className="ticket-grid">
                {filteredTickets.map((ticket, i) => (
                  <TicketCard key={ticket._id || ticket.id || i} ticket={ticket} index={i} />
                ))}
              </div>
            )}
            {!loading && filteredTickets.length > 0 && (
              <div style={{ textAlign: 'center', marginTop: '48px' }}>
                <button className="btn-ghost" style={{ fontSize: '0.85rem', padding: '14px 40px' }} onClick={() => navigate('/listings')}>
                  VIEW ALL SIGNALS →
                </button>
              </div>
            )}
          </div>
        </section>

        {/* STAT COUNTERS */}
        <StatCounters />

        {/* ACTIVITY TICKER */}
        <ActivityTicker />

        {/* CTA */}
        <section style={{ position: 'relative', zIndex: 5, textAlign: 'center', padding: '80px 24px', borderTop: '1px solid rgba(204,0,0,0.13)', background: 'radial-gradient(ellipse at 50% 0%, rgba(26,0,0,0.22), transparent 60%)' }}>
          <div className="static-noise" style={{ opacity: 0.015 }} />
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '0.1em', color: '#fff', marginBottom: '12px', textShadow: '0 0 40px rgba(204,0,0,0.33)' }}>
            SOMETHING YOU CANT USE?
          </h2>
          <p style={{ color: '#333', fontSize: '0.78rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '36px', fontFamily: 'var(--font-mono)' }}>
            // List your ticket. Cross into the marketplace.
          </p>
          <button className="btn-red" style={{ fontSize: '1.1rem', padding: '18px 52px' }} onClick={() => navigate('/sell')}>
            LIST NOW →
          </button>
        </section>

      </div>
    </>
  );
}