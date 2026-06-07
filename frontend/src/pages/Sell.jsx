import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api'

const categories = ['Concert', 'Travel', 'Sports', 'Movies', 'Theatre', 'Subscription', 'Reservation']

function Sell() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ title: '', category: 'Concert', date: '', location: '', price: '', seats: '', description: '' })

  if (!user) { navigate('/login'); return null }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      await API.post('/tickets', form)
      navigate('/listings')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    }
    setLoading(false)
  }

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: '10px',
    border: '1px solid var(--color-border)', background: 'var(--color-surface2)',
    color: 'var(--color-text)', fontSize: '0.95rem', outline: 'none',
  }
  const labelStyle = { color: 'var(--color-text)', fontWeight: 600, fontSize: '0.85rem', display: 'block', marginBottom: '8px' }

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh', padding: '40px 32px' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        <h1 style={{ color: '#fff', fontWeight: 800, fontSize: '2rem', marginBottom: '6px' }}>List a Ticket</h1>
        <p style={{ color: 'var(--color-muted)', marginBottom: '32px' }}>Fill in the details and reach thousands of buyers</p>

        {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px' }}>{error}</div>}

        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '20px', padding: '36px' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Title</label>
                <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Arijit Singh Live - 2 tickets" required style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Category</label>
                <select name="category" value={form.category} onChange={handleChange} style={inputStyle}>
                  {categories.map((c) => <option key={c} style={{ background: '#13131a' }}>{c}</option>)}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Price (₹)</label>
                <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="1200" required style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Date</label>
                <input name="date" value={form.date} onChange={handleChange} placeholder="15 June 2026" required style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Seat / Details</label>
                <input name="seats" value={form.seats} onChange={handleChange} placeholder="A12, A13" style={inputStyle} />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Location</label>
                <input name="location" value={form.location} onChange={handleChange} placeholder="Wankhede Stadium, Mumbai" required style={inputStyle} />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Description</label>
                <textarea name="description" value={form.description} onChange={handleChange}
                  placeholder="Describe your ticket — why you're selling, condition, any extra info..."
                  rows={4} required style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary"
              style={{ width: '100%', fontSize: '1rem', padding: '14px', marginTop: '24px', opacity: loading ? 0.6 : 1 }}>
              {loading ? 'Listing...' : 'List Ticket →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Sell
