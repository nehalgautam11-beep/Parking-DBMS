import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

const Navbar = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [menuOpen, setMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false) }
    const closeMenu = () => setMenuOpen(false)
    const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : ''

    return (
        <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
            <div className="container navbar__inner">
                <Link to="/" className="navbar__brand" onClick={closeMenu}>
                    <div className="navbar__logo-wrap">🅿️</div>
                    <div className="navbar__brand-text">
                        <span className="navbar__title">BVP Smart Parking</span>
                        <span className="navbar__subtitle">PUNE CAMPUS · KATRAJ</span>
                    </div>
                </Link>

                <div className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
                    <NavLink to="/" end onClick={closeMenu} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Home</NavLink>
                    <NavLink to="/availability" onClick={closeMenu} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Availability</NavLink>
                    <NavLink to="/map" onClick={closeMenu} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Map</NavLink>
                    <NavLink to="/statistics" onClick={closeMenu} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Statistics</NavLink>
                    {user && <NavLink to="/book" onClick={closeMenu} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Book Parking</NavLink>}
                    {user && <NavLink to="/my-bookings" onClick={closeMenu} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>My Bookings</NavLink>}
                    {user?.role === 'admin' && <NavLink to="/admin" onClick={closeMenu} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Admin</NavLink>}

                    <div className="navbar__auth">
                        {user ? (
                            <div className="navbar__user-menu">
                                <span className="navbar__username">
                                    <div className="navbar__avatar">{initials}</div>
                                    {user?.name?.split(' ')[0] || 'User'}
                                </span>
                                <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Sign Out</button>
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-ghost btn-sm" onClick={closeMenu}>Sign In</Link>
                                <Link to="/register" className="btn btn-primary btn-sm" onClick={closeMenu}>Get Started →</Link>
                            </>
                        )}
                    </div>
                </div>

                <button className="navbar__hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
                    <span className={menuOpen ? 'ham open' : 'ham'} />
                </button>
            </div>
        </nav>
    )
}

export default Navbar
