import axios from 'axios'

const resolvedBaseURL = import.meta.env.VITE_API_BASE_URL || '/api'

const api = axios.create({
    baseURL: resolvedBaseURL,
    headers: { 'Content-Type': 'application/json' },
})

// Re-attach token after page refresh
const stored = localStorage.getItem('bvp_user')
if (stored) {
    const parsed = JSON.parse(stored)
    api.defaults.headers.common['Authorization'] = `Bearer ${parsed.token}`
}

export default api
