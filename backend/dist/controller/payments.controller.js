"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePayment = exports.updatePayment = exports.createPayment = exports.getPaymentById = exports.getAllPayments = void 0;
const postgres_1 = __importDefault(require("../database/postgres"));
// ======================
// GET ALL PAYMENTS
// ======================
const getAllPayments = async (req, res) => {
    try {
        const { rows } = await postgres_1.default.query(`
      SELECT p.*, b.check_in, b.check_out, b.total_price
      FROM payments p
      LEFT JOIN bookings b ON p.booking_id = b.id
      ORDER BY p.payment_date DESC
    `);
        res.json(rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getAllPayments = getAllPayments;
// ======================
// GET PAYMENT BY ID
// ======================
const getPaymentById = async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await postgres_1.default.query('SELECT * FROM payments WHERE id=$1', [id]);
        if (!rows.length)
            return res.status(404).json({ message: 'Payment not found' });
        res.json(rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getPaymentById = getPaymentById;
// ======================
// CREATE PAYMENT
// ======================
const createPayment = async (req, res) => {
    try {
        const { booking_id, amount, payment_method } = req.body;
        if (!booking_id || amount == null) {
            return res.status(400).json({ message: 'Missing fields' });
        }
        const { rows } = await postgres_1.default.query(`INSERT INTO payments (booking_id, amount, payment_method) VALUES ($1,$2,$3) RETURNING *`, [booking_id, amount, payment_method || null]);
        res.status(201).json(rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.createPayment = createPayment;
// ======================
// UPDATE PAYMENT
// ======================
const updatePayment = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, payment_method } = req.body;
        const { rows } = await postgres_1.default.query(`UPDATE payments 
       SET amount=COALESCE($1, amount), 
           payment_method=COALESCE($2, payment_method) 
       WHERE id=$3 
       RETURNING *`, [amount ?? null, payment_method || null, id]);
        if (!rows.length)
            return res.status(404).json({ message: 'Payment not found' });
        res.json(rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.updatePayment = updatePayment;
// ======================
// DELETE PAYMENT
// ======================
const deletePayment = async (req, res) => {
    try {
        const { id } = req.params;
        const { rowCount } = await postgres_1.default.query('DELETE FROM payments WHERE id=$1', [id]);
        if (!rowCount)
            return res.status(404).json({ message: 'Payment not found' });
        res.json({ message: 'Deleted' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.deletePayment = deletePayment;
//# sourceMappingURL=payments.controller.js.map