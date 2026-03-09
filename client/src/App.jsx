import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import Home from './pages/Home'
import Availability from './pages/Availability'
import BookParking from './pages/BookParking'
import Login from './pages/Login'
import Register from './pages/Register'
import MyBookings from './pages/MyBookings'
import AdminDashboard from './pages/AdminDashboard'
import Statistics from './pages/Statistics'
import ParkingMap from './pages/ParkingMap'

function App() {
    return (
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <div className="app-wrapper">
                <Navbar />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/availability" element={<Availability />} />
                        <Route path="/map" element={<ParkingMap />} />
                        <Route path="/statistics" element={<Statistics />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/book" element={<ProtectedRoute><BookParking /></ProtectedRoute>} />
                        <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
                        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    )
}

export default App
