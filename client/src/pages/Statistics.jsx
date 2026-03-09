import { useState, useEffect } from 'react'
import api from '../api/axios'
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import './Statistics.css'

const COLORS = ['#6366f1', '#ef4444', '#f59e0b', '#3b82f6']

const Statistics = () => {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.get('/booking/stats')
            .then(r => setStats(r.data))
            .catch(() => { })
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <div className="loader-wrap"><div className="loader" /><span className="loader-label">Calculating insights…</span></div>
    if (!stats) return <div className="container page-wrapper"><p>Unable to load statistics.</p></div>

    const pieData = [
        { name: 'Available', value: stats.availableSlots },
        { name: 'Occupied', value: stats.occupiedSlots },
        { name: 'Reserved', value: stats.reservedSlots },
    ]

    return (
        <>
            <div className="stats-page-header">
                <div className="container">
                    <h1>Insights & Analytics</h1>
                </div>
            </div>

            <div className="page-wrapper">
                <div className="container">
                    <div className="grid-4 stats-cards">
                        {[
                            { label: 'Total Capacity', value: stats.totalSlots, icon: '🅿️', color: 'var(--primary)' },
                            { label: 'Free Now', value: stats.availableSlots, icon: '✅', color: 'var(--success)' },
                            { label: 'Bookings Today', value: stats.bookingsToday, icon: '📋', color: 'var(--info)' },
                            { label: 'Utilisation', value: `${stats.utilisation}%`, icon: '📊', color: stats.utilisation > 80 ? 'var(--danger)' : 'var(--primary)' },
                        ].map((s, i) => (
                            <div key={s.label} className={`card stat-card fade-up fade-up-${i + 1}`}>
                                <div className="stat-card__icon">{s.icon}</div>
                                <div className="stat-card__val" style={{ color: s.color }}>{s.value}</div>
                                <div className="stat-card__label">{s.label}</div>
                            </div>
                        ))}
                    </div>

                    <div className="stats-charts">
                        <div className="card chart-card fade-up">
                            <h3>Live Allocation</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={4} dataKey="value">
                                        {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} stroke="none" />)}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="card chart-card fade-up">
                            <h3>Zones Breakdown</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={stats.areaStats} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                    <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                                    <Bar dataKey="total" name="Total" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="available" name="Available" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Statistics
