import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { login, loading, error } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        const success = await login(email, password)
        if (success) navigate('/')
    }

    return (
        <div className="auth-page">
            <div className="auth-orb ao-1"></div>
            <div className="auth-orb ao-2"></div>

            <div className="auth-card fade-up">
                <div className="auth-header">
                    <div className="auth-logo">🅿️</div>
                    <h2>Welcome Back</h2>
                    <p>Enter your campus credentials to continue</p>
                </div>

                {error && <div className="badge badge-danger" style={{ width: '100%', justifyContent: 'center', padding: '10px', marginBottom: '20px', borderRadius: 'var(--radius-sm)' }}>⚠️ {error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="e.g. rahul.s@bvp.edu.in"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '10px' }} disabled={loading}>
                        {loading ? 'Authenticating...' : 'Sign In →'}
                    </button>
                </form>

                <div className="auth-footer">
                    Don't have an account? <Link to="/register">Create one</Link>
                </div>

                <div className="auth-hint">
                    <strong>Demo Credentials:</strong>
                    Admin: <code>admin@bvp.edu.in</code> / <code>admin@123</code><br />
                    Student: <code>rahul.sharma@bvp.edu.in</code> / <code>student@123</code>
                </div>
            </div>
        </div>
    )
}

export default Login
