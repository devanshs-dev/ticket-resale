const mongoose = require('mongoose')
const dotenv = require('dotenv')
const User = require('./models/User')
const Ticket = require('./models/Ticket')
const bcrypt = require('bcryptjs')

dotenv.config()

const seedData = async () => {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('MongoDB connected')

  await Ticket.deleteMany({})
  await User.deleteMany({})
  console.log('Cleared existing data')

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash('password123', salt)

  const users = await User.insertMany([
    { name: 'Rahul Mehta', email: 'rahul@test.com', password: hashedPassword },
    { name: 'Priya Sharma', email: 'priya@test.com', password: hashedPassword },
    { name: 'Amit Kumar', email: 'amit@test.com', password: hashedPassword },
    { name: 'Sneha Patel', email: 'sneha@test.com', password: hashedPassword },
  ])

  await Ticket.insertMany([
    { title: 'Arijit Singh Live Concert', category: 'Concert', date: '15 July 2026', location: 'DY Patil Stadium, Mumbai', price: 1200, seats: 'A12, A13', description: 'Two premium tickets for Arijit Singh Live. Front section seats. Original price was Rs 2000 each. Selling due to travel plans.', seller: users[0]._id, trustScore: 92 },
    { title: 'Coldplay Music of the Spheres', category: 'Concert', date: '30 July 2026', location: 'Narendra Modi Stadium, Ahmedabad', price: 4500, seats: 'Pit Area', description: 'One pit area ticket for Coldplay. Bought two but friend cannot make it. Verified purchase from BookMyShow.', seller: users[1]._id, trustScore: 97 },
    { title: 'Delhi to Mumbai Rajdhani', category: 'Travel', date: '20 June 2026', location: 'New Delhi Railway Station', price: 850, seats: 'Coach B4, Seat 32', description: 'AC 2-tier ticket from New Delhi to Mumbai Central. Cannot travel due to work emergency. Confirm before buying.', seller: users[2]._id, trustScore: 88 },
    { title: 'Mumbai to Goa Volvo Bus', category: 'Travel', date: '25 June 2026', location: 'Mumbai Central Bus Stand', price: 600, seats: 'Seat 14', description: 'Sleeper bus ticket from Mumbai to Goa. AC Volvo bus. Plans changed last minute.', seller: users[0]._id, trustScore: 85 },
    { title: 'India vs Australia T20', category: 'Sports', date: '22 June 2026', location: 'Wankhede Stadium, Mumbai', price: 2500, seats: 'Stand C, Row 5', description: 'Two tickets for India vs Australia T20. Great view from the stand. Selling both together.', seller: users[3]._id, trustScore: 95 },
    { title: 'IPL Final 2026', category: 'Sports', date: '28 June 2026', location: 'Narendra Modi Stadium, Ahmedabad', price: 3200, seats: 'East Stand, Row 8', description: 'Two tickets for the IPL Final. Cannot attend due to family function. Selling at original price.', seller: users[1]._id, trustScore: 91 },
    { title: 'Pushpa 2 - Premium Recliner', category: 'Movies', date: '16 June 2026', location: 'PVR Cinemas, Delhi', price: 450, seats: 'F4, F5', description: 'Two recliner seats for the 8PM show. Selling because of sudden travel plans.', seller: users[2]._id, trustScore: 89 },
    { title: 'Stree 3 - First Day First Show', category: 'Movies', date: '17 June 2026', location: 'INOX, Bangalore', price: 380, seats: 'G7, G8', description: 'First day first show tickets. Cannot attend due to family function. Hurry!', seller: users[0]._id, trustScore: 83 },
    { title: 'Netflix Premium - 3 Months', category: 'Subscription', date: 'Expires Sep 2026', location: 'Digital', price: 599, seats: 'N/A', description: 'Transferring my Netflix Premium subscription. 3 months remaining. Will share login credentials securely.', seller: users[3]._id, trustScore: 78 },
    { title: 'Cult.fit Gym - 2 Months', category: 'Subscription', date: 'Expires Aug 2026', location: 'Koramangala, Bangalore', price: 1200, seats: 'N/A', description: 'Moving to another city. 2 months of Cult.fit membership remaining. Fully transferable.', seller: users[1]._id, trustScore: 82 },
    { title: 'Table for 2 - Taj Restaurant', category: 'Reservation', date: '20 June 2026', location: 'Taj Hotel, Mumbai', price: 500, seats: 'Window Table', description: 'Reserved a table for anniversary but plans changed. Beautiful window view. Reservation is confirmed.', seller: users[2]._id, trustScore: 90 },
    { title: 'Goa Beach Resort - 2 Nights', category: 'Reservation', date: '25 June 2026', location: 'Calangute, Goa', price: 3500, seats: 'Room 204', description: 'Pre-paid hotel booking for 2 nights at a beach resort in Goa. Non-refundable so selling at cost.', seller: users[0]._id, trustScore: 94 },
  ])

  console.log('Seeded 4 users and 12 tickets!')
  process.exit()
}

seedData().catch((err) => {
  console.error(err)
  process.exit(1)
})