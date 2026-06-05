const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const ticketRoutes = require('./routes/ticketRoutes')
const orderRoutes = require('./routes/orderRoutes')
require('./config/pgdb')

dotenv.config()
connectDB()

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'Ticket Resale API is running' })
})

app.use('/api/auth', authRoutes)
app.use('/api/tickets', ticketRoutes)
app.use('/api/orders', orderRoutes)

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
  console.log('Server running on port ' + PORT)
})