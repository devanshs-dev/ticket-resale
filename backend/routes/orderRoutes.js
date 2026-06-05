const express = require('express')
const router = express.Router()
const { buyTicket, getMyOrders, getMySales, getAnalytics } = require('../controllers/orderController')
const { protect } = require('../middleware/authMiddleware')

router.post('/buy/:id', protect, buyTicket)
router.get('/my-orders', protect, getMyOrders)
router.get('/my-sales', protect, getMySales)
router.get('/analytics', protect, getAnalytics)

module.exports = router