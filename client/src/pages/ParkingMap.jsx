import './ParkingMap.css'

const ParkingMap = () => (
    <>
        <div className="map-page-header">
            <div className="container">
                <h1>Campus Parking Map</h1>
            </div>
        </div>

        <div className="page-wrapper">
            <div className="container">
                <div className="map-legend fade-up">
                    <span><span className="ml ml-a" />Zone A · Two Wheelers</span>
                    <span><span className="ml ml-b" />Zone B · Four Wheelers</span>
                    <span><span className="ml ml-c" />Zone C · Staff Reserved</span>
                    <span><span className="ml ml-road" />Transit Road</span>
                    <span><span className="ml ml-building" />Campus Blocks</span>
                </div>

                <div className="card map-card fade-up">
                    <svg viewBox="0 0 800 560" className="campus-map" role="img" aria-label="Campus Parking Map">
                        {/* Background */}
                        <rect width="800" height="560" fill="#f8fafc" rx="0" />

                        {/* Main road - horizontal */}
                        <rect x="0" y="240" width="800" height="60" fill="#f1f5f9" rx="0" />
                        <line x1="0" y1="270" x2="800" y2="270" stroke="#fff" strokeWidth="2" strokeDasharray="15,10" />
                        <text x="400" y="275" textAnchor="middle" fontSize="11" fill="#94a3b8" fontWeight="600" style={{ userSelect: 'none' }}>MAIN CAMPUS ARTERY</text>

                        {/* Entrance */}
                        <rect x="340" y="520" width="120" height="40" fill="#e2e8f0" rx="4" />
                        <text x="400" y="546" textAnchor="middle" fontSize="12" fontWeight="700" fill="#475569">MAIN ENTRANCE</text>

                        {/* Admin Block */}
                        <rect x="20" y="20" width="200" height="100" fill="#e2e8f0" rx="8" />
                        <text x="120" y="62" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1e293b">ADMINISTRATION</text>

                        {/* Area A - 2 Wheeler */}
                        <rect x="20" y="140" width="180" height="90" fill="#eef2ff" rx="10" stroke="#4f46e5" strokeWidth="1.5" />
                        <text x="110" y="175" textAnchor="middle" fontSize="13" fontWeight="800" fill="#4f46e5">ZONE A</text>
                        <text x="110" y="195" textAnchor="middle" fontSize="11" fill="#4338ca">🛵 Two Wheelers</text>

                        {/* Area B - 4 Wheeler */}
                        <rect x="580" y="20" width="200" height="130" fill="#ecfdf5" rx="10" stroke="#059669" strokeWidth="1.5" />
                        <text x="680" y="70" textAnchor="middle" fontSize="13" fontWeight="800" fill="#059669">ZONE B</text>
                        <text x="680" y="92" textAnchor="middle" fontSize="11" fill="#047857">🚗 Four Wheelers</text>

                        {/* Area C - Staff */}
                        <rect x="580" y="165" width="200" height="65" fill="#fffbeb" rx="10" stroke="#d97706" strokeWidth="1.5" />
                        <text x="680" y="196" textAnchor="middle" fontSize="13" fontWeight="800" fill="#d97706">ZONE C</text>
                        <text x="680" y="216" textAnchor="middle" fontSize="11" fill="#b45309">🏢 Staff Reserved</text>

                        {/* Academic Block */}
                        <rect x="260" y="20" width="280" height="130" fill="#f1f5f9" rx="8" />
                        <text x="400" y="72" textAnchor="middle" fontSize="13" fontWeight="800" fill="#1e293b">ACADEMIC COMPLEX</text>
                        <text x="400" y="94" textAnchor="middle" fontSize="11" fill="#64748b">Bharati Vidyapeeth College</text>

                        {/* Sports */}
                        <rect x="20" y="390" width="340" height="130" fill="#ecfdf5" rx="8" />
                        <text x="190" y="448" textAnchor="middle" fontSize="13" fontWeight="700" fill="#059669">CENTRAL GROUND</text>

                        {/* Scale */}
                        <rect x="20" y="520" width="100" height="2" fill="#cbd5e1" />
                        <text x="20" y="515" fontSize="10" fill="#94a3b8">0m</text>
                        <text x="110" y="515" fontSize="10" fill="#94a3b8">50m</text>
                    </svg>
                </div>

                <div className="grid-3" style={{ marginTop: 32 }}>
                    {[
                        { icon: '🛵', name: 'Zone A', loc: 'Near Entrance', slots: '40', color: '#4f46e5' },
                        { icon: '🚗', name: 'Zone B', loc: 'Admin Block', slots: '20', color: '#059669' },
                        { icon: '🏢', name: 'Zone C', loc: 'Faculty Block', slots: '15', color: '#d97706' },
                    ].map((z, i) => (
                        <div key={z.name} className={`card zone-info-card fade-up fade-up-${i + 1}`}>
                            <div className="zone-icon">{z.icon}</div>
                            <h3 style={{ color: z.color }}>{z.name}</h3>
                            <p>📍 {z.loc}</p>
                            <div className="zone-slots" style={{ color: z.color }}>{z.slots} <span>Slots</span></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </>
)

export default ParkingMap
