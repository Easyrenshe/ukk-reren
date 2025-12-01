// src/controllers/roomTypes.controller.ts

import { Request, Response } from 'express';
import pool from "../database/postgres";

// ======================
// GET ALL ROOM TYPES
// ======================
export const getAllRoomTypes = async (req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM room_types ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ======================
// GET ROOM TYPE BY ID
// ======================
export const getRoomTypeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      'SELECT * FROM room_types WHERE id=$1',
      [id]
    );

    if (!rows.length)
      return res.status(404).json({ message: 'Room type not found' });

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ======================
// CREATE ROOM TYPE
// ======================
export const createRoomType = async (req: Request, res: Response) => {
  try {
    const { name, description, price, capacity, amenities, image_url } = req.body;

    if (!name || price == null) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const { rows } = await pool.query(
      `INSERT INTO room_types (name, description, price, capacity, amenities, image_url)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, description || null, price, capacity || null, amenities || null, image_url || null]
    );

    res.status(201).json(rows[0]);
  } catch (err: any) {
    console.error(err);

    if (err.code === '23505') {
      return res.status(400).json({ message: 'Room type name already exists' });
    }

    res.status(500).json({ message: 'Internal server error' });
  }
};

// ======================
// UPDATE ROOM TYPE
// ======================
export const updateRoomType = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price, capacity, amenities, image_url } = req.body;

    const { rows } = await pool.query(
      `UPDATE room_types 
       SET 
         name = COALESCE($1, name),
         description = COALESCE($2, description),
         price = COALESCE($3, price),
         capacity = COALESCE($4, capacity),
         amenities = COALESCE($5, amenities),
         image_url = COALESCE($6, image_url)
       WHERE id = $7
       RETURNING *`,
      [
        name || null,
        description || null,
        price ?? null,
        capacity ?? null,
        amenities || null,
        image_url || null,
        id
      ]
    );

    if (!rows.length)
      return res.status(404).json({ message: 'Room type not found' });

    res.json(rows[0]);
  } catch (err: any) {
    console.error(err);

    if (err.code === '23505') {
      return res.status(400).json({ message: 'Room type name already exists' });
    }

    res.status(500).json({ message: 'Internal server error' });
  }
};

// ======================
// DELETE ROOM TYPE
// ======================
export const deleteRoomType = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { rowCount } = await pool.query(
      'DELETE FROM room_types WHERE id=$1',
      [id]
    );

    if (!rowCount)
      return res.status(404).json({ message: 'Room type not found' });

    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
