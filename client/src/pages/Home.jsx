import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Home.css'

const features = [
    { icon: '⚡', color: '#4f46e5', bg: '#eef2ff', title: 'Real-Time Availability', desc: 'Live slot status updated every 30 seconds across all campus parking zones.' },
    { icon: '📱', color: '#0ea5e9', bg: '#f0f9ff', title: 'Book from Anywhere', desc: 'Reserve your parking slot from your phone before you even leave home.' },
    { icon: '🗺️', color: '#059669', bg: '#ecfdf5', title: 'Interactive Campus Map', desc: 'Visual layout of BVP campus with all parking zones clearly marked.' },
    { icon: '📊', color: '#d97706', bg: '#fffbeb', title: 'Usage Analytics', desc: 'Monitor occupancy trends, peak hours, and daily utilisation stats.' },
    { icon: '🔐', color: '#7c3aed', bg: '#faf5ff', title: 'Secure Accounts', desc: 'JWT-authenticated profiles for students, staff and admin roles.' },
    { icon: '🛡️', color: '#dc2626', bg: '#fef2f2', title: 'Admin Controls', desc: 'Full dashboard to manage slots, view bookings, and oversee all users.' },
]

const areaStats = [
    { label: 'Two Wheelers', zone: 'Area A', slots: 40, icon: '🛵', color: '#4f46e5', pct: 48 },
    { label: 'Four Wheelers', zone: 'Area B', slots: 20, icon: '🚗', color: '#059669', pct: 40 },
    { label: 'Staff Parking', zone: 'Area C', slots: 15, icon: '🏢', color: '#d97706', pct: 55 },
]

const Home = () => {
    const { user } = useAuth()

    return (
        <div className="home">

            {/* ── HERO ── */}
            <section className="hero">
                {/* Floating orbs */}
                <div className="orb orb-1" />
                <div className="orb orb-2" />
                <div className="orb orb-3" />
                <div className="orb orb-4" />

                <div className="container hero__layout">
                    <div className="hero__inner fade-up">
                        <div className="hero__eyebrow">
                            <span className="hero__eyebrow-dot" />
                            Bharati Vidyapeeth College · Katraj, Pune
                        </div>

                        <h1 className="hero__title">
                            Smart Parking for<br />
                            <span className="hero__gradient-text">BVP Pune Campus</span>
                        </h1>

                        <p className="hero__subtitle">
                            <span className="hero__subtitle-strong">Find available parking slots instantly</span> and book them online
                            <span className="hero__subtitle-sep"> — </span>
                            <span className="hero__subtitle-accent">no queues, no confusion.</span>
                            <span className="hero__subtitle-break">Designed for students, faculty, staff and campus visitors.</span>
                        </p>

                        <div className="hero__actions">
                            <Link to="/availability" className="btn btn-primary btn-lg">
                                Find Parking Now →
                            </Link>
                            {user
                                ? <Link to="/book" className="btn btn-outline btn-lg">📅 Book a Slot</Link>
                                : <Link to="/register" className="btn btn-outline btn-lg">Create Free Account</Link>
                            }
                        </div>

                        {/* Area pills */}
                        <div className="hero__area-pills">
                            {areaStats.map(a => (
                                <div key={a.zone} className="area-pill">
                                    <span className="area-pill__icon">{a.icon}</span>
                                    <div>
                                        <div className="area-pill__zone">{a.zone}</div>
                                        <div className="area-pill__label">{a.label}</div>
                                    </div>
                                    <div className="area-pill__slots" style={{ color: a.color }}>
                                        {a.slots}<span>slots</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Hero graphic */}
                    <div className="hero__graphic fade-in">
                        <div className="parking-card-demo">
                            <div className="pcd__header">
                                <div className="pcd__dot green" /><div className="pcd__dot yellow" /><div className="pcd__dot red" />
                                <span>Parking Area A — Live</span>
                            </div>
                            <div className="pcd__grid">
                                {Array.from({ length: 20 }).map((_, i) => (
                                    <div key={i} className={`pcd__slot ${i < 8 ? 'occ' : i < 11 ? 'res' : 'avail'}`}>
                                        {`A${String(i + 1).padStart(2, '0')}`}
                                    </div>
                                ))}
                            </div>
                            <div className="pcd__legend">
                                <span><span className="pcd__ind pcd__ind--avail" />Available</span>
                                <span><span className="pcd__ind pcd__ind--occ" />Occupied</span>
                                <span><span className="pcd__ind pcd__ind--res" />Reserved</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── STATUS BAR ── */}
            <section className="status-bar">
                <div className="container status-bar__inner">
                    <div className="status-bar__live">
                        <span className="live-dot" />
                        <span>Live Status</span>
                    </div>
                    <div className="status-bar__items">
                        <div className="status-item status-item--good">
                            <span className="status-dot dot-available" />Available slots across campus
                        </div>
                        <div className="vr" />
                        <span className="status-bar__note">Auto-refreshes every 30s</span>
                    </div>
                    <Link to="/availability" className="btn btn-sm btn-primary">View All →</Link>
                </div>
            </section>

            {/* ── FEATURES ── */}
            <section className="section section--features">
                <div className="container">
                    <div className="section-header fade-up">
                        <div className="section-badge">✦ Platform Features</div>
                        <h2>Everything You Need, Nothing You Don't</h2>
                        <p>A purpose-built parking system for the Bharati Vidyapeeth campus community</p>
                    </div>
                    <div className="features-grid">
                        {features.map((f, i) => (
                            <div key={f.title} className={`feature-card fade-up fade-up-${(i % 4) + 1}`}>
                                <div className="feature-icon-box" style={{ background: f.bg, color: f.color }}>{f.icon}</div>
                                <h3>{f.title}</h3>
                                <p>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section className="section section--how">
                <div className="container">
                    <div className="section-header fade-up">
                        <div className="section-badge">✦ Simple Process</div>
                        <h2>Book Parking in 3 Steps</h2>
                        <p>From registration to confirmed booking in under a minute</p>
                    </div>
                    <div className="steps-row">
                        {[
                            { n: '01', icon: '📝', title: 'Create Your Account', desc: 'Register with your name, email, mobile and vehicle number. Takes under 60 seconds.' },
                            { n: '02', icon: '🔍', title: 'Check Live Availability', desc: 'See real-time slot status for all three parking areas — Area A, B and C.' },
                            { n: '03', icon: '✅', title: 'Confirm Your Booking', desc: 'Choose a slot, enter your details and your slot is instantly reserved for you.' },
                        ].map((s, i) => (
                            <div key={s.n} className={`step-item fade-up fade-up-${i + 1}`}>
                                <div className="step-num">{s.n}</div>
                                <div className="step-icon-box">{s.icon}</div>
                                <h3>{s.title}</h3>
                                <p>{s.desc}</p>
                                {i < 2 && <div className="step-arrow">→</div>}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            {!user && (
                <section className="cta-section">
                    <div className="cta-orb cta-orb-1" />
                    <div className="cta-orb cta-orb-2" />
                    <div className="container cta-inner fade-up">
                        <div className="section-badge" style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.9)', background: 'rgba(255,255,255,0.1)' }}>
                            ✦ Get Started Free
                        </div>
                        <h2>Ready to Park Smarter?</h2>
                        <p>Join students and staff already using BVP Smart Parking on campus.</p>
                        <div className="cta-actions">
                            <Link to="/register" className="btn btn-lg" style={{ background: '#fff', color: 'var(--primary)', fontWeight: 700 }}>
                                Create Account →
                            </Link>
                            <Link to="/availability" className="btn btn-lg btn-outline" style={{ borderColor: 'rgba(255,255,255,0.5)', color: 'var(--primary)' }}>
                                View Availability
                            </Link>
                        </div>
                    </div>
                </section>
            )}
        </div>
    )
}

export default Home
