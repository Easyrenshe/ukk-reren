"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGuest = exports.updateGuest = exports.createGuest = exports.getGuestById = exports.getAllGuests = void 0;
const postgres_1 = __importDefault(require("../database/postgres"));
// ======================
// GET ALL GUESTS
// ======================
const getAllGuests = async (req, res) => {
    try {
        const { rows } = await postgres_1.default.query('SELECT * FROM guests ORDER BY created_at DESC');
        res.json(rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getAllGuests = getAllGuests;
// ======================
// GET GUEST BY ID
// ======================
const getGuestById = async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await postgres_1.default.query('SELECT * FROM guests WHERE id=$1', [id]);
        if (!rows.length)
            return res.status(404).json({ message: 'Guest not found' });
        res.json(rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getGuestById = getGuestById;
// ======================
// CREATE GUEST
// ======================
const createGuest = async (req, res) => {
    try {
        const { full_name, phone, email } = req.body;
        if (!full_name)
            return res.status(400).json({ message: 'full_name is required' });
        const { rows } = await postgres_1.default.query(`INSERT INTO guests (full_name, phone, email) VALUES ($1,$2,$3) RETURNING *`, [full_name, phone || null, email || null]);
        res.status(201).json(rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.createGuest = createGuest;
// ======================
// UPDATE GUEST
// ======================
const updateGuest = async (req, res) => {
    try {
        const { id } = req.params;
        const { full_name, phone, email } = req.body;
        const { rows } = await postgres_1.default.query(`UPDATE guests 
       SET full_name=COALESCE($1, full_name), 
           phone=COALESCE($2, phone), 
           email=COALESCE($3, email) 
       WHERE id=$4 
       RETURNING *`, [full_name || null, phone || null, email || null, id]);
        if (!rows.length)
            return res.status(404).json({ message: 'Guest not found' });
        res.json(rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.updateGuest = updateGuest;
// ======================
// DELETE GUEST
// ======================
const deleteGuest = async (req, res) => {
    try {
        const { id } = req.params;
        const { rowCount } = await postgres_1.default.query('DELETE FROM guests WHERE id=$1', [id]);
        if (!rowCount)
            return res.status(404).json({ message: 'Guest not found' });
        res.json({ message: 'Deleted' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.deleteGuest = deleteGuest;
//# sourceMappingURL=guests.controller.js.map