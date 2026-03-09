const express = require('express');
const Booking = require('../models/Booking');
const ParkingSlot = require('../models/ParkingSlot');
const ParkingArea = require('../models/ParkingArea');
const protect = require('../middleware/authMiddleware');
const router = express.Router();

// POST /api/booking  – create a booking
router.post('/', protect, async (req, res) => {
    try {
        const { slotId, areaId, vehicleNumber, startTime, endTime } = req.body;

        const slot = await ParkingSlot.findById(slotId);
        if (!slot) return res.status(404).json({ message: 'Slot not found.' });
        if (slot.status !== 'available')
            return res.status(400).json({ message: 'This slot is not available. Please choose another slot.' });

        const booking = await Booking.create({
            user: req.user._id,
            slot: slotId,
            area: areaId,
            vehicleNumber: vehicleNumber.toUpperCase(),
            startTime,
            endTime,
        });

        slot.status = 'reserved';
        slot.currentBooking = booking._id;
        await slot.save();

        const populated = await Booking.findById(booking._id)
            .populate('slot', 'slotNumber')
            .populate('area', 'name type');

        res.status(201).json(populated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/booking/mine
router.get('/mine', protect, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate('slot', 'slotNumber')
            .populate('area', 'name type')
            .sort('-createdAt');
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/booking/stats
router.get('/stats', async (req, res) => {
    try {
        const totalSlots = await ParkingSlot.countDocuments();
        const availableSlots = await ParkingSlot.countDocuments({ status: 'available' });
        const occupiedSlots = await ParkingSlot.countDocuments({ status: 'occupied' });
        const reservedSlots = await ParkingSlot.countDocuments({ status: 'reserved' });

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const bookingsToday = await Booking.countDocuments({ createdAt: { $gte: today } });

        const utilisation = totalSlots > 0
            ? Math.round(((occupiedSlots + reservedSlots) / totalSlots) * 100)
            : 0;

        const areas = await ParkingArea.find();
        const areaStats = await Promise.all(areas.map(async (area) => {
            const total = await ParkingSlot.countDocuments({ area: area._id });
            const available = await ParkingSlot.countDocuments({ area: area._id, status: 'available' });
            return { name: area.name, type: area.type, total, available };
        }));

        res.json({ totalSlots, availableSlots, occupiedSlots, reservedSlots, bookingsToday, utilisation, areaStats });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE /api/booking/:id  – cancel a booking
router.delete('/:id', protect, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found.' });
        if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin')
            return res.status(403).json({ message: 'Not authorised to cancel this booking.' });

        booking.status = 'cancelled';
        await booking.save();

        const slot = await ParkingSlot.findById(booking.slot);
        if (slot) {
            slot.status = 'available';
            slot.currentBooking = null;
            await slot.save();
        }

        res.json({ message: 'Booking cancelled successfully.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
