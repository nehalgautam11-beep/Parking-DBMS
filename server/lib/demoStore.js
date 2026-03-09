const { randomUUID } = require('crypto');

const now = () => new Date().toISOString();

const users = [
    {
        _id: 'u_admin',
        name: 'Campus Admin',
        email: 'admin@bvp.edu.in',
        mobile: '9800000000',
        vehicleNumber: 'MH12AB0000',
        password: 'admin@123',
        role: 'admin',
        createdAt: now(),
    },
    {
        _id: 'u_student',
        name: 'Rahul Sharma',
        email: 'rahul.sharma@bvp.edu.in',
        mobile: '9876543210',
        vehicleNumber: 'MH12CD1234',
        password: 'student@123',
        role: 'student',
        createdAt: now(),
    },
    {
        _id: 'u_staff',
        name: 'Prof. Anita Desai',
        email: 'anita.desai@bvp.edu.in',
        mobile: '9812345678',
        vehicleNumber: 'MH14EF5678',
        password: 'staff@123',
        role: 'staff',
        createdAt: now(),
    },
];

const areas = [
    {
        _id: 'a1',
        name: 'Parking Area A',
        type: 'two-wheeler',
        description: 'Two Wheeler Parking – Students',
        totalSlots: 40,
        location: 'Near Main Gate, Left Side',
    },
    {
        _id: 'a2',
        name: 'Parking Area B',
        type: 'four-wheeler',
        description: 'Four Wheeler Parking – Students & Visitors',
        totalSlots: 20,
        location: 'Near Administrative Block',
    },
    {
        _id: 'a3',
        name: 'Parking Area C',
        type: 'staff',
        description: 'Staff & Faculty Parking',
        totalSlots: 15,
        location: 'Near Faculty Block, East Side',
    },
];

const slots = [];
const bookings = [];

const addSlots = (areaId, prefix, count, occupiedCount, reservedCount) => {
    for (let i = 1; i <= count; i++) {
        let status = 'available';
        if (i <= occupiedCount) status = 'occupied';
        else if (i <= occupiedCount + reservedCount) status = 'reserved';

        slots.push({
            _id: `s_${prefix}${String(i).padStart(2, '0')}`,
            area: areaId,
            slotNumber: `${prefix}${String(i).padStart(2, '0')}`,
            status,
            currentBooking: null,
            createdAt: now(),
        });
    }
};

addSlots('a1', 'A', 40, 12, 4);
addSlots('a2', 'B', 20, 7, 2);
addSlots('a3', 'C', 15, 5, 2);

const publicUser = (u) => {
    if (!u) return null;
    const { password, ...rest } = u;
    return { ...rest };
};

const withCounts = (area) => {
    const inArea = slots.filter((s) => s.area === area._id);
    const total = inArea.length;
    const available = inArea.filter((s) => s.status === 'available').length;
    const occupied = inArea.filter((s) => s.status === 'occupied').length;
    const reserved = inArea.filter((s) => s.status === 'reserved').length;
    return { ...area, total, available, occupied, reserved };
};

const populateBooking = (b) => {
    const user = users.find((u) => u._id === b.user);
    const slot = slots.find((s) => s._id === b.slot);
    const area = areas.find((a) => a._id === b.area);

    return {
        ...b,
        user: user ? { _id: user._id, name: user.name, email: user.email } : null,
        slot: slot ? { _id: slot._id, slotNumber: slot.slotNumber } : null,
        area: area ? { _id: area._id, name: area.name, type: area.type } : null,
    };
};

const getStats = () => {
    const totalSlots = slots.length;
    const availableSlots = slots.filter((s) => s.status === 'available').length;
    const occupiedSlots = slots.filter((s) => s.status === 'occupied').length;
    const reservedSlots = slots.filter((s) => s.status === 'reserved').length;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const bookingsToday = bookings.filter((b) => new Date(b.createdAt) >= startOfToday).length;

    const utilisation = totalSlots > 0
        ? Math.round(((occupiedSlots + reservedSlots) / totalSlots) * 100)
        : 0;

    const areaStats = areas.map((a) => {
        const inArea = slots.filter((s) => s.area === a._id);
        return {
            name: a.name,
            type: a.type,
            total: inArea.length,
            available: inArea.filter((s) => s.status === 'available').length,
        };
    });

    return { totalSlots, availableSlots, occupiedSlots, reservedSlots, bookingsToday, utilisation, areaStats };
};

