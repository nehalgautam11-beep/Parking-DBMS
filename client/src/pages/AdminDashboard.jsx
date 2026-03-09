import { useState, useEffect } from 'react'
import api from '../api/axios'
import './AdminDashboard.css'

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('bookings')
    const [data, setData] = useState({ bookings: [], users: [], areas: [] })
    const [loading, setLoading] = useState(true)

    const fetchData = async () => {
        try {
            const [bookings, users, areas] = await Promise.all([
                api.get('/admin/bookings'),
                api.get('/admin/users'),
                api.get('/parking/areas')
            ])
            setData({ bookings: bookings.data, users: users.data, areas: areas.data })
        } catch (e) { console.error(e) }
        finally { setLoading(false) }
    }

    useEffect(() => { fetchData() }, [])

    if (loading) return <div className="loader-wrap"><div className="loader" /><span className="loader-label">Loading controls…</span></div>

    const stats = [
        { label: 'Total Bookings', value: data.bookings.length, icon: '📋', bg: 'var(--primary-50)', color: 'var(--primary)' },
        { label: 'Active Users', value: data.users.length, icon: '👥', bg: '#f0f9ff', color: '#0ea5e9' },
        { label: 'Parking Zones', value: data.areas.length, icon: '🅿️', bg: '#ecfdf5', color: '#059669' },
        { label: 'Total Slots', value: data.areas.reduce((acc, a) => acc + a.totalSlots, 0), icon: '🔢', bg: '#fffbeb', color: '#d97706' },
    ]

    return (
        <>
            <div className="admin-page-header">
                <div className="container">
                    <h1>Admin Command Center</h1>
                </div>
            </div>

            <div className="page-wrapper">
                <div className="container">
                    <div className="grid-4 admin-stats">
                        {stats.map((s, i) => (
                            <div key={s.label} className={`card admin-stat-card fade-up fade-up-${i + 1}`}>
                                <div className="stat-icon-wrap" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
                                <div className="stat-content">
                                    <div className="stat-val">{s.value}</div>
                                    <div className="stat-label">{s.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="admin-tabs fade-up">
                        <button className={`admin-tab ${activeTab === 'bookings' ? 'admin-tab--active' : ''}`} onClick={() => setActiveTab('bookings')}>Overall Bookings</button>
                        <button className={`admin-tab ${activeTab === 'users' ? 'admin-tab--active' : ''}`} onClick={() => setActiveTab('users')}>User Directory</button>
                        <button className={`admin-tab ${activeTab === 'slots' ? 'admin-tab--active' : ''}`} onClick={() => setActiveTab('slots')}>Slot Management</button>
                    </div>

                    <div className="card fade-up" style={{ padding: 0, overflow: 'hidden' }}>
                        {activeTab === 'bookings' && (
                            <div className="table-wrap">
                                <table>
                                    <thead>
                                        <tr><th>User</th><th>Slot</th><th>Area</th><th>Vehicle</th><th>Time</th><th>Action</th></tr>
                                    </thead>
                                    <tbody>
                                        {data.bookings.map(b => (
                                            <tr key={b._id}>
                                                <td><strong>{b.user?.name}</strong></td>
                                                <td>{b.slot?.slotNumber}</td>
                                                <td>{b.slot?.area?.name}</td>
                                                <td><code>{b.vehicleNumber}</code></td>
                                                <td>{new Date(b.startTime).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                                                <td><button className="btn btn-ghost btn-sm btn-danger">Cancel</button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === 'users' && (
                            <div className="table-wrap">
                                <table>
                                    <thead>
                                        <tr><th>Name</th><th>Email</th><th>Vehicle</th><th>Role</th><th>Joined</th><th>Action</th></tr>
                                    </thead>
                                    <tbody>
                                        {data.users.map(u => (
                                            <tr key={u._id}>
                                                <td><strong>{u.name}</strong></td>
                                                <td>{u.email}</td>
                                                <td>{u.vehicleNumber}</td>
                                                <td><span className={`badge badge-${u.role === 'admin' ? 'primary' : 'info'}`}>{u.role}</span></td>
                                                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                                                <td><button className="btn btn-ghost btn-sm btn-danger">Suspend</button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === 'slots' && (
                            <div style={{ padding: '40px', textAlign: 'center' }}>
                                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛠️</div>
                                <h3>Advanced Slot Controls</h3>
                                <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 20px' }}>
                                    Use the live availability view to update slot statuses in real-time. Full CRUD controls are being optimized for mobile.
                                </p>
                                <button className="btn btn-primary">Refresh Infrastructure</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminDashboard
