import { useEffect, useState, useCallback } from 'react';

/**
 * SignalToast
 * Drop-in global toast system with Stranger Things vocabulary.
 * Connects to Socket.io for real-time "NEW SIGNAL DETECTED" events.
 *
 * Usage: <SignalToast socket={socket} />
 *
 * Also exposes window.showSignalToast(msg, type) for manual triggers.
 * Types: 'signal' | 'infected' | 'gate' | 'success' | 'info'
 */

const ICONS = {
  signal:   '■',
  infected: '⚠',
  gate:     '◈',
  success:  '✓',
  info:     '///',
};

const COLORS = {
  signal:   'var(--blood)',
  infected: '#ff4400',
  gate:     '#cc0000',
  success:  '#00cc44',
  info:     '#444',
};

let toastIdCounter = 0;

export default function SignalToast({ socket }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'signal', duration = 4500) => {
    const id = ++toastIdCounter;
    setToasts(prev => [...prev.slice(-4), { id, message, type, duration }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  // Expose globally for manual use from anywhere
  useEffect(() => {
    window.showSignalToast = addToast;
    return () => { delete window.showSignalToast; };
  }, [addToast]);

  // Socket.io listeners
  useEffect(() => {
    if (!socket) return;

    socket.on('ticket:new', (ticket) => {
      addToast(
        `NEW SIGNAL DETECTED — ${(ticket.title || 'UNKNOWN EVENT').toUpperCase()}`,
        'gate',
        5000
      );
    });

    socket.on('ticket:sold', (ticket) => {
      addToast(
        `■ SIGNAL CLOSED — ${(ticket.title || 'TICKET').toUpperCase()} CLAIMED`,
        'success',
        4000
      );
    });

    socket.on('ticket:flagged', (ticket) => {
      addToast(
        `⚠ INFECTED SIGNAL FLAGGED — ${(ticket.title || 'LISTING').toUpperCase()}`,
        'infected',
        6000
      );
    });

    return () => {
      socket.off('ticket:new');
      socket.off('ticket:sold');
      socket.off('ticket:flagged');
    };
  }, [socket, addToast]);

  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '28px',
      right: '24px',
      zIndex: 500,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      maxWidth: '340px',
      width: '100%',
    }}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            background: '#050000',
            border: '1px solid rgba(204,0,0,0.35)',
            borderLeft: `3px solid ${COLORS[toast.type] || 'var(--blood)'}`,
            padding: '13px 16px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.73rem',
            letterSpacing: '0.05em',
            color: '#ccc',
            boxShadow: `0 0 20px rgba(204,0,0,0.12), 4px 0 0 ${COLORS[toast.type] || 'var(--blood)'}`,
            animation: 'slideUp 0.3s cubic-bezier(0.16,1,0.3,1)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer',
          }}
          onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
        >
          {/* Progress bar */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0,
            height: '2px',
            background: COLORS[toast.type] || 'var(--blood)',
            animation: `toastProgress ${toast.duration}ms linear forwards`,
            opacity: 0.5,
          }} />

          <span style={{ color: COLORS[toast.type] || 'var(--blood)', flexShrink: 0, marginTop: '1px' }}>
            {ICONS[toast.type] || '■'}
          </span>
          <span style={{ lineHeight: 1.5 }}>{toast.message}</span>

          <style>{`@keyframes toastProgress { from{width:100%} to{width:0%} }`}</style>
        </div>
      ))}
    </div>
  );
}
