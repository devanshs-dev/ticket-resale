const QRCode = require('qrcode')
const Order = require('../models/Order')
const Ticket = require('../models/Ticket')
const pool = require('../config/pgdb')

const buyTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate('seller', 'name')
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' })
    if (ticket.status !== 'available') return res.status(400).json({ message: 'Ticket already sold' })
    if (ticket.seller._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot buy your own ticket' })
    }

    ticket.status = 'sold'
    await ticket.save()

    const order = await Order.create({
      ticket: ticket._id,
      buyer: req.user._id,
      seller: ticket.seller._id,
      price: ticket.price,
    })

    const qrData = JSON.stringify({
      orderId: order._id,
      ticketId: ticket._id,
      ticketTitle: ticket.title,
      buyerId: req.user._id,
      price: ticket.price,
      verified: true
    })
    const qrCode = await QRCode.toDataURL(qrData)

    await pool.query(
      `INSERT INTO orders (ticket_id, ticket_title, buyer_id, buyer_name, seller_id, seller_name, category, price)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        ticket._id.toString(),
        ticket.title,
        req.user._id.toString(),
        req.user.name,
        ticket.seller._id.toString(),
        ticket.seller.name,
        ticket.category,
        ticket.price
      ]
    )

    res.status(201).json({ ...order.toObject(), qrCode })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .populate('ticket', 'title category date location price')
      .populate('seller', 'name email')
      .sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getMySales = async (req, res) => {
  try {
    const orders = await Order.find({ seller: req.user._id })
      .populate('ticket', 'title category date location price')
      .populate('buyer', 'name email')
      .sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getAnalytics = async (req, res) => {
  try {
    const totalRevenue = await pool.query('SELECT SUM(price) as total FROM orders')
    const totalOrders = await pool.query('SELECT COUNT(*) as count FROM orders')
    const byCategory = await pool.query(
      'SELECT category, COUNT(*) as count, SUM(price) as revenue FROM orders GROUP BY category ORDER BY revenue DESC'
    )
    const recent = await pool.query(
      'SELECT * FROM orders ORDER BY created_at DESC LIMIT 5'
    )

    res.json({
      totalRevenue: totalRevenue.rows[0].total || 0,
      totalOrders: totalOrders.rows[0].count,
      byCategory: byCategory.rows,
      recentOrders: recent.rows
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { buyTicket, getMyOrders, getMySales, getAnalytics }