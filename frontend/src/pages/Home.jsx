import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import TicketCard from '../components/TicketCard'
import API from '../api'

const categories = [
  { label: '🎵 Concerts', value: 'Concert' },
  { label: '🚂 Travel', value: 'Travel' },
  { label: '🏏 Sports', value: 'Sports' },
  { label: '🎬 Movies', value: 'Movies' },
  { label: '🎭 Theatre', value: 'Theatre' },
  { label: '📺 Subscriptions', value: 'Subscription' },
  { label: '🍽️ Reservations', value: 'Reservation' },
]

function Home() {
  const [tickets, setTickets] = useState([])

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { data } = await API.get('/tickets')
        setTickets(data.slice(0, 4))
      } catch (error) {
        console.error(error)
      }
    }
    fetchTickets()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="bg-blue-600 text-white py-20 px-8 text-center">
        <h1 className="text-5xl font-bold mb-4">Buy and Sell Tickets Safely</h1>
        <p className="text-blue-100 text-xl mb-10">
          Concerts, travel, sports, movies and more — all in one place
        </p>
        <div className="max-w-2xl mx-auto flex gap-3">
          <input
            type="text"
            placeholder="Search events, routes, teams..."
            className="flex-1 px-5 py-3 rounded-xl text-gray-800 text-lg outline-none"
          />
          <Link to="/listings" className="bg-white text-blue-600 font-bold px-8 py-3 rounded-xl hover:bg-blue-50">
            Search
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Browse by Category</h2>
        <div className="flex gap-4 flex-wrap">
          {categories.map((cat) => (
            <Link
              key={cat.value}
              to={"/listings?category=" + cat.value}
              className="px-6 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium hover:border-blue-500 hover:text-blue-600 shadow-sm"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>

      {tickets.length > 0 && (
        <div className="max-w-5xl mx-auto px-8 pb-14">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Featured Tickets</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tickets.map((ticket) => (
              <TicketCard key={ticket._id} ticket={{...ticket, id: ticket._id}} />
            ))}
          </div>
        </div>
      )}

      <div className="bg-blue-50 border-t border-blue-100 py-14 px-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-3">Have something you cannot use?</h2>
        <p className="text-gray-500 mb-6 text-lg">
          Tickets, subscriptions, reservations — list it in minutes
        </p>
        <Link to="/sell" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 text-lg">
          List Now
        </Link>
      </div>

    </div>
  )
}

export default Home