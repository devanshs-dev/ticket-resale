import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import API from '../api'
import WillsWall from '../components/WillsWall'

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'))
  const [orders, setOrders] = useState([])
  const [sales, setSales] = useState([])
  const [tab, setTab] = useState('orders')
  const mono = "'Share Tech Mono', monospace"
  const display = "'Bebas Neue', cursive"

  useEffect(() => {
    Promise.all([API.get('/orders/my-orders'), API.get('/orders/my-sales')])
      .then(([o, s]) => { setOrders(o.data); setSales(s.data) })
      .catch(() => {})
  }, [])

  if (!user) return <div style={{ padding:'40px',color:'rgba(204,0,0,0.5)',fontFamily:mono }}>ACCESS DENIED</div>

  const totalEarned = sales.reduce((s, o) => s + o.price, 0)
  const active = tab === 'orders' ? orders : sales

  const statCards = [
    { label:'SIGNALS ACQUIRED', value: orders.length, color:'#cc0000' },
    { label:'SIGNALS TRANSMITTED', value: sales.length, color:'#ff4400' },
    { label:'ENERGY COLLECTED', value: `₹${totalEarned}`, color:'#ffaa00' },
  ]

  return (
    <div style={{ background:'#000',minHeight:'100vh',padding:'80px 40px 40px',position:'relative' }}>
      <div style={{ position:'fixed',inset:0,background:'radial-gradient(ellipse at 50% 20%,rgba(20,0,0,0.8),rgba(0,0,0,1) 70%)',zIndex:0,pointerEvents:'none' }} />

      <div style={{ position:'relative',zIndex:5,maxWidth:'900px',margin:'0 auto' }}>
        <div style={{ marginBottom:'32px' }}>
          <div style={{ fontFamily:display,fontSize:'2.5rem',letterSpacing:'0.15em',color:'#cc0000',textShadow:'0 0 20px rgba(204,0,0,0.5)',marginBottom:'4px' }}>AGENT TERMINAL</div>
          <div style={{ color:'#333',fontFamily:mono,fontSize:'0.7rem',letterSpacing:'0.15em' }}>// WELCOME BACK, {user.name.toUpperCase()}</div>
        </div>

        <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'16px',marginBottom:'32px' }}>
          {statCards.map(s => (
            <div key={s.label} style={{ background:'#050000',border:'1px solid rgba(204,0,0,0.2)',padding:'24px' }}>
              <div style={{ color:'#333',fontFamily:mono,fontSize:'0.65rem',letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:'10px' }}>{s.label}</div>
              <div style={{ fontFamily:display,fontSize:'2rem',letterSpacing:'0.05em',color:s.color,textShadow:`0 0 15px ${s.color}55` }}>{s.value}</div>
            </div>
          ))}
        </div>

        <div style={{ display:'flex',gap:'0',marginBottom:'24px',borderBottom:'1px solid rgba(204,0,0,0.2)' }}>
          {[['orders','ACQUIRED SIGNALS'],['sales','TRANSMITTED SIGNALS']].map(([key,label]) => (
            <button key={key} onClick={()=>setTab(key)} style={{
              padding:'12px 24px',background:'transparent',border:'none',borderBottom:tab===key?'2px solid #cc0000':'2px solid transparent',
              color:tab===key?'#cc0000':'#333',fontFamily:mono,fontSize:'0.75rem',letterSpacing:'0.1em',
              textTransform:'uppercase',cursor:'pointer',transition:'all 0.2s',
            }}>{label}</button>
          ))}
        </div>

        {active.length === 0 ? (
          <div>
            <WillsWall message={tab === 'orders' ? 'NO SIGNALS' : 'NO TRANSMISSIONS'} />
            <div style={{ textAlign:'center', marginTop:'20px' }}>
              {tab === 'orders'
                ? <Link to="/listings" style={{ color:'#cc0000',fontFamily:mono,fontSize:'0.8rem',letterSpacing:'0.1em' }}>SCAN FOR SIGNALS →</Link>
                : <Link to="/sell" style={{ color:'#cc0000',fontFamily:mono,fontSize:'0.8rem',letterSpacing:'0.1em' }}>TRANSMIT A SIGNAL →</Link>
              }
            </div>
          </div>
        ) : (
          <div style={{ display:'flex',flexDirection:'column',gap:'10px' }}>
            {active.map(item => (
              <div key={item._id} style={{ background:'#050000',border:'1px solid rgba(204,0,0,0.15)',padding:'20px 24px',display:'flex',alignItems:'center',justifyContent:'space-between',transition:'border-color 0.2s' }}
                onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(204,0,0,0.4)'}
                onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(204,0,0,0.15)'}
              >
                <div>
                  <div style={{ color:'#ccc',fontFamily:mono,fontWeight:600,marginBottom:'4px' }}>{item.ticket?.title}</div>
                  <div style={{ color:'#333',fontFamily:mono,fontSize:'0.75rem' }}>{item.ticket?.date} · {item.ticket?.location}</div>
                  <div style={{ color:'#333',fontFamily:mono,fontSize:'0.72rem',marginTop:'2px' }}>
                    {tab==='orders'?`TRANSMITTER: ${item.seller?.name}`:`RECEIVER: ${item.buyer?.name}`}
                  </div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontFamily:display,fontSize:'1.4rem',color:'#fff',letterSpacing:'0.05em',marginBottom:'6px' }}>₹{item.price}</div>
                  <span style={{ background:'rgba(204,0,0,0.1)',border:'1px solid rgba(204,0,0,0.3)',color:'#cc0000',padding:'2px 10px',fontFamily:mono,fontSize:'0.65rem',letterSpacing:'0.08em',textTransform:'uppercase' }}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
