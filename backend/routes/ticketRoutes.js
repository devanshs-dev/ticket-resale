const express = require('express')
const router = express.Router()
const { createTicket, getTickets, getTicketById, deleteTicket } = require('../controllers/ticketController')
const { protect } = require('../middleware/authMiddleware')

router.get('/', getTickets)
router.get('/:id', getTicketById)
router.post('/', protect, createTicket)
router.delete('/:id', protect, deleteTicket)

module.exports = router