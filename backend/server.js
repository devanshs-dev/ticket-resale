const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const http = require('http')
const { Server } = require('socket.io')
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const ticketRoutes = require('./routes/ticketRoutes')
const orderRoutes = require('./routes/orderRoutes')
const adminRoutes = require('./routes/adminRoutes')
require('./config/pgdb')

dotenv.config()
connectDB()

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: { origin: ['http://localhost:3000', 'http://localhost:3004', 'https://ticket-resale-phi.vercel.app'], methods: ['GET', 'POST'] }
})

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3004', 'https://ticket-resale-phi.vercel.app'],
  credentials: true
}))
app.use(express.json())
app.use('/api/admin', adminRoutes)

app.set('io', io)

const viewingCounts = {}

io.on('connection', (socket) => {
  console.log('User connected: ' + socket.id)

  socket.on('viewingTicket', (ticketId) => {
    socket.join(ticketId)
    viewingCounts[ticketId] = (viewingCounts[ticketId] || 0) + 1
    io.to(ticketId).emit('viewerCount', viewingCounts[ticketId])
  })

  socket.on('leaveTicket', (ticketId) => {
    socket.leave(ticketId)
    viewingCounts[ticketId] = Math.max((viewingCounts[ticketId] || 1) - 1, 0)
    io.to(ticketId).emit('viewerCount', viewingCounts[ticketId])
  })

  socket.on('disconnect', () => {
    console.log('User disconnected: ' + socket.id)
  })
})

app.get('/', (req, res) => {
  res.json({ message: 'Ticket Resale API is running' })
})

app.use('/api/auth', authRoutes)
app.use('/api/tickets', ticketRoutes)
app.use('/api/orders', orderRoutes)

const PORT = process.env.PORT || 8000
server.listen(PORT, () => {
  console.log('Server running on port ' + PORT)
})