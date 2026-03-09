const mongoose = require('mongoose');

const parkingSlotSchema = new mongoose.Schema({
    area: { type: mongoose.Schema.Types.ObjectId, ref: 'ParkingArea', required: true },
    slotNumber: { type: String, required: true },
    status: { type: String, enum: ['available', 'occupied', 'reserved'], default: 'available' },
    currentBooking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', default: null },
}, { timestamps: true });

parkingSlotSchema.index({ area: 1, slotNumber: 1 }, { unique: true });

module.exports = mongoose.model('ParkingSlot', parkingSlotSchema);
