import { useState, useEffect } from 'react'
import api from '../api/axios'
import { useNavigate } from 'react-router-dom'
import './BookParking.css'

const BookParking = () => {
    const [step, setStep] = useState(1)
    const [areas, setAreas] = useState([])
    const [slots, setSlots] = useState([])
    const [formData, setFormData] = useState({ areaId: '', slotId: '', vehicleNumber: '', startTime: '', endTime: '' })
    const navigate = useNavigate()

    useEffect(() => {
        api.get('/parking/areas').then(r => setAreas(r.data))
    }, [])

    const handleAreaChange = async (id) => {
        setFormData({ ...formData, areaId: id, slotId: '' })
        const { data } = await api.get(`/parking/slots/${id}`)
        setSlots(data.filter(s => s.status === 'available'))
        setStep(2)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await api.post('/booking', formData)
            alert('Booking Confirmed Successfully!')
            navigate('/my-bookings')
        } catch (e) { alert(e.response?.data?.message || 'Error booking slot') }
    }

    const selectedArea = areas.find(a => a._id === formData.areaId)
    const selectedSlot = slots.find(s => s._id === formData.slotId)

    return (
        <>
            <div className="book-page-header">
                <div className="container">
                    <h1>Reserve Your Spot</h1>
                    <p>Book your campus parking in three simple steps</p>
                </div>
            </div>

            <div className="page-wrapper">
                <div className="container book-layout">
                    <div className="book-steps fade-up">
                        <div className={`bstep ${step >= 1 ? (step > 1 ? 'bstep--done' : 'bstep--active') : ''}`}>
                            <div className="bstep__num">{step > 1 ? '✓' : '1'}</div>
                            <div className="bstep__label">Area</div>
                        </div>
                        <div className={`bstep ${step >= 2 ? (step > 2 ? 'bstep--done' : 'bstep--active') : ''}`}>
                            <div className="bstep__num">{step > 2 ? '✓' : '2'}</div>
                            <div className="bstep__label">Slot & Details</div>
                        </div>
                        <div className={`bstep ${step >= 3 ? 'bstep--active' : ''}`}>
                            <div className="bstep__num">3</div>
                            <div className="bstep__label">Review</div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="card fade-up">
                        {step === 1 && (
                            <div className="form-section fade-in">
                                <h3><span>📍</span> Select Parking Zone</h3>
                                <div className="grid-2">
                                    {areas.map(a => (
                                        <div key={a._id}
                                            className={`card area-card ${formData.areaId === a._id ? 'area-card--active' : ''}`}
                                            onClick={() => handleAreaChange(a._id)}
                                            style={{ padding: '16px' }}>
                                            <div style={{ fontWeight: 700 }}>{a.name}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{a.available} slots free</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="form-section fade-in">
                                <h3><span>🚗</span> Slot & Vehicle Details</h3>
                                <div className="grid-2">
                                    <div className="form-group">
                                        <label>Select Slot</label>
                                        <select className="form-control" value={formData.slotId} onChange={(e) => setFormData({ ...formData, slotId: e.target.value })}>
                                            <option value="">-- Choose Slot --</option>
                                            {slots.map(s => <option key={s._id} value={s._id}>{s.slotNumber}</option>)}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Vehicle Number</label>
                                        <input type="text" className="form-control" placeholder="MH 12 AB 1234" value={formData.vehicleNumber} onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })} />
                                    </div>
                                </div>
                                <div className="grid-2">
                                    <div className="form-group">
                                        <label>Start Time</label>
                                        <input type="datetime-local" className="form-control" value={formData.startTime} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} />
                                    </div>
                                    <div className="form-group">
                                        <label>End Time</label>
                                        <input type="datetime-local" className="form-control" value={formData.endTime} onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                                    <button type="button" className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
                                    <button type="button" className="btn btn-primary" onClick={() => setStep(3)} disabled={!formData.slotId || !formData.vehicleNumber}>Next: Review →</button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="form-section fade-in">
                                <h3><span>📄</span> Review & Confirm</h3>
                                <div className="book-preview">
                                    <h3>Reservation Summary</h3>
                                    <div className="preview-grid">
                                        <div className="preview-item"><span>Zone</span><strong>{selectedArea?.name}</strong></div>
                                        <div className="preview-item"><span>Slot</span><strong>{selectedSlot?.slotNumber}</strong></div>
                                        <div className="preview-item"><span>Vehicle</span><strong>{formData.vehicleNumber}</strong></div>
                                        <div className="preview-item" style={{ gridColumn: 'span 2' }}><span>Entry</span><strong>{new Date(formData.startTime).toLocaleString()}</strong></div>
                                        <div className="preview-item" style={{ gridColumn: 'span 2' }}><span>Exit</span><strong>{new Date(formData.endTime).toLocaleString()}</strong></div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                                    <button type="button" className="btn btn-outline" onClick={() => setStep(2)}>← Back</button>
                                    <button type="submit" className="btn btn-primary btn-confirm">Confirm Booking</button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </>
    )
}

export default BookParking
