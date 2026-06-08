import { useEffect, useRef } from 'react'

export default function VineEnergy() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId
    let mouse = { x: -999, y: -999 }
    let particles = []

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    function onMouseMove(e) {
      mouse.x = e.clientX
      mouse.y = e.clientY
      // Spawn a few vine particles on move
      for (let i = 0; i < 3; i++) {
        particles.push({
          x: mouse.x + (Math.random() - 0.5) * 10,
          y: mouse.y + (Math.random() - 0.5) * 10,
          vx: (Math.random() - 0.5) * 2.5,
          vy: (Math.random() - 0.5) * 2.5 - 0.5,
          life: 1,
          decay: 0.025 + Math.random() * 0.03,
          width: 1 + Math.random() * 2.5,
          length: 12 + Math.random() * 20,
          angle: Math.random() * Math.PI * 2,
        })
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles = particles.filter(p => p.life > 0)

      particles.forEach(p => {
        ctx.save()
        ctx.globalAlpha = p.life * 0.65
        ctx.strokeStyle = `rgba(204,0,0,${p.life.toFixed(2)})`
        ctx.lineWidth = p.width * p.life
        ctx.shadowColor = '#cc0000'
        ctx.shadowBlur = 6 * p.life
        ctx.beginPath()
        ctx.moveTo(p.x, p.y)
        // Vine-like curved tendril
        const ex = p.x + Math.cos(p.angle) * p.length * p.life
        const ey = p.y + Math.sin(p.angle) * p.length * p.life
        const cpx = p.x + Math.cos(p.angle + 0.8) * p.length * 0.5
        const cpy = p.y + Math.sin(p.angle + 0.8) * p.length * 0.5
        ctx.quadraticCurveTo(cpx, cpy, ex, ey)
        ctx.stroke()
        ctx.restore()

        p.x += p.vx
        p.y += p.vy
        p.life -= p.decay
        p.angle += 0.05
      })

      animId = requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none' }}
    />
  )
}
