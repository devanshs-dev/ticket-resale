import { useParams, Link, useNavigate } from 'react-router-dom'
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
  const [qrCode, setQrCode] = useState(null)
  const [purchased, setPurchased] = useState(false)
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))

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

  const handleBuy = async () => {
    if (!user) {
      navigate('/login')
      return
    }
    try {
      const { data } = await API.post('/orders/buy/' + id)
      setQrCode(data.qrCode)
      setPurchased(true)
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong')
    }
  }

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

            {purchased && qrCode ? (
              <div className="text-center">
                <div className="bg-green-50 text-green-600 px-4 py-3 rounded-xl mb-6 font-medium">
                  Ticket purchased successfully!
                </div>
                <p className="text-gray-500 mb-4 font-medium">Your QR Code — show this at entry</p>
                <img src={qrCode} alt="QR Code" className="mx-auto w-48 h-48" />
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full mt-6 bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700"
                >
                  Go to Dashboard
                </button>
              </div>
            ) : (
              <button
                onClick={handleBuy}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700"
              >
                Buy Now — Rs {ticket.price}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TicketDetail