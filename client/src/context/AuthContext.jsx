import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const stored = localStorage.getItem('bvp_user')
        if (stored) {
            try {
                const parsed = JSON.parse(stored)
                setUser(parsed)
                api.defaults.headers.common['Authorization'] = `Bearer ${parsed.token}`
            } catch {
                localStorage.removeItem('bvp_user')
            }
        }
        setLoading(false)
    }, [])

    const persistUser = (userData) => {
        setUser(userData)
        localStorage.setItem('bvp_user', JSON.stringify(userData))
        api.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`
    }

    const login = async (email, password) => {
        setLoading(true)
        setError('')
        try {
            const { data } = await api.post('/auth/login', { email, password })
            persistUser(data)
            return true
        } catch (err) {
            setError(err?.response?.data?.message || 'Login failed. Please try again.')
            return false
        } finally {
            setLoading(false)
        }
    }

    const register = async (formData) => {
        setLoading(true)
        setError('')
        try {
            const { data } = await api.post('/auth/register', formData)
            persistUser(data)
            return true
        } catch (err) {
            setError(err?.response?.data?.message || 'Registration failed. Please try again.')
            return false
        } finally {
            setLoading(false)
        }
    }

    const logout = () => {
        setUser(null)
        setError('')
        localStorage.removeItem('bvp_user')
        delete api.defaults.headers.common['Authorization']
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, error }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
