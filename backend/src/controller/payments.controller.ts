// src/controllers/payments.controller.ts
import { Request, Response } from 'express';
import pool from "../database/postgres";

// ======================
// GET ALL PAYMENTS
// ======================
export const getAllPayments = async (req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        p.id,
        p.booking_id,
        p.amount,
        p.payment_method,
        p.payment_date,
        p.status,
        p.transaction_id,
        p.created_at,
        p.updated_at,
        b.check_in,
        b.check_out,
        b.total_price,
        b.status AS booking_status,
        g.full_name AS guest_name,
        g.id AS guest_id,
        r.room_number,
        r.id AS room_id
      FROM payments p
      LEFT JOIN bookings b ON p.booking_id = b.id
      LEFT JOIN guests g ON b.guest_id = g.id
      LEFT JOIN rooms r ON b.room_id = r.id
      ORDER BY p.payment_date DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ======================
// GET PAYMENT BY ID
// ======================
export const getPaymentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(`
      SELECT 
        p.id,
        p.booking_id,
        p.amount,
        p.payment_method,
        p.payment_date,
        p.status,
        p.transaction_id,
        p.created_at,
        p.updated_at,
        b.check_in,
        b.check_out,
        b.total_price,
        b.status AS booking_status,
        g.full_name AS guest_name,
        g.id AS guest_id,
        r.room_number,
        r.id AS room_id
      FROM payments p
      LEFT JOIN bookings b ON p.booking_id = b.id
      LEFT JOIN guests g ON b.guest_id = g.id
      LEFT JOIN rooms r ON b.room_id = r.id
      WHERE p.id=$1
    `, [id]);
    if (!rows.length) return res.status(404).json({ message: 'Payment not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ======================
// CREATE PAYMENT
// ======================
export const createPayment = async (req: Request, res: Response) => {
  try {
    const { booking_id, amount, payment_method, status, transaction_id } = req.body;
    if (!booking_id || amount == null) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const { rows } = await pool.query(
      `INSERT INTO payments (booking_id, amount, payment_method, status, transaction_id) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [booking_id, amount, payment_method || null, status || 'pending', transaction_id || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ======================
// UPDATE PAYMENT
// ======================
export const updatePayment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { amount, payment_method, status, transaction_id } = req.body;

    const { rows } = await pool.query(
      `UPDATE payments 
       SET amount=COALESCE($1, amount), 
           payment_method=COALESCE($2, payment_method),
           status=COALESCE($3, status),
           transaction_id=COALESCE($4, transaction_id)
       WHERE id=$5 
       RETURNING *`,
      [amount ?? null, payment_method || null, status || null, transaction_id || null, id]
    );

    if (!rows.length) return res.status(404).json({ message: 'Payment not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ======================
// DELETE PAYMENT
// ======================
export const deletePayment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { rowCount } = await pool.query('DELETE FROM payments WHERE id=$1', [id]);
    if (!rowCount) return res.status(404).json({ message: 'Payment not found' });

    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
