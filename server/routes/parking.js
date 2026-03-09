const express = require('express');
const ParkingArea = require('../models/ParkingArea');
const ParkingSlot = require('../models/ParkingSlot');
const demoStore = require('../lib/demoStore');
const router = express.Router();

// GET /api/parking/areas  – all areas with slot counts
router.get('/areas', async (req, res) => {
    try {
        if (req.demoMode) {
            return res.json(demoStore.listAreas());
        }

        const areas = await ParkingArea.find();
        const result = await Promise.all(areas.map(async (area) => {
            const total = await ParkingSlot.countDocuments({ area: area._id });
            const available = await ParkingSlot.countDocuments({ area: area._id, status: 'available' });
            const occupied = await ParkingSlot.countDocuments({ area: area._id, status: 'occupied' });
            const reserved = await ParkingSlot.countDocuments({ area: area._id, status: 'reserved' });
            return { ...area.toObject(), total, available, occupied, reserved };
        }));
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/parking/slots/:areaId
router.get('/slots/:areaId', async (req, res) => {
    try {
        if (req.demoMode) {
            return res.json(demoStore.listSlotsByArea(req.params.areaId));
        }

        const slots = await ParkingSlot.find({ area: req.params.areaId }).sort('slotNumber');
        res.json(slots);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
