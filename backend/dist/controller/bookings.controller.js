"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBooking = exports.updateBooking = exports.createBooking = exports.getBookingById = exports.getAllBookings = void 0;
const postgres_1 = __importDefault(require("../database/postgres"));
const isValidDateRange = (checkIn, checkOut) => new Date(checkIn) < new Date(checkOut);
// ==============================
// GET ALL BOOKINGS
// ==============================
const getAllBookings = async (req, res) => {
    try {
        const { rows } = await postgres_1.default.query(`
      SELECT 
        g.full_name AS guest_name,
        g.id AS guest_id,
        r.room_number AS room_number,
        r.id AS room_id,
        rt.name AS room_type,
        rt.id AS room_type_id,
        b.check_in,
        b.check_out,
        b.total_price,
        b.status,
        b.id AS booking_id
      FROM bookings b
      LEFT JOIN guests g ON b.guest_id = g.id
      LEFT JOIN rooms r ON b.room_id = r.id
      LEFT JOIN room_types rt ON r.type_id = rt.id
      ORDER BY b.created_at DESC
    `);
        res.json(rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getAllBookings = getAllBookings;
// ==============================
// GET BOOKING BY ID
// ==============================
const getBookingById = async (req, res) => {
    const { id } = req.params;
    // For UUID, we just use the string directly
    try {
        const { rows } = await postgres_1.default.query(`
      SELECT 
        g.full_name AS guest_name,
        g.id AS guest_id,
        r.room_number AS room_number,
        r.id AS room_id,
        rt.name AS room_type,
        rt.id AS room_type_id,
        b.check_in,
        b.check_out,
        b.total_price,
        b.status,
        b.id AS booking_id
      FROM bookings b
      LEFT JOIN guests g ON b.guest_id = g.id
      LEFT JOIN rooms r ON b.room_id = r.id
      LEFT JOIN room_types rt ON r.type_id = rt.id
      WHERE b.id=$1
    `, [id]);
        if (!rows.length)
            return res.status(404).json({ message: 'Booking not found' });
        res.json(rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getBookingById = getBookingById;
// ==============================
// CREATE BOOKING
// ==============================
const createBooking = async (req, res) => {
    const { guest_id, room_id, check_in, check_out, total_price } = req.body;
    if (!guest_id || !room_id || !check_in || !check_out) {
        return res.status(400).json({ message: 'Missing fields' });
    }
    if (!isValidDateRange(check_in, check_out)) {
        return res.status(400).json({ message: 'Invalid date range' });
    }
    await postgres_1.default.query('BEGIN');
    try {
        const insert = await postgres_1.default.query(`INSERT INTO bookings (guest_id, room_id, check_in, check_out, total_price) 
       VALUES ($1,$2,$3,$4,$5) RETURNING id`, [guest_id, room_id, check_in, check_out, total_price || null]);
        // Update room status
        await postgres_1.default.query(`UPDATE rooms SET status='occupied' WHERE id=$1`, [room_id]);
        // Ambil full detail untuk response
        const { rows } = await postgres_1.default.query(`
      SELECT 
        g.full_name AS guest_name,
        g.id AS guest_id,
        r.room_number AS room_number,
        r.id AS room_id,
        rt.name AS room_type,
        rt.id AS room_type_id,
        b.check_in,
        b.check_out,
        b.total_price,
        b.status,
        b.id AS booking_id
      FROM bookings b
      LEFT JOIN guests g ON b.guest_id = g.id
      LEFT JOIN rooms r ON b.room_id = r.id
      LEFT JOIN room_types rt ON r.type_id = rt.id
      WHERE b.id=$1
    `, [insert.rows[0].id]);
        await postgres_1.default.query('COMMIT');
        res.status(201).json(rows[0]);
    }
    catch (err) {
        await postgres_1.default.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.createBooking = createBooking;
// ==============================
// UPDATE BOOKING
// ==============================
const updateBooking = async (req, res) => {
    const { id } = req.params;
    const { guest_id, room_id, check_in, check_out, total_price, status } = req.body;
    if (check_in && check_out && !(new Date(check_in) < new Date(check_out))) {
        return res.status(400).json({ message: 'Invalid date range' });
    }
    await postgres_1.default.query('BEGIN');
    try {
        const prev = await postgres_1.default.query('SELECT room_id FROM bookings WHERE id=$1', [id]);
        if (!prev.rows.length) {
            await postgres_1.default.query('ROLLBACK');
            return res.status(404).json({ message: 'Booking not found' });
        }
        const prevRoomId = prev.rows[0].room_id;
        await postgres_1.default.query(`UPDATE bookings 
       SET guest_id=COALESCE($1,guest_id), 
           room_id=COALESCE($2,room_id), 
           check_in=COALESCE($3,check_in), 
           check_out=COALESCE($4,check_out), 
           total_price=COALESCE($5,total_price), 
           status=COALESCE($6,status) 
       WHERE id=$7`, [guest_id || null, room_id || null, check_in || null, check_out || null, total_price ?? null, status || null, id]);
        // Update room status jika berubah
        if (room_id && prevRoomId && room_id !== prevRoomId) {
            await postgres_1.default.query(`UPDATE rooms SET status='available' WHERE id=$1`, [prevRoomId]);
            await postgres_1.default.query(`UPDATE rooms SET status='occupied' WHERE id=$1`, [room_id]);
        }
        // Ambil full detail untuk response
        const { rows } = await postgres_1.default.query(`
      SELECT 
        g.full_name AS guest_name,
        g.id AS guest_id,
        r.room_number AS room_number,
        r.id AS room_id,
        rt.name AS room_type,
        rt.id AS room_type_id,
        b.check_in,
        b.check_out,
        b.total_price,
        b.status,
        b.id AS booking_id
      FROM bookings b
      LEFT JOIN guests g ON b.guest_id = g.id
      LEFT JOIN rooms r ON b.room_id = r.id
      LEFT JOIN room_types rt ON r.type_id = rt.id
      WHERE b.id=$1
    `, [id]);
        await postgres_1.default.query('COMMIT');
        res.json(rows[0]);
    }
    catch (err) {
        await postgres_1.default.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateBooking = updateBooking;
// ==============================
// DELETE BOOKING
// ==============================
const deleteBooking = async (req, res) => {
    const { id } = req.params;
    await postgres_1.default.query('BEGIN');
    try {
        const prev = await postgres_1.default.query('SELECT room_id FROM bookings WHERE id=$1', [id]);
        if (!prev.rows.length) {
            await postgres_1.default.query('ROLLBACK');
            return res.status(404).json({ message: 'Booking not found' });
        }
        const roomId = prev.rows[0].room_id;
        await postgres_1.default.query('DELETE FROM bookings WHERE id=$1', [id]);
        if (roomId) {
            await postgres_1.default.query(`UPDATE rooms SET status='available' WHERE id=$1`, [roomId]);
        }
        await postgres_1.default.query('COMMIT');
        res.json({ message: 'Booking deleted successfully' });
    }
    catch (err) {
        await postgres_1.default.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.deleteBooking = deleteBooking;
//# sourceMappingURL=bookings.controller.js.map