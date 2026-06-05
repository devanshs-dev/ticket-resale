import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <nav className="bg-white shadow-sm px-8 py-4 flex items-center justify-between">

      <Link to="/" className="text-2xl font-bold text-blue-600">
        TicketResale
      </Link>

      <div className="flex gap-8">
        <Link to="/listings" className="text-gray-600 hover:text-blue-600 font-medium">
          Browse Tickets
        </Link>
        <Link to="/sell" className="text-gray-600 hover:text-blue-600 font-medium">
          Sell a Ticket
        </Link>
      </div>

      <div className="flex gap-3 items-center">
        {user ? (
          <>
            <span className="text-gray-600 font-medium">Hi, {user.name}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-red-500 border border-red-400 rounded-lg hover:bg-red-50 font-medium"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 font-medium">
              Login
            </Link>
            <Link to="/signup" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              Sign Up
            </Link>
          </>
        )}
      </div>

    </nav>
  )
}

export default Navbar