import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Listings from './pages/Listings'
import TicketDetail from './pages/TicketDetail'
import Sell from './pages/Sell'
import Dashboard from './pages/Dashboard'
import Analytics from './pages/Analytics'
import Footer from './components/Footer'
import Profile from './pages/Profile'
import Admin from './pages/Admin'
import VineEnergy from './components/VineEnergy'
import SignalToast from './components/SignalToast'

function AppContent() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
  })
  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }
  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    window.location.href = '/'
  }
  return (
    <>
      <VineEnergy />
      <SignalToast />
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup onLogin={handleLogin} />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/ticket/:id" element={<TicketDetail />} />
        <Route path="/tickets/:id" element={<TicketDetail />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      <Footer />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
