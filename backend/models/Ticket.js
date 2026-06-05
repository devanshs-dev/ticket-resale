const mongoose = require('mongoose')

const ticketSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true, enum: ['Concert', 'Travel', 'Sports', 'Movies', 'Theatre', 'Subscription', 'Reservation'] },
  date: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  seats: { type: String },
  description: { type: String, required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['available', 'sold', 'flagged'], default: 'available' },
  trustScore: { type: Number, default: 100 },
  proofImage: { type: String },
}, { timestamps: true })

module.exports = mongoose.model('Ticket', ticketSchema)