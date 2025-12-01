"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.authMiddleware = void 0;
const postgres_1 = __importDefault(require("../database/postgres"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// REGISTER
const authMiddleware = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password)
            return res.status(400).json({ message: "Missing fields" });
        const existing = await postgres_1.default.query("SELECT id FROM users WHERE email=$1", [email]);
        if (existing.rows.length)
            return res.status(400).json({ message: "Email already used" });
        const hashed = await bcryptjs_1.default.hash(password, 10);
        const { rows } = await postgres_1.default.query(`INSERT INTO users (name,email,password,role)
       VALUES ($1,$2,$3,$4)
       RETURNING id,name,email,role,created_at`, [name, email, hashed, role || "staff"]);
        res.status(201).json(rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
exports.authMiddleware = authMiddleware;
// LOGIN
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ message: "Missing fields" });
        const { rows } = await postgres_1.default.query("SELECT * FROM users WHERE email=$1", [email]);
        if (!rows.length)
            return res.status(400).json({ message: "Invalid credentials" });
        const user = rows[0];
        const match = await bcryptjs_1.default.compare(password, user.password);
        if (!match)
            return res.status(400).json({ message: "Invalid credentials" });
        // Tanpa token
        res.json({
            message: "Login successful",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
exports.login = login;
// LOGOUT (opsional)
const logout = async (req, res) => {
    // Kalau tanpa token, logout hanya bersifat client-side
    res.json({ message: "Logout successful" });
};
exports.logout = logout;
//# sourceMappingURL=auth.middlerware.js.map