const Ticket = require('../models/Ticket')

const createTicket = async (req, res) => {
  try {
    const { title, category, date, location, price, seats, description } = req.body
    const ticket = await Ticket.create({
      title, category, date, location, price, seats, description,
      seller: req.user._id
    })
    res.status(201).json(ticket)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getTickets = async (req, res) => {
  try {
    const { category, search } = req.query
    let filter = { status: 'available' }
    if (category && category !== 'All') filter.category = category
    if (search) filter.title = { $regex: search, $options: 'i' }
    const tickets = await Ticket.find(filter).populate('seller', 'name email').sort({ createdAt: -1 })
    res.json(tickets)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate('seller', 'name email')
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' })
    res.json(ticket)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' })
    if (ticket.seller.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' })
    }
    await ticket.deleteOne()
    res.json({ message: 'Ticket removed' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { createTicket, getTickets, getTicketById, deleteTicket }