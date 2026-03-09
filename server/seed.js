require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');

const User = require('./models/User');
const ParkingArea = require('./models/ParkingArea');
const ParkingSlot = require('./models/ParkingSlot');
const Booking = require('./models/Booking');

const seed = async () => {
    try {
        await connectDB();

        // Clear existing data
        await Booking.deleteMany();
        await ParkingSlot.deleteMany();
        await ParkingArea.deleteMany();
        await User.deleteMany();

        console.log('Cleared existing data...');

        // Create admin user
        const admin = await User.create({
            name: 'Campus Admin',
            email: 'admin@bvp.edu.in',
            mobile: '9800000000',
            vehicleNumber: 'MH12AB0000',
            password: 'admin@123',
            role: 'admin',
        });

        // Create sample student
        await User.create({
            name: 'Rahul Sharma',
            email: 'rahul.sharma@bvp.edu.in',
            mobile: '9876543210',
            vehicleNumber: 'MH12CD1234',
            password: 'student@123',
            role: 'student',
        });

        // Create sample staff
        await User.create({
            name: 'Prof. Anita Desai',
            email: 'anita.desai@bvp.edu.in',
            mobile: '9812345678',
            vehicleNumber: 'MH14EF5678',
            password: 'staff@123',
            role: 'staff',
        });

        console.log('Users created...');

        // Create Parking Areas
        const areaA = await ParkingArea.create({
            name: 'Parking Area A',
            type: 'two-wheeler',
            description: 'Two Wheeler Parking – Students',
            totalSlots: 40,
            location: 'Near Main Gate, Left Side',
        });

        const areaB = await ParkingArea.create({
            name: 'Parking Area B',
            type: 'four-wheeler',
            description: 'Four Wheeler Parking – Students & Visitors',
            totalSlots: 20,
            location: 'Near Administrative Block',
        });

        const areaC = await ParkingArea.create({
            name: 'Parking Area C',
            type: 'staff',
            description: 'Staff & Faculty Parking',
            totalSlots: 15,
            location: 'Near Faculty Block, East Side',
        });

        console.log('Parking areas created...');

        // Create slots for Area A (2W – 40 slots)
        const slotStatuses = ['available', 'occupied', 'reserved'];
        for (let i = 1; i <= 40; i++) {
            let status = 'available';
            if (i <= 12) status = 'occupied';
            else if (i <= 16) status = 'reserved';
            await ParkingSlot.create({ area: areaA._id, slotNumber: `A${String(i).padStart(2, '0')}`, status });
        }

        // Create slots for Area B (4W – 20 slots)
        for (let i = 1; i <= 20; i++) {
            let status = 'available';
            if (i <= 7) status = 'occupied';
            else if (i <= 9) status = 'reserved';
            await ParkingSlot.create({ area: areaB._id, slotNumber: `B${String(i).padStart(2, '0')}`, status });
        }

        // Create slots for Area C (Staff – 15 slots)
        for (let i = 1; i <= 15; i++) {
            let status = 'available';
            if (i <= 5) status = 'occupied';
            else if (i <= 7) status = 'reserved';
            await ParkingSlot.create({ area: areaC._id, slotNumber: `C${String(i).padStart(2, '0')}`, status });
        }

        console.log('Parking slots created...');
        console.log('\n✅ Seed data inserted successfully!');
        console.log('------------------------------------');
        console.log('Admin Login:   admin@bvp.edu.in   / admin@123');
        console.log('Student Login: rahul.sharma@bvp.edu.in / student@123');
        console.log('Staff Login:   anita.desai@bvp.edu.in / staff@123');
        console.log('------------------------------------');

        process.exit(0);
    } catch (err) {
        console.error('Seed error:', err.message);
        process.exit(1);
    }
};

seed();
