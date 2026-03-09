import { useState, useEffect } from 'react'
import api from '../api/axios'
import './MyBookings.css'

const MyBookings = () => {
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchBookings = async () => {
        try {
            const { data } = await api.get('/booking/mine')
            setBookings(data)
        } catch (e) { console.error(e) }
        finally { setLoading(false) }
    }

    useEffect(() => { fetchBookings() }, [])

    const cancelBooking = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return
        try {
            await api.delete(`/booking/${id}`)
            setBookings(bookings.filter(b => b._id !== id))
            alert('Booking cancelled successfully!')
        } catch (e) {
            alert(e.response?.data?.message || 'Failed to cancel booking')
        }
    }

    if (loading) return <div className="loader-wrap"><div className="loader" /><span className="loader-label">Loading your bookings…</span></div>

    return (
        <>
            <div className="mb-page-header">
                <div className="container">
                    <h1>My Bookings</h1>
                    <p>Manage your active and past parking reservations</p>
                </div>
            </div>

            <div className="page-wrapper">
                <div className="container">
                    {bookings.length === 0 ? (
                        <div className="empty-bookings fade-up">
                            <div className="empty-icon">📂</div>
                            <h2>No active bookings</h2>
                            <p>You haven't reserved any parking slots yet.</p>
                            <a href="/book" className="btn btn-primary">Book Your First Slot →</a>
                        </div>
                    ) : (
                        <div className="bookings-grid">
                            {bookings.map((b, i) => (
                                <div key={b._id} className={`card booking-item fade-up fade-up-${(i % 4) + 1}`}>
                                    <div className="booking-info">
                                        <div className="booking-icon">
                                            {b.slot?.area?.type === 'two-wheeler' ? '🛵' : b.slot?.area?.type === 'four-wheeler' ? '🚗' : '🏢'}
                                        </div>
                                        <div className="booking-details">
                                            <h3>Slot {b.slot?.slotNumber} — {b.slot?.area?.name}</h3>
                                            <p>📍 {b.slot?.area?.location}</p>
                                        </div>
                                    </div>

                                    <div className="booking-meta">
                                        <div className="meta-item">
                                            <label>Vehicle</label>
                                            <span>{b.vehicleNumber}</span>
                                        </div>
                                        <div className="meta-item">
                                            <label>Date</label>
                                            <span>{new Date(b.startTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                        </div>
                                        <div className="meta-item">
                                            <label>Time</label>
                                            <span>{new Date(b.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <div className="meta-item">
                                            <label>Status</label>
                                            <span className="badge badge-success">Confirmed</span>
                                        </div>
                                    </div>

                                    <button className="btn btn-ghost btn-danger btn-sm" onClick={() => cancelBooking(b._id)}>
                                        Cancel
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default MyBookings
