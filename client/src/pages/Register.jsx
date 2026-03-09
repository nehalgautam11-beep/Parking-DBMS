import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', mobile: '', vehicleNumber: '', password: '' })
    const { register, loading, error } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        const success = await register(formData)
        if (success) navigate('/')
    }

    return (
        <div className="auth-page">
            <div className="auth-orb ao-1"></div>
            <div className="auth-orb ao-2"></div>

            <div className="auth-card fade-up">
                <div className="auth-header">
                    <div className="auth-logo">🅿️</div>
                    <h2>Create Account</h2>
                    <p>Join the BVP Smart Parking community</p>
                </div>

                {error && <div className="badge badge-danger" style={{ width: '100%', justifyContent: 'center', padding: '10px', marginBottom: '20px', borderRadius: 'var(--radius-sm)' }}>⚠️ {error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" className="form-control" placeholder="Rahul Sharma" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                    </div>
                    <div className="grid-2">
                        <div className="form-group">
                            <label>Email Address</label>
                            <input type="email" className="form-control" placeholder="name@bvp.edu.in" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Mobile Number</label>
                            <input type="tel" className="form-control" placeholder="9876543210" value={formData.mobile} onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} required />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Vehicle Number</label>
                        <input type="text" className="form-control" placeholder="MH 12 AB 1234" value={formData.vehicleNumber} onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" className="form-control" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                    </div>
                    <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '10px' }} disabled={loading}>
                        {loading ? 'Creating Account...' : 'Get Started →'}
                    </button>
                </form>

                <div className="auth-footer">
                    Already have an account? <Link to="/login">Sign In</Link>
                </div>
            </div>
        </div>
    )
}

export default Register