module.exports = {
    isEnabled() {
        return process.env.ALLOW_DEMO_FALLBACK !== 'false';
    },
    findUserById(id) {
        return publicUser(users.find((u) => u._id === id));
    },
    findUserByEmail(email) {
        return users.find((u) => u.email.toLowerCase() === String(email || '').toLowerCase()) || null;
    },
    createUser({ name, email, mobile, vehicleNumber, password, role = 'student' }) {
        if (this.findUserByEmail(email)) return null;
        const user = {
            _id: `u_${randomUUID()}`,
            name,
            email: String(email).toLowerCase(),
            mobile,
            vehicleNumber: String(vehicleNumber).toUpperCase(),
            password,
            role,
            createdAt: now(),
        };
        users.push(user);
        return publicUser(user);
    },
    listAreas() {
        return areas.map(withCounts);
    },
    listSlotsByArea(areaId) {
        return slots
            .filter((s) => s.area === areaId)
            .sort((a, b) => a.slotNumber.localeCompare(b.slotNumber))
            .map((s) => ({ ...s }));
    },
    createBooking({ userId, slotId, areaId, vehicleNumber, startTime, endTime }) {
        const slot = slots.find((s) => s._id === slotId);
        if (!slot) throw new Error('Slot not found.');
        if (slot.status !== 'available') throw new Error('This slot is not available. Please choose another slot.');
        if (slot.area !== areaId) throw new Error('Slot does not belong to selected area.');

        const booking = {
            _id: `b_${randomUUID()}`,
            user: userId,
            slot: slotId,
            area: areaId,
            vehicleNumber: String(vehicleNumber).toUpperCase(),
            startTime,
            endTime,
            status: 'active',
            createdAt: now(),
        };
        bookings.push(booking);
        slot.status = 'reserved';
        slot.currentBooking = booking._id;
        return populateBooking(booking);
    },
    listMyBookings(userId) {
        return bookings
            .filter((b) => b.user === userId)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map(populateBooking);
    },
    cancelBooking(bookingId, currentUser) {
        const booking = bookings.find((b) => b._id === bookingId);
        if (!booking) return { code: 404, message: 'Booking not found.' };

        if (booking.user !== currentUser._id && currentUser.role !== 'admin') {
            return { code: 403, message: 'Not authorised to cancel this booking.' };
        }

        booking.status = 'cancelled';
        const slot = slots.find((s) => s._id === booking.slot);
        if (slot) {
            slot.status = 'available';
            slot.currentBooking = null;
        }
        return { code: 200, message: 'Booking cancelled successfully.' };
    },
    stats: getStats,
    listAdminBookings() {
        return bookings
            .map(populateBooking)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
    listAdminUsers() {
        return users.map(publicUser).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
    addSlot({ areaId, slotNumber }) {
        const area = areas.find((a) => a._id === areaId);
        if (!area) return { code: 404, message: 'Parking area not found.' };

        const exists = slots.some((s) => s.area === areaId && s.slotNumber.toUpperCase() === String(slotNumber).toUpperCase());
        if (exists) return { code: 400, message: 'Slot number already exists in this area.' };

        const slot = {
            _id: `s_${randomUUID()}`,
            area: areaId,
            slotNumber: String(slotNumber).toUpperCase(),
            status: 'available',
            currentBooking: null,
            createdAt: now(),
        };
        slots.push(slot);
        return { code: 201, slot };
    },
    removeSlot(id) {
        const idx = slots.findIndex((s) => s._id === id);
        if (idx === -1) return { code: 404, message: 'Slot not found.' };
        slots.splice(idx, 1);
        return { code: 200, message: 'Slot removed successfully.' };
    },
    updateSlotStatus(id, status) {
        const slot = slots.find((s) => s._id === id);
        if (!slot) return { code: 404, message: 'Slot not found.' };
        slot.status = status;
        return { code: 200, slot };
    },
    removeUser(id) {
        const user = users.find((u) => u._id === id);
        if (!user) return { code: 404, message: 'User not found.' };
        if (user.role === 'admin') return { code: 400, message: 'Cannot delete admin accounts.' };
        const idx = users.findIndex((u) => u._id === id);
        users.splice(idx, 1);
        return { code: 200, message: 'User removed successfully.' };
    },
    listSlots() {
        return slots
            .map((s) => {
                const area = areas.find((a) => a._id === s.area);
                return {
                    ...s,
                    area: area ? { _id: area._id, name: area.name, type: area.type } : null,
                };
            })
            .sort((a, b) => a.slotNumber.localeCompare(b.slotNumber));
    },
};
