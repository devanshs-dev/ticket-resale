import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Listings from './pages/Listings'
import TicketDetail from './pages/TicketDetail'
import Sell from './pages/Sell'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/ticket/:id" element={<TicketDetail />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App