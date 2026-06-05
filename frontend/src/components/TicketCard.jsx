import { Link } from 'react-router-dom'

function TicketCard({ ticket }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
      
      <div className="bg-blue-600 px-5 py-4">
        <span className="text-blue-100 text-sm font-medium uppercase tracking-wide">
          {ticket.category}
        </span>
        <h3 className="text-white text-xl font-bold mt-1">
          {ticket.title}
        </h3>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
          <span>📅</span>
          <span>{ticket.date}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
          <span>📍</span>
          <span>{ticket.location}</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-gray-800">
              ₹{ticket.price}
            </span>
            <span className="text-gray-400 text-sm ml-1">/ ticket</span>
          </div>
          <Link
            to={"/ticket/" + ticket.id}
            className="bg-blue-600 text-white px-5 py-2 rounded-xl font-medium hover:bg-blue-700"
          >
            View
          </Link>
        </div>
      </div>

    </div>
  )
}

export default TicketCard