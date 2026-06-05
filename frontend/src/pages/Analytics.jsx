import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import API from '../api'
const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4']

function Analytics() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await API.get('/orders/analytics')
        setData(data)
      } catch (err) {
        console.error(err)
      }
      setLoading(false)
    }
    fetchAnalytics()
  }, [])

  if (!user) return <div className="p-10">Please login first.</div>
  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400 text-xl">Loading analytics...</div>

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-8">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold text-gray-800 mb-2">Analytics Dashboard</h1>
        <p className="text-gray-500 mb-8">Powered by PostgreSQL</p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <p className="text-gray-400 text-sm">Total Revenue</p>
            <p className="text-3xl font-bold text-green-600 mt-1">Rs {data?.totalRevenue || 0}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <p className="text-gray-400 text-sm">Total Orders</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{data?.totalOrders || 0}</p>
          </div>
        </div>

        {data?.byCategory?.length > 0 && (
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4">Revenue by Category</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data.byCategory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#3B82F6" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4">Orders by Category</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={data.byCategory} dataKey="count" nameKey="category" cx="50%" cy="50%" outerRadius={80} label>
                    {data.byCategory.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {data?.recentOrders?.length > 0 && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">Recent Transactions</h3>
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 text-sm border-b border-gray-100">
                  <th className="pb-3">Ticket</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Buyer</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 text-sm">
                    <td className="py-3 font-medium text-gray-800">{order.ticket_title}</td>
                    <td className="py-3 text-gray-500">{order.category}</td>
                    <td className="py-3 text-gray-500">{order.buyer_name}</td>
                    <td className="py-3 font-bold text-gray-800">Rs {order.price}</td>
                    <td className="py-3 text-gray-400">{new Date(order.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {(!data?.recentOrders?.length) && (
          <div className="bg-white rounded-2xl p-10 border border-gray-100 text-center">
            <p className="text-gray-400 text-lg">No transactions yet</p>
            <p className="text-gray-400 text-sm mt-1">Buy a ticket to see analytics here</p>
          </div>
        )}

      </div>
    </div>
  )
}

export default Analytics