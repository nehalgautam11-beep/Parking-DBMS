const mongoose = require('mongoose');

const parkingAreaSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['two-wheeler', 'four-wheeler', 'staff'], required: true },
    description: { type: String },
    totalSlots: { type: Number, required: true },
    location: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('ParkingArea', parkingAreaSchema);
