import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import API from '../api'

function getTrustColor(score) {
  if (score >= 90) return 'text-green-600 bg-green-50'
  if (score >= 75) return 'text-yellow-600 bg-yellow-50'
  return 'text-red-600 bg-red-50'
}

function TicketDetail() {
  const { id } = useParams()
  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const { data } = await API.get('/tickets/' + id)
        setTicket(data)
      } catch (err) {
        setError('Ticket not found')
      }
      setLoading(false)
    }
    fetchTicket()
  }, [id])

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400 text-xl">Loading...</p>
    </div>
  )

  if (error || !ticket) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Ticket not found</h2>
        <Link to="/listings" className="text-blue-600 hover:underline">Back to listings</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-8">
      <div className="max-w-3xl mx-auto">

        <Link to="/listings" className="text-blue-600 hover:underline mb-6 inline-block">
          Back to listings
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-blue-600 px-8 py-6">
            <span className="text-blue-100 text-sm font-medium uppercase tracking-wide">
              {ticket.category}
            </span>
            <h1 className="text-white text-3xl font-bold mt-1">{ticket.title}</h1>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-400 text-sm mb-1">Date</p>
                <p className="text-gray-800 font-medium">{ticket.date}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-400 text-sm mb-1">Location</p>
                <p className="text-gray-800 font-medium">{ticket.location}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-400 text-sm mb-1">Seat</p>
                <p className="text-gray-800 font-medium">{ticket.seats || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-400 text-sm mb-1">Seller</p>
                <p className="text-gray-800 font-medium">{ticket.seller?.name || 'Anonymous'}</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-gray-700 font-medium mb-2">Description</h3>
              <p className="text-gray-500 leading-relaxed">{ticket.description}</p>
            </div>

            <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4 mb-6">
              <div>
                <p className="text-gray-400 text-sm">Trust Score</p>
                <span className={'text-lg font-bold px-3 py-1 rounded-lg ' + getTrustColor(ticket.trustScore)}>
                  {ticket.trustScore}/100
                </span>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm">Price</p>
                <p className="text-3xl font-bold text-gray-800">Rs {ticket.price}</p>
              </div>
            </div>

            <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700">
              Buy Now — Rs {ticket.price}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TicketDetail