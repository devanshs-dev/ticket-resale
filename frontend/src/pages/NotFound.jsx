import { Link } from 'react-router-dom'
import WillsWall from '../components/WillsWall'

export default function NotFound() {
  return (
    <div style={{ background:'#000',minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'40px 24px' }}>
      <div style={{ position:'fixed',inset:0,background:'radial-gradient(ellipse at 50% 30%,rgba(20,0,0,0.8),rgba(0,0,0,1) 70%)',zIndex:0,pointerEvents:'none' }} />
      <div style={{ position:'relative',zIndex:5,width:'100%',maxWidth:'900px',textAlign:'center' }}>
        <div style={{ fontFamily:"'Bebas Neue',cursive",fontSize:'8rem',color:'#cc0000',textShadow:'0 0 40px #cc0000',lineHeight:1,marginBottom:'8px' }}>404</div>
        <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:'0.8rem',letterSpacing:'0.2em',color:'rgba(204,0,0,0.5)',textTransform:'uppercase',marginBottom:'48px' }}>
          // YOU'VE CROSSED INTO THE WRONG DIMENSION
        </div>
        <WillsWall message="WRONG DIMENSION" />
        <Link to="/" style={{ display:'inline-block',marginTop:'40px',padding:'14px 40px',background:'#cc0000',color:'#000',textDecoration:'none',fontFamily:"'Bebas Neue',cursive",fontSize:'1.1rem',letterSpacing:'0.15em',boxShadow:'0 0 20px rgba(204,0,0,0.4)' }}>
          RETURN TO HAWKINS →
        </Link>
      </div>
    </div>
  )
}
