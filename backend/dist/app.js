"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = require("./routes");
const postgres_1 = __importDefault(require("./database/postgres"));
const init_1 = require("./database/init");
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
// CORS Configuration
app.use((0, cors_1.default)({
    origin: [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:5173'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// Middleware router utama
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/", routes_1.routes);
/**
 * 🩺 Cek koneksi PostgreSQL saat server mulai
 */
(async () => {
    try {
        const result = await postgres_1.default.query("SELECT NOW() as current_time");
        console.log("🟢 PostgreSQL connected at:", result.rows[0].current_time);
        // Initialize database tables and data
        await (0, init_1.initializeDatabase)();
    }
    catch (error) {
        console.error("🔴 Failed to connect to PostgreSQL:", error);
    }
})();
app.get("/", (req, res) => {
    res.send("Hello World! Belajar Membuat Backend Server!");
});
// Jalankan server
app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
});
//# sourceMappingURL=app.js.map