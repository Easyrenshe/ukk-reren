// src/controllers/guests.controller.ts
import { Request, Response } from 'express';
import pool from "../database/postgres";

// ======================
// GET ALL GUESTS
// ======================
export const getAllGuests = async (req: Request, res: Response) => {
  try {
    const { rows } = await pool.query('SELECT * FROM guests ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ======================
// GET GUEST BY ID
// ======================
export const getGuestById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM guests WHERE id=$1', [id]);
    if (!rows.length) return res.status(404).json({ message: 'Guest not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ======================
// CREATE GUEST
// ======================
export const createGuest = async (req: Request, res: Response) => {
  try {
    const { full_name, phone, email, address, id_type, id_number, nationality } = req.body;
    if (!full_name) return res.status(400).json({ message: 'full_name is required' });

    const { rows } = await pool.query(
      `INSERT INTO guests (full_name, phone, email, address, id_type, id_number, nationality) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [full_name, phone || null, email || null, address || null, id_type || null, id_number || null, nationality || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ======================
// UPDATE GUEST
// ======================
export const updateGuest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { full_name, phone, email, address, id_type, id_number, nationality } = req.body;

    const { rows } = await pool.query(
      `UPDATE guests 
       SET full_name=COALESCE($1, full_name), 
           phone=COALESCE($2, phone), 
           email=COALESCE($3, email),
           address=COALESCE($4, address),
           id_type=COALESCE($5, id_type),
           id_number=COALESCE($6, id_number),
           nationality=COALESCE($7, nationality)
       WHERE id=$8 
       RETURNING *`,
      [full_name || null, phone || null, email || null, address || null, id_type || null, id_number || null, nationality || null, id]
    );

    if (!rows.length) return res.status(404).json({ message: 'Guest not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ======================
// DELETE GUEST
// ======================
export const deleteGuest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { rowCount } = await pool.query('DELETE FROM guests WHERE id=$1', [id]);
    if (!rowCount) return res.status(404).json({ message: 'Guest not found' });

    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
