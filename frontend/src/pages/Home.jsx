import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TicketCard from '../components/TicketCard';
import api from '../api';

// ── CHRISTMAS LIGHTS ──────────────────────────────────────
const BULB_COLORS = ['#ff0000','#ff4400','#ffaa00','#ff6600','#cc0000','#ff2200','#ffcc00','#ff0066','#cc4400','#ff8800','#00ff00','#0044ff'];
const WIRE_WIDTHS = [20,16,22,18,24,14,20,18,16,22,20,18];
const LETTERS = ['H','A','W','K','I','N','S',' ','L','I','V','E'];

function ChristmasLights() {
  const [bulbStates, setBulbStates] = useState(Array(12).fill(false));
  const phaseRef = useRef(0);
  const liRef = useRef(0);
  const timerRef = useRef(null);

  useEffect(() => {
    // After 4s switch to phase 1
    const phaseSwitch = setTimeout(() => { phaseRef.current = 1; }, 4000);

    function animate() {
      if (phaseRef.current === 0) {
        // Random flicker phase
        setBulbStates(prev => {
          const next = Array(12).fill(false);
          const on = Math.floor(Math.random() * 12);
          next[on] = true;
          if (Math.random() > 0.7) next[(on + 1) % 12] = true;
          return next;
        });
        timerRef.current = setTimeout(animate, 80 + Math.random() * 200);
      } else {
        // Spell out HAWKINS LIVE
        const li = liRef.current;
        setBulbStates(prev => {
          const next = Array(12).fill(false);
          if (li < LETTERS.length && LETTERS[li] !== ' ') {
            next[li % 12] = true;
          }
          return next;
        });
        liRef.current = (li + 1) % LETTERS.length;
        timerRef.current = setTimeout(animate, 300);
      }
    }
    animate();

    return () => {
      clearTimeout(phaseSwitch);
      clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="lights-row">
        {BULB_COLORS.map((color, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
            {i > 0 && <div className="bulb-wire" style={{ width: WIRE_WIDTHS[i] + 'px' }} />}
            <div
              className={`light-bulb ${bulbStates[i] ? 'on' : ''}`}
              style={{ '--bulb-color': color }}
            />
          </div>
        ))}
      </div>
      <div className="lights-label">// Live marketplace signal</div>
    </div>
  );
}

// ── PARTICLES CANVAS ──────────────────────────────────────
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
      particles = Array.from({ length: 120 }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight * 3,
        r: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.8 - 0.2,
        o: Math.random() * 0.6 + 0.1,
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
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10)               p.y = window.innerHeight + 10;
        if (p.x < 0)                 p.x = window.innerWidth;
        if (p.x > window.innerWidth) p.x = 0;
      });
      animId = requestAnimationFrame(draw);
    }

    resize();
    initParticles();
    draw();

    const onResize = () => { resize(); };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="particles"
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    />
  );
}

// ── TV FLICKER OVERLAY ────────────────────────────────────
function TVFlicker() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 2600);
    return () => clearTimeout(t);
  }, []);
  if (!visible) return null;
  return <div id="flicker-overlay" />;
}

// ── CATEGORIES ────────────────────────────────────────────
const CATEGORIES = ['ALL', 'CONCERTS', 'TRAVEL', 'SPORTS', 'MOVIES', 'THEATRE', 'SUBSCRIPTIONS', 'RESERVATIONS'];

