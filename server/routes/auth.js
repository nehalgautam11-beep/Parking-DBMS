const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const demoStore = require('../lib/demoStore');
const router = express.Router();

const generateToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { name, email, mobile, vehicleNumber, password, role } = req.body;

        if (req.demoMode) {
            const created = demoStore.createUser({ name, email, mobile, vehicleNumber, password, role: role || 'student' });
            if (!created) return res.status(400).json({ message: 'Email already registered. Please login.' });
            return res.status(201).json({ ...created, token: generateToken(created._id) });
        }

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: 'Email already registered. Please login.' });

        const user = await User.create({ name, email, mobile, vehicleNumber, password, role: role || 'student' });
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            vehicleNumber: user.vehicleNumber,
            role: user.role,
            token: generateToken(user._id),
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (req.demoMode) {
            const user = demoStore.findUserByEmail(email);
            if (!user || user.password !== password) {
                return res.status(401).json({ message: 'Invalid email or password.' });
            }
            return res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                vehicleNumber: user.vehicleNumber,
                role: user.role,
                token: generateToken(user._id),
            });
        }

        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password)))
            return res.status(401).json({ message: 'Invalid email or password.' });

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            vehicleNumber: user.vehicleNumber,
            role: user.role,
            token: generateToken(user._id),
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/auth/me
router.get('/me', require('../middleware/authMiddleware'), async (req, res) => {
    res.json(req.user);
});

module.exports = router;
