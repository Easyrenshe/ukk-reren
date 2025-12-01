"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRoomType = exports.updateRoomType = exports.createRoomType = exports.getRoomTypeById = exports.getAllRoomTypes = void 0;
const postgres_1 = __importDefault(require("../database/postgres"));
// ======================
// GET ALL ROOM TYPES
// ======================
const getAllRoomTypes = async (req, res) => {
    try {
        const { rows } = await postgres_1.default.query('SELECT * FROM room_types ORDER BY created_at DESC');
        res.json(rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getAllRoomTypes = getAllRoomTypes;
// ======================
// GET ROOM TYPE BY ID
// ======================
const getRoomTypeById = async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await postgres_1.default.query('SELECT * FROM room_types WHERE id=$1', [id]);
        if (!rows.length)
            return res.status(404).json({ message: 'Room type not found' });
        res.json(rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getRoomTypeById = getRoomTypeById;
// ======================
// CREATE ROOM TYPE
// ======================
const createRoomType = async (req, res) => {
    try {
        const { name, description, price } = req.body;
        if (!name || price == null) {
            return res.status(400).json({ message: 'Missing fields' });
        }
        const { rows } = await postgres_1.default.query(`INSERT INTO room_types (name, description, price) VALUES ($1,$2,$3) RETURNING *`, [name, description || null, price]);
        res.status(201).json(rows[0]);
    }
    catch (err) {
        console.error(err);
        if (err.code === '23505') { // duplicate name jika ada constraint unik
            return res.status(400).json({ message: 'Room type name already exists' });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.createRoomType = createRoomType;
// ======================
// UPDATE ROOM TYPE
// ======================
const updateRoomType = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price } = req.body;
        const { rows } = await postgres_1.default.query(`UPDATE room_types 
       SET name=COALESCE($1,name), 
           description=COALESCE($2,description), 
           price=COALESCE($3,price) 
       WHERE id=$4 
       RETURNING *`, [name || null, description || null, price ?? null, id]);
        if (!rows.length)
            return res.status(404).json({ message: 'Room type not found' });
        res.json(rows[0]);
    }
    catch (err) {
        console.error(err);
        if (err.code === '23505') { // duplicate name
            return res.status(400).json({ message: 'Room type name already exists' });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.updateRoomType = updateRoomType;
// ======================
// DELETE ROOM TYPE
// ======================
const deleteRoomType = async (req, res) => {
    try {
        const { id } = req.params;
        const { rowCount } = await postgres_1.default.query('DELETE FROM room_types WHERE id=$1', [id]);
        if (!rowCount)
            return res.status(404).json({ message: 'Room type not found' });
        res.json({ message: 'Deleted' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.deleteRoomType = deleteRoomType;
//# sourceMappingURL=roomTypes.controller.js.map