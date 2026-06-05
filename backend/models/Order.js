const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  ticket: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  price: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'disputed'], default: 'pending' },
  paymentStatus: { type: String, enum: ['held', 'released', 'refunded'], default: 'held' },
}, { timestamps: true })

module.exports = mongoose.model('Order', orderSchema)