function JoyceWall() {
  const message = "HELP ME";
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const [lit, setLit] = useState(-1);
  const [phase, setPhase] = useState(0);
  const msgRef = useRef(0);

  useEffect(() => {
    let timer;
    function animate() {
      if (phase === 0) {
        setLit(Math.floor(Math.random() * 26));
        timer = setTimeout(animate, 120 + Math.random() * 180);
      } else {
        const idx = msgRef.current;
        const char = message[idx];
        const li = alphabet.indexOf(char);
        setLit(li);
        msgRef.current = (idx + 1) % message.length;
        timer = setTimeout(animate, 500);
      }
    }
    const phaseSwitch = setTimeout(() => setPhase(1), 3000);
    animate();
    return () => { clearTimeout(timer); clearTimeout(phaseSwitch); };
  }, [phase]);

  const colors = ['#ff0000','#ff4400','#ffaa00','#ff6600','#00ff00','#0044ff','#ff00ff','#ffffff','#ff2200','#ffcc00','#ff0066','#cc4400','#ff8800','#00ffff','#ff4488','#ffff00','#ff0044','#44ff00','#0088ff','#ff8844','#88ff00','#ff0088','#00ff88','#8800ff','#ff4400','#00ff44'];

  return (
    <div style={{ padding: '48px 0', borderTop: '1px solid rgba(204,0,0,0.13)', background: 'rgba(0,0,0,0.6)' }}>
      <div className="container">
        <div className="section-header" style={{ marginBottom: '32px' }}>
          <div className="section-line" />
          <div className="section-title">// JOYCE'S WALL</div>
          <div className="section-line reverse" />
        </div>

        <div style={{ background: '#0a0000', border: '1px solid rgba(204,0,0,0.2)', padding: '32px 24px', position: 'relative', overflow: 'hidden' }}>
          <div className="static-noise" style={{ opacity: 0.04 }} />

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
            {alphabet.split('').map((letter, i) => {
              const isLit = lit === i;
              return (
                <div key={i} style={{
                  width: '42px', height: '42px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-display)', fontSize: '1.3rem',
                  color: isLit ? colors[i] : 'rgba(204,0,0,0.12)',
                  textShadow: isLit ? `0 0 10px ${colors[i]}, 0 0 20px ${colors[i]}, 0 0 40px ${colors[i]}` : 'none',
                  transition: 'all 0.08s ease',
                  border: '1px solid',
                  borderColor: isLit ? colors[i] + '44' : 'rgba(204,0,0,0.08)',
                  background: isLit ? colors[i] + '11' : 'transparent',
                }}>
                  {letter}
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: '20px', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'rgba(204,0,0,0.3)', letterSpacing: '0.15em', position: 'relative', zIndex: 2 }}>
            // SIGNALS FROM THE OTHER SIDE
          </div>
        </div>
      </div>
    </div>
  );
}

// ── MAIN HOME ─────────────────────────────────────────────
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
        {/* ── HERO ─────────────────────────────────────── */}
        <section style={{
          position: 'relative', zIndex: 5,
          minHeight: '88vh',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', padding: '60px 24px',
          overflow: 'hidden',
        }}>
          {/* Backgrounds */}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 40%, rgba(26,0,0,0.55) 0%, #000 70%)' }} />
          <div className="upside-down-sky" />
          <div className="static-noise" />

          {/* Signal badge */}
          <div className="signal-badge" style={{ marginBottom: '32px', position: 'relative', zIndex: 2 }}>
            <div className="signal-dot" />
            SIGNAL DETECTED — HAWKINS, IN
          </div>

          {/* H1 */}
          <h1 style={{
            position: 'relative', zIndex: 2,
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3.5rem, 9vw, 7.5rem)',
            letterSpacing: '0.08em',
            lineHeight: 0.95,
            marginBottom: '8px',
            color: '#fff',
            textShadow: '0 0 40px rgba(204,0,0,0.33)',
            animation: 'titleFlicker 10s infinite',
          }}>
            BUY &amp; SELL
            <span style={{
              display: 'block',
              color: 'var(--blood)',
              textShadow: '0 0 30px #cc0000, 0 0 60px #8b0000, 0 0 100px rgba(139,0,0,0.5)',
              animation: 'redGlow 3s ease-in-out infinite alternate',
            }}>
              TICKETS
            </span>
            SAFELY
          </h1>

          {/* Subtitle */}
          <p style={{
            position: 'relative', zIndex: 2,
            color: '#444', fontSize: '0.82rem', letterSpacing: '0.22em',
            textTransform: 'uppercase', marginBottom: '48px',
            fontFamily: 'var(--font-mono)', marginTop: '20px',
          }}>
            ML FRAUD DETECTION{' '}
            <span style={{ color: 'rgba(204,0,0,0.5)' }}>///</span>{' '}
            REAL-TIME{' '}
            <span style={{ color: 'rgba(204,0,0,0.5)' }}>///</span>{' '}
            QR VERIFIED
          </p>

          {/* Search */}
          <form
            onSubmit={handleSearch}
            style={{ position: 'relative', zIndex: 2, display: 'flex', maxWidth: '580px', width: '100%', marginBottom: '64px' }}
          >
            <input
              className="st-input"
              style={{ flex: 1, borderRight: 'none', color: 'var(--blood)' }}
              placeholder="SEARCH EVENTS, CONCERTS, TRAVEL..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <button
              type="submit"
              style={{
                padding: '0 28px',
                background: 'var(--blood)', border: '1px solid var(--blood)',
                color: '#000', fontFamily: 'var(--font-display)',
                fontSize: '1rem', letterSpacing: '0.1em', cursor: 'pointer',
                transition: 'all 0.2s', whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#ff1111'; e.currentTarget.style.boxShadow = '0 0 30px rgba(204,0,0,0.6)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--blood)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              ENTER →
            </button>
          </form>

          {/* Christmas lights */}
          <div className="hero-flex-row" style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '60px', width: '100%', maxWidth: '1000px' }}>
            <ChristmasLights />
          </div>
        </section>

        <div className="divider-h" />
        <JoyceWall />

        {/* ── LISTINGS ────────────────────────────────── */}
        <section style={{ position: 'relative', zIndex: 5, padding: '60px 0' }}>
          <div className="container">
            {/* Categories header */}
            <div className="section-header">
              <div className="section-line" />
              <div className="section-title">// TRANSMISSIONS</div>
              <div className="section-line reverse" />
            </div>

            {/* Category pills */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '52px' }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  className={`cat-pill ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Active signals header */}
            <div className="section-header">
              <div className="section-line" />
              <div className="section-title">// ACTIVE SIGNALS</div>
              <div className="section-line reverse" />
            </div>

            {/* Ticket grid */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '80px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <div className="st-spinner" />
                <span style={{ color: '#333', fontSize: '0.72rem', letterSpacing: '0.15em', fontFamily: 'var(--font-mono)' }}>
                  SCANNING SIGNALS...
                </span>
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

            {/* View all */}
            {!loading && filteredTickets.length > 0 && (
              <div style={{ textAlign: 'center', marginTop: '48px' }}>
                <button
                  className="btn-ghost"
                  style={{ fontSize: '0.85rem', padding: '14px 40px' }}
                  onClick={() => navigate('/listings')}
                >
                  VIEW ALL SIGNALS →
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────── */}
        <section style={{
          position: 'relative', zIndex: 5,
          textAlign: 'center', padding: '80px 24px',
          borderTop: '1px solid rgba(204,0,0,0.13)',
          background: 'radial-gradient(ellipse at 50% 0%, rgba(26,0,0,0.22), transparent 60%)',
        }}>
          <div className="static-noise" style={{ opacity: 0.015 }} />
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            letterSpacing: '0.1em', color: '#fff', marginBottom: '12px',
            textShadow: '0 0 40px rgba(204,0,0,0.33)',
          }}>
            SOMETHING YOU CAN'T USE?
          </h2>
          <p style={{ color: '#333', fontSize: '0.78rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '36px', fontFamily: 'var(--font-mono)' }}>
            // List your ticket. Cross into the marketplace.
          </p>
          <button
            className="btn-red"
            style={{ fontSize: '1.1rem', padding: '18px 52px' }}
            onClick={() => navigate('/sell')}
          >
            LIST NOW →
          </button>
        </section>
      </div>
    </>
  );
}
