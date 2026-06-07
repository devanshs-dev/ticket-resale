const express = require('express')
const router = express.Router()
const { getStats, getAllUsers, getFlaggedTickets, approveTicket, deleteTicket, banUser } = require('../controllers/adminController')
const { protect, admin } = require('../middleware/authMiddleware')

router.get('/stats', protect, admin, getStats)
router.get('/users', protect, admin, getAllUsers)
router.get('/flagged', protect, admin, getFlaggedTickets)
router.put('/tickets/:id/approve', protect, admin, approveTicket)
router.delete('/tickets/:id', protect, admin, deleteTicket)
router.delete('/users/:id', protect, admin, banUser)

module.exports = router