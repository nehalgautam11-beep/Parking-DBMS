const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    mobile: { type: String, required: true },
    vehicleNumber: { type: String, required: true, uppercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'staff', 'admin'], default: 'student' },
}, { timestamps: true });

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.matchPassword = async function (entered) {
    return await bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', userSchema);
