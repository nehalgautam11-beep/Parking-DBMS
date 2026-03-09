require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const demoStore = require('./lib/demoStore');

const app = express();

const mongoConfigMeta = () => {
    const raw = String(process.env.MONGO_URI || process.env.MONGODB_URI || '').trim().replace(/^['"]+|['"]+$/g, '');
    const host = raw.match(/@([^/?]+)/)?.[1] || null;
    const dbName = raw.match(/@[^/]+\/([^?]+)/)?.[1] || null;
    return {
        mongoConfigured: Boolean(raw),
        mongoHost: host,
        mongoDbName: dbName,
    };
};

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.CLIENT_URL,
    process.env.CLIENT_URL_2,
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('CORS not allowed for this origin.'));
    },
    credentials: true
}));
app.use(express.json());

// Ensure DB is connected for each request in serverless runtime.
app.use(async (req, res, next) => {
    try {
        await connectDB();
        req.dbConnected = true;
        req.demoMode = false;
        next();
    } catch (error) {
        req.dbConnected = false;
        req.dbError = error.message;
        req.demoMode = demoStore.isEnabled();
        if (req.demoMode) return next();
        res.status(500).json({ message: `Database connection failed: ${error.message}` });
    }
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/parking', require('./routes/parking'));
app.use('/api/booking', require('./routes/booking'));
app.use('/api/admin', require('./routes/admin'));

// Runtime diagnostics (no secrets exposed)
app.get('/api/_diag', (req, res) => {
    res.json({
        ok: true,
        dbConnected: Boolean(req.dbConnected),
        demoMode: Boolean(req.demoMode),
        dbError: req.dbError || null,
        env: {
            hasMONGO_URI: Boolean(process.env.MONGO_URI),
            hasMONGODB_URI: Boolean(process.env.MONGODB_URI),
            nodeEnv: process.env.NODE_ENV || null,
            vercelEnv: process.env.VERCEL_ENV || null,
            commit: process.env.VERCEL_GIT_COMMIT_SHA || null,
        },
        mongo: mongoConfigMeta(),
    });
});

// Health check
app.get('/', (req, res) => res.json({ message: 'Bharati Vidyapeeth Smart Parking API is running.' }));

// 404
app.use((req, res) => res.status(404).json({ message: 'Route not found.' }));

module.exports = app;
