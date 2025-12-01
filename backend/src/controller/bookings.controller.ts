// src/controllers/bookings.controller.ts
import { Request, Response } from 'express';
import pool from "../database/postgres";

const isValidDateRange = (checkIn: string, checkOut: string) => new Date(checkIn) < new Date(checkOut);

// ==============================
// GET ALL BOOKINGS
// ==============================
export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(`
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
        b.notes,
        b.id AS booking_id
      FROM bookings b
      LEFT JOIN guests g ON b.guest_id = g.id
      LEFT JOIN rooms r ON b.room_id = r.id
      LEFT JOIN room_types rt ON r.type_id = rt.id
      ORDER BY b.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ==============================
// GET BOOKING BY ID
// ==============================
export const getBookingById = async (req: Request, res: Response) => {
  const { id } = req.params;
  // For UUID, we just use the string directly
  try {
    const { rows } = await pool.query(`
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
        b.notes,
        b.id AS booking_id
      FROM bookings b
      LEFT JOIN guests g ON b.guest_id = g.id
      LEFT JOIN rooms r ON b.room_id = r.id
      LEFT JOIN room_types rt ON r.type_id = rt.id
      WHERE b.id=$1
    `, [id]);

    if (!rows.length) return res.status(404).json({ message: 'Booking not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ==============================
// CREATE BOOKING
// ==============================
export const createBooking = async (req: Request, res: Response) => {
  const { guest_id, room_id, check_in, check_out, total_price, notes } = req.body;
  if (!guest_id || !room_id || !check_in || !check_out) {
    return res.status(400).json({ message: 'Missing fields' });
  }
  if (!isValidDateRange(check_in, check_out)) {
    return res.status(400).json({ message: 'Invalid date range' });
  }

  await pool.query('BEGIN');
  try {
    const insert = await pool.query(
      `INSERT INTO bookings (guest_id, room_id, check_in, check_out, total_price, notes) 
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
      [guest_id, room_id, check_in, check_out, total_price || null, notes || null]
    );

    // Update room status
    await pool.query(`UPDATE rooms SET status='occupied' WHERE id=$1`, [room_id]);

    // Ambil full detail untuk response
    const { rows } = await pool.query(`
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
        b.notes,
        b.id AS booking_id
      FROM bookings b
      LEFT JOIN guests g ON b.guest_id = g.id
      LEFT JOIN rooms r ON b.room_id = r.id
      LEFT JOIN room_types rt ON r.type_id = rt.id
      WHERE b.id=$1
    `, [insert.rows[0].id]);

    await pool.query('COMMIT');
    res.status(201).json(rows[0]);
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ==============================
// UPDATE BOOKING
// ==============================
export const updateBooking = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { guest_id, room_id, check_in, check_out, total_price, status, notes } = req.body;

  if (check_in && check_out && !(new Date(check_in) < new Date(check_out))) {
    return res.status(400).json({ message: 'Invalid date range' });
  }

  await pool.query('BEGIN');
  try {
    const prev = await pool.query('SELECT room_id FROM bookings WHERE id=$1', [id]);
    if (!prev.rows.length) {
      await pool.query('ROLLBACK');
      return res.status(404).json({ message: 'Booking not found' });
    }
    const prevRoomId = prev.rows[0].room_id;

    await pool.query(
      `UPDATE bookings 
       SET guest_id=COALESCE($1,guest_id), 
           room_id=COALESCE($2,room_id), 
           check_in=COALESCE($3,check_in), 
           check_out=COALESCE($4,check_out), 
           total_price=COALESCE($5,total_price), 
           status=COALESCE($6,status),
           notes=COALESCE($7,notes)
       WHERE id=$8`,
      [guest_id || null, room_id || null, check_in || null, check_out || null, total_price ?? null, status || null, notes || null, id]
    );

    // Update room status jika berubah
    if (room_id && prevRoomId && room_id !== prevRoomId) {
      await pool.query(`UPDATE rooms SET status='available' WHERE id=$1`, [prevRoomId]);
      await pool.query(`UPDATE rooms SET status='occupied' WHERE id=$1`, [room_id]);
    }

    // Ambil full detail untuk response
    const { rows } = await pool.query(`
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
        b.notes,
        b.id AS booking_id
      FROM bookings b
      LEFT JOIN guests g ON b.guest_id = g.id
      LEFT JOIN rooms r ON b.room_id = r.id
      LEFT JOIN room_types rt ON r.type_id = rt.id
      WHERE b.id=$1
    `, [id]);

    await pool.query('COMMIT');
    res.json(rows[0]);
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ==============================
// DELETE BOOKING
// ==============================
export const deleteBooking = async (req: Request, res: Response) => {
  const { id } = req.params;

  await pool.query('BEGIN');
  try {
    const prev = await pool.query('SELECT room_id FROM bookings WHERE id=$1', [id]);
    if (!prev.rows.length) {
      await pool.query('ROLLBACK');
      return res.status(404).json({ message: 'Booking not found' });
    }
    const roomId = prev.rows[0].room_id;

    await pool.query('DELETE FROM bookings WHERE id=$1', [id]);
    if (roomId) {
      await pool.query(`UPDATE rooms SET status='available' WHERE id=$1`, [roomId]);
    }

    await pool.query('COMMIT');
    res.json({ message: 'Booking deleted successfully' });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
