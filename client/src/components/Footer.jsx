import { Link } from 'react-router-dom'
import './Footer.css'

const Footer = () => (
    <footer className="footer">
        <div className="container">
            <div className="footer__inner">
                <div className="footer__brand">
                    <div className="footer__brand-row">
                        <div className="footer__logo-box">🅿️</div>
                        <div className="footer__brand-text">
                            <div className="footer__title">BVP Smart Parking</div>
                            <div className="footer__address">Bharati Vidyapeeth College · Katraj, Pune</div>
                        </div>
                    </div>
                    <div className="footer__desc">Intelligent parking operations platform for students, faculty and visitors.</div>
                    <div className="footer__badges">
                        <span>Live Availability</span>
                        <span>Instant Booking</span>
                        <span>Campus Analytics</span>
                    </div>
                </div>
                <div className="footer__links">
                    <div className="footer__col">
                        <h4>Product</h4>
                        <Link to="/">Home</Link>
                        <Link to="/availability">Parking Availability</Link>
                        <Link to="/book">Book Parking</Link>
                        <Link to="/map">Campus Map</Link>
                        <Link to="/statistics">Statistics</Link>
                    </div>
                    <div className="footer__col">
                        <h4>Platform</h4>
                        <Link to="/login">Sign In</Link>
                        <Link to="/register">Create Account</Link>
                        <Link to="/my-bookings">My Bookings</Link>
                        <Link to="/admin">Admin Dashboard</Link>
                    </div>
                    <div className="footer__col">
                        <h4>Support</h4>
                        <span>Security: +91 20 2411 XXXX</span>
                        <span>parking@bvp.edu.in</span>
                        <span>7:00 AM – 9:00 PM</span>
                        <span>All days including Sunday</span>
                    </div>
                </div>
            </div>
            <div className="footer__bottom container">
                <span className="footer__bottom-text">© {new Date().getFullYear()} Bharati Vidyapeeth College, Pune. All rights reserved.</span>
                <div className="footer__status">
                    <div className="footer__status-dot" />
                    System Operational
                </div>
            </div>
        </div>
    </footer>
)

export default Footer
