const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    slot: { type: mongoose.Schema.Types.ObjectId, ref: 'ParkingSlot', required: true },
    area: { type: mongoose.Schema.Types.ObjectId, ref: 'ParkingArea', required: true },
    vehicleNumber: { type: String, required: true, uppercase: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
