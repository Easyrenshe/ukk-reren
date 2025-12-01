"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.register = void 0;
const postgres_1 = __importDefault(require("../database/postgres"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// ======================
// REGISTER
// ======================
const register = async (req, res) => {
    try {
        const { username, email, password, full_name } = req.body;
        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Missing required fields: username, email, password' });
        }
        // Check if user already exists
        const existingUser = await postgres_1.default.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }
        // Hash password
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // Insert new user
        const { rows } = await postgres_1.default.query(`INSERT INTO users (username, email, password, full_name, role, is_active) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, username, email, full_name, role`, [username, email, hashedPassword, full_name || null, 'staff', true]);
        res.status(201).json({
            message: 'User registered successfully',
            user: rows[0]
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.register = register;
// ======================
// LOGIN
// ======================
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        // Validation
        if (!username || !password) {
            return res.status(400).json({ message: 'Missing required fields: username, password' });
        }
        // Find user
        const { rows } = await postgres_1.default.query('SELECT * FROM users WHERE username = $1 AND is_active = true', [username]);
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        const user = rows[0];
        // Check password
        const validPassword = await bcryptjs_1.default.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '24h' });
        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                full_name: user.full_name,
                role: user.role
            }
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.login = login;
// ======================
// LOGOUT
// ======================
const logout = async (req, res) => {
    try {
        // JWT logout is handled client-side by removing token
        // This endpoint can be used for server-side logout tracking if needed
        res.json({ message: 'Logout successful' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.logout = logout;
//# sourceMappingURL=auth.controller.js.map