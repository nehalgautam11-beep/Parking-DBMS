const express = require('express');
const protect = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminMiddleware');
const Booking = require('../models/Booking');
const User = require('../models/User');
const ParkingSlot = require('../models/ParkingSlot');
const ParkingArea = require('../models/ParkingArea');
const router = express.Router();

// All admin routes require auth + admin role
router.use(protect, adminOnly);

// GET /api/admin/bookings
router.get('/bookings', async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('user', 'name email')
            .populate('slot', 'slotNumber')
            .populate('area', 'name')
            .sort('-createdAt');
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/admin/users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password').sort('-createdAt');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/admin/slots  – add a slot
router.post('/slots', async (req, res) => {
    try {
        const { areaId, slotNumber } = req.body;
        const area = await ParkingArea.findById(areaId);
        if (!area) return res.status(404).json({ message: 'Parking area not found.' });
        const slot = await ParkingSlot.create({ area: areaId, slotNumber });
        res.status(201).json(slot);
    } catch (err) {
        if (err.code === 11000) return res.status(400).json({ message: 'Slot number already exists in this area.' });
        res.status(500).json({ message: err.message });
    }
});

// DELETE /api/admin/slots/:id
router.delete('/slots/:id', async (req, res) => {
    try {
        const slot = await ParkingSlot.findById(req.params.id);
        if (!slot) return res.status(404).json({ message: 'Slot not found.' });
        await slot.deleteOne();
        res.json({ message: 'Slot removed successfully.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PATCH /api/admin/slots/:id  – update slot status
router.patch('/slots/:id', async (req, res) => {
    try {
        const slot = await ParkingSlot.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        if (!slot) return res.status(404).json({ message: 'Slot not found.' });
        res.json(slot);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found.' });
        if (user.role === 'admin') return res.status(400).json({ message: 'Cannot delete admin accounts.' });
        await user.deleteOne();
        res.json({ message: 'User removed successfully.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/admin/slots  – all slots
router.get('/slots', async (req, res) => {
    try {
        const slots = await ParkingSlot.find().populate('area', 'name type').sort('slotNumber');
        res.json(slots);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
