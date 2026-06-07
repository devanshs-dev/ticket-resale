const User = require('../models/User')
const Ticket = require('../models/Ticket')

const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments()
    const totalTickets = await Ticket.countDocuments()
    const availableTickets = await Ticket.countDocuments({ status: 'available' })
    const soldTickets = await Ticket.countDocuments({ status: 'sold' })
    const flaggedTickets = await Ticket.countDocuments({ status: 'flagged' })
    res.json({ totalUsers, totalTickets, availableTickets, soldTickets, flaggedTickets })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 })
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getFlaggedTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ status: 'flagged' }).populate('seller', 'name email')
    res.json(tickets)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const approveTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' })
    ticket.status = 'available'
    await ticket.save()
    res.json({ message: 'Ticket approved' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' })
    await ticket.deleteOne()
    res.json({ message: 'Ticket deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const banUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id)
    res.json({ message: 'User removed' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getStats, getAllUsers, getFlaggedTickets, approveTicket, deleteTicket, banUser }