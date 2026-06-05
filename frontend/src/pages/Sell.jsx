import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api'

const categories = ['Concert', 'Travel', 'Sports', 'Movies', 'Theatre', 'Subscription', 'Reservation']

function Sell() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '', category: 'Concert', date: '',
    location: '', price: '', seats: '', description: ''
  })

  if (!user) {
    navigate('/login')
    return null
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await API.post('/tickets', form)
      navigate('/listings')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">List a Ticket</h1>
        <p className="text-gray-500 mb-8">Fill in the details and reach thousands of buyers</p>

        {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-6">{error}</div>}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit}>

            <div className="grid grid-cols-2 gap-5 mb-5">
              <div className="col-span-2">
                <label className="block text-gray-700 font-medium mb-2">Title</label>
                <input name="title" value={form.title} onChange={handleChange}
                  placeholder="e.g. Arijit Singh Live - 2 tickets"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500"
                  required />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Category</label>
                <select name="category" value={form.category} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500">
                  {categories.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Price (Rs)</label>
                <input name="price" type="number" value={form.price} onChange={handleChange}
                  placeholder="1200"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500"
                  required />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Date</label>
                <input name="date" value={form.date} onChange={handleChange}
                  placeholder="15 June 2026"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500"
                  required />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Seat / Details</label>
                <input name="seats" value={form.seats} onChange={handleChange}
                  placeholder="A12, A13"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500" />
              </div>

              <div className="col-span-2">
                <label className="block text-gray-700 font-medium mb-2">Location</label>
                <input name="location" value={form.location} onChange={handleChange}
                  placeholder="Wankhede Stadium, Mumbai"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500"
                  required />
              </div>

              <div className="col-span-2">
                <label className="block text-gray-700 font-medium mb-2">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange}
                  placeholder="Describe your ticket — why you're selling, condition, any extra info..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500"
                  required />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 text-lg disabled:opacity-50">
              {loading ? 'Listing...' : 'List Ticket'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Sell