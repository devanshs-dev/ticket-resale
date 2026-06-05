import { useState, useEffect } from 'react'
import TicketCard from '../components/TicketCard'
import API from '../api'

const categories = ['All', 'Concert', 'Travel', 'Sports', 'Movies', 'Theatre', 'Subscription', 'Reservation']

function Listings() {
  const [tickets, setTickets] = useState([])
  const [selected, setSelected] = useState('All')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true)
      try {
        const { data } = await API.get('/tickets', {
          params: { category: selected, search }
        })
        setTickets(data)
      } catch (error) {
        console.error(error)
      }
      setLoading(false)
    }
    fetchTickets()
  }, [selected, search])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white py-12 px-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Browse All Tickets</h1>
        <div className="max-w-xl mx-auto">
          <input type="text" value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tickets..."
            className="w-full px-5 py-3 rounded-xl text-gray-800 outline-none text-lg" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-10">
        <div className="flex gap-3 flex-wrap mb-8">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setSelected(cat)}
              className={selected === cat
                ? 'px-5 py-2 rounded-xl font-medium bg-blue-600 text-white'
                : 'px-5 py-2 rounded-xl font-medium bg-white border border-gray-200 text-gray-600 hover:border-blue-400'}>
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400 text-xl">Loading tickets...</div>
        ) : (
          <>
            <p className="text-gray-500 mb-6">{tickets.length} tickets found</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {tickets.map((ticket) => (
                <TicketCard key={ticket._id} ticket={{...ticket, id: ticket._id}} />
              ))}
            </div>
            {tickets.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-400 text-xl">No tickets found</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Listings