import { useState, useEffect } from 'react'
import api from '../api/axios'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Availability.css'

const typeLabel = { 'two-wheeler': '🛵 Two Wheelers', 'four-wheeler': '🚗 Four Wheelers', 'staff': '🏢 Staff' }

const Availability = () => {
    const [areas, setAreas] = useState([])
    const [slots, setSlots] = useState({})
    const [selected, setSelected] = useState(null)
    const [loading, setLoading] = useState(true)
    const { user } = useAuth()

    const fetchAreas = async () => {
        try { const { data } = await api.get('/parking/areas'); setAreas(data) }
        catch (e) { console.error(e) }
        finally { setLoading(false) }
    }

    const fetchSlots = async (areaId) => {
        if (selected === areaId) { setSelected(null); return }
        if (!slots[areaId]) {
            const { data } = await api.get(`/parking/slots/${areaId}`)
            setSlots(prev => ({ ...prev, [areaId]: data }))
        }
        setSelected(areaId)
    }

    useEffect(() => { fetchAreas(); const t = setInterval(fetchAreas, 30000); return () => clearInterval(t) }, [])

    if (loading) return <div className="loader-wrap"><div className="loader" /><span className="loader-label">Fetching live slot data…</span></div>

    const selectedArea = areas.find(a => a._id === selected)
    const areaSlots = selected ? (slots[selected] || []) : []

    return (
        <>
            <div className="av-page-header">
                <div className="container">
                    <h1>Live Parking Availability</h1>
                    <p>Real-time slot status across all campus parking zones at BVP Katraj</p>
                    <div className="live-row">
                        <div className="live-badge">
                            <span className="live-dot" />Live · Auto-refreshes every 30s
                        </div>
                    </div>
                </div>
            </div>

            <div className="page-wrapper">
                <div className="container">
                    <div className="av-legend">
                        <strong style={{ color: 'var(--text-primary)', marginRight: 4 }}>Slot Status:</strong>
                        <span><span className="slot-chip chip-available" />&thinsp;Available</span>
                        <span><span className="slot-chip chip-occupied" />&thinsp;Occupied</span>
                        <span><span className="slot-chip chip-reserved" />&thinsp;Reserved</span>
                    </div>

                    <div className="grid-3" style={{ marginBottom: 28 }}>
                        {areas.map(area => {
                            const pct = area.total > 0 ? Math.round((area.occupied + area.reserved) / area.total * 100) : 0
                            const barColor = pct > 79 ? 'var(--danger)' : pct > 49 ? 'var(--warning)' : 'var(--success)'
                            const pctColor = pct > 79 ? 'var(--danger)' : pct > 49 ? 'var(--warning)' : 'var(--success)'
                            return (
                                <div key={area._id}
                                    className={`card area-card ${selected === area._id ? 'area-card--active' : ''}`}
                                    onClick={() => fetchSlots(area._id)}>
                                    <div className="area-card__header">
                                        <div>
                                            <div className="area-card__type">{typeLabel[area.type]}</div>
                                            <div className="area-card__name">{area.name}</div>
                                            <div className="area-card__loc">📍 {area.location}</div>
                                        </div>
                                        <div className="area-card__pct">
                                            <div className="area-card__pct-num" style={{ color: pctColor }}>{pct}%</div>
                                            <div className="area-card__pct-label">used</div>
                                        </div>
                                    </div>
                                    <div className="area-bar-wrap">
                                        <div className="area-bar" style={{ width: `${pct}%`, background: barColor }} />
                                    </div>
                                    <div className="area-card__counts">
                                        <span className="count-box count-total">Total &nbsp;{area.total}</span>
                                        <span className="count-box count-available">✓ {area.available}</span>
                                        <span className="count-box count-occupied">✗ {area.occupied}</span>
                                        <span className="count-box count-reserved">⏸ {area.reserved}</span>
                                    </div>
                                    <button className="btn btn-outline btn-sm" style={{ width: '100%', marginTop: 4 }}>
                                        {selected === area._id ? '▲ Collapse Slots' : '▼ View All Slots'}
                                    </button>
                                </div>
                            )
                        })}
                    </div>

                    {selected && selectedArea && (
                        <div className="card slots-panel fade-up">
                            <div className="slots-panel__header">
                                <h3>{selectedArea.name} — All Slots</h3>
                                {user && <Link to="/book" className="btn btn-primary btn-sm">📅 Book a Slot →</Link>}
                            </div>
                            <div className="slots-grid">
                                {areaSlots.map(slot => (
                                    <div key={slot._id} className={`slot-box slot-${slot.status}`} title={`${slot.slotNumber} — ${slot.status}`}>
                                        {slot.slotNumber}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default Availability
