import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthProvider>
            <Toaster
                position="top-right"
                toastOptions={{
                    style: { fontFamily: 'Inter, sans-serif', fontSize: '14px' },
                    success: { duration: 3000 },
                    error: { duration: 4000 },
                }}
            />
            <App />
        </AuthProvider>
    </React.StrictMode>
)
