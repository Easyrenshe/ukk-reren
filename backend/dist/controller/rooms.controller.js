"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRoom = exports.updateRoom = exports.createRoom = exports.getRoomById = exports.getAllRooms = void 0;
const postgres_1 = __importDefault(require("../database/postgres"));
// ======================
// GET ALL ROOMS
// ======================
const getAllRooms = async (req, res) => {
    try {
        const { rows } = await postgres_1.default.query(`
      SELECT r.*, rt.name AS type_name, rt.price AS type_price
      FROM rooms r
      LEFT JOIN room_types rt ON r.type_id = rt.id
      ORDER BY r.room_number
    `);
        res.json(rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getAllRooms = getAllRooms;
// ======================
// GET ROOM BY ID
// ======================
const getRoomById = async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await postgres_1.default.query(`SELECT r.*, rt.name AS type_name, rt.price AS type_price 
       FROM rooms r 
       LEFT JOIN room_types rt ON r.type_id = rt.id 
       WHERE r.id=$1`, [id]);
        if (!rows.length)
            return res.status(404).json({ message: 'Room not found' });
        res.json(rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getRoomById = getRoomById;
// ======================
// CREATE ROOM
// ======================
const createRoom = async (req, res) => {
    try {
        const { room_number, type_id, status } = req.body;
        if (!room_number)
            return res.status(400).json({ message: 'room_number is required' });
        const validStatus = ['available', 'booked', 'maintenance', 'occupied'];
        if (status && !validStatus.includes(status.toLowerCase())) {
            return res.status(400).json({ message: `Invalid status value. Must be one of: ${validStatus.join(', ')}` });
        }
        // type_id is already a UUID string, use it directly
        const { rows } = await postgres_1.default.query(`INSERT INTO rooms (room_number, type_id, status) VALUES ($1,$2,$3) RETURNING *`, [room_number, type_id || null, status?.toLowerCase() || 'available']);
        res.status(201).json(rows[0]);
    }
    catch (err) {
        console.error(err);
        if (err.code === '23505') { // duplicate room_number
            return res.status(400).json({ message: 'room_number already exists' });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.createRoom = createRoom;
// ======================
// UPDATE ROOM
// ======================
const updateRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const { room_number, type_id, status } = req.body;
        const validStatus = ['available', 'booked', 'maintenance', 'occupied'];
        if (status && !validStatus.includes(status.toLowerCase())) {
            return res.status(400).json({ message: `Invalid status value. Must be one of: ${validStatus.join(', ')}` });
        }
        // type_id is already a UUID string
        const { rows } = await postgres_1.default.query(`UPDATE rooms 
       SET room_number=COALESCE($1, room_number), 
           type_id=COALESCE($2, type_id), 
           status=COALESCE($3, status)
       WHERE id=$4 
       RETURNING *`, [room_number || null, type_id || null, status?.toLowerCase() || null, id]);
        if (!rows.length)
            return res.status(404).json({ message: 'Room not found' });
        res.json(rows[0]);
    }
    catch (err) {
        console.error(err);
        if (err.code === '23505') { // duplicate room_number
            return res.status(400).json({ message: 'room_number already exists' });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.updateRoom = updateRoom;
// ======================
// DELETE ROOM
// ======================
const deleteRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const { rowCount } = await postgres_1.default.query('DELETE FROM rooms WHERE id=$1', [id]);
        if (!rowCount)
            return res.status(404).json({ message: 'Room not found' });
        res.json({ message: 'Deleted' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.deleteRoom = deleteRoom;
//# sourceMappingURL=rooms.controller.js.map