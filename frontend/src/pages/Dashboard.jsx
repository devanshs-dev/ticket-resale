import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import API from '../api'

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'))
  const [orders, setOrders] = useState([])
  const [sales, setSales] = useState([])
  const [tab, setTab] = useState('orders')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, salesRes] = await Promise.all([
          API.get('/orders/my-orders'),
          API.get('/orders/my-sales')
        ])
        setOrders(ordersRes.data)
        setSales(salesRes.data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [])

  if (!user) return <div className="p-10">Please login first.</div>

  const activeData = tab === 'orders' ? orders : sales

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-8">
      <div className="max-w-4xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, {user.name}</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <p className="text-gray-400 text-sm">Tickets Bought</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{orders.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <p className="text-gray-400 text-sm">Tickets Sold</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{sales.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <p className="text-gray-400 text-sm">Total Earned</p>
            <p className="text-3xl font-bold text-green-600 mt-1">
              Rs {sales.reduce((sum, s) => sum + s.price, 0)}
            </p>
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <button onClick={() => setTab('orders')}
            className={tab === 'orders'
              ? 'px-5 py-2 rounded-xl font-medium bg-blue-600 text-white'
              : 'px-5 py-2 rounded-xl font-medium bg-white border border-gray-200 text-gray-600'}>
            My Purchases
          </button>
          <button onClick={() => setTab('sales')}
            className={tab === 'sales'
              ? 'px-5 py-2 rounded-xl font-medium bg-blue-600 text-white'
              : 'px-5 py-2 rounded-xl font-medium bg-white border border-gray-200 text-gray-600'}>
            My Listings
          </button>
        </div>

        {activeData.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-400 text-lg">Nothing here yet</p>
            {tab === 'orders'
              ? <Link to="/listings" className="text-blue-600 hover:underline mt-2 inline-block">Browse tickets</Link>
              : <Link to="/sell" className="text-blue-600 hover:underline mt-2 inline-block">List a ticket</Link>
            }
          </div>
        ) : (
          <div className="space-y-4">
            {activeData.map((item) => (
              <div key={item._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-800">{item.ticket?.title}</h3>
                  <p className="text-gray-400 text-sm mt-1">
                    {item.ticket?.date} · {item.ticket?.location}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    {tab === 'orders' ? 'Seller: ' + item.seller?.name : 'Buyer: ' + item.buyer?.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-800">Rs {item.price}</p>
                  <span className="text-xs bg-green-50 text-green-600 px-3 py-1 rounded-full font-medium">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard