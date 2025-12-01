// src/controllers/rooms.controller.ts
import { Request, Response } from 'express';
import pool from "../database/postgres";

// ======================
// GET ALL ROOMS
// ======================
export const getAllRooms = async (req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(`
      SELECT r.*, rt.name AS type_name, rt.price AS type_price, rt.image_url AS type_image_url
      FROM rooms r
      LEFT JOIN room_types rt ON r.type_id = rt.id
      ORDER BY r.room_number
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ======================
// GET ROOM BY ID
// ======================
export const getRoomById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      `SELECT r.*, rt.name AS type_name, rt.price AS type_price, rt.image_url AS type_image_url
       FROM rooms r 
       LEFT JOIN room_types rt ON r.type_id = rt.id 
       WHERE r.id=$1`,
      [id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Room not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ======================
// CREATE ROOM
// ======================
export const createRoom = async (req: Request, res: Response) => {
  try {
    const { room_number, type_id, status, floor } = req.body;

    if (!room_number) return res.status(400).json({ message: 'room_number is required' });
    const validStatus = ['available', 'booked', 'maintenance', 'occupied'];
    if (status && !validStatus.includes(status.toLowerCase())) {
      return res.status(400).json({ message: `Invalid status value. Must be one of: ${validStatus.join(', ')}` });
    }

    // type_id is already a UUID string, use it directly
    const { rows } = await pool.query(
      `INSERT INTO rooms (room_number, type_id, status, floor) VALUES ($1,$2,$3,$4) RETURNING *`,
      [room_number, type_id || null, status?.toLowerCase() || 'available', floor || null]
    );
    res.status(201).json(rows[0]);
  } catch (err: any) {
    console.error(err);
    if (err.code === '23505') { // duplicate room_number
      return res.status(400).json({ message: 'room_number already exists' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ======================
// UPDATE ROOM
// ======================
export const updateRoom = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { room_number, type_id, status, floor } = req.body;

    const validStatus = ['available', 'booked', 'maintenance', 'occupied'];
    if (status && !validStatus.includes(status.toLowerCase())) {
      return res.status(400).json({ message: `Invalid status value. Must be one of: ${validStatus.join(', ')}` });
    }

    // type_id is already a UUID string
    const { rows } = await pool.query(
      `UPDATE rooms 
       SET room_number=COALESCE($1, room_number), 
           type_id=COALESCE($2, type_id), 
           status=COALESCE($3, status),
           floor=COALESCE($4, floor)
       WHERE id=$5 
       RETURNING *`,
      [room_number || null, type_id || null, status?.toLowerCase() || null, floor || null, id]
    );

    if (!rows.length) return res.status(404).json({ message: 'Room not found' });
    res.json(rows[0]);
  } catch (err: any) {
    console.error(err);
    if (err.code === '23505') { // duplicate room_number
      return res.status(400).json({ message: 'room_number already exists' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ======================
// DELETE ROOM
// ======================
export const deleteRoom = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { rowCount } = await pool.query('DELETE FROM rooms WHERE id=$1', [id]);
    if (!rowCount) return res.status(404).json({ message: 'Room not found' });

    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
