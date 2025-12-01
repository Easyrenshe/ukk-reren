import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { routes } from "./routes";
import pool from "./database/postgres"
import { initializeDatabase } from "./database/init";

const app = express();
const port = process.env.PORT || 5000;

// CORS Configuration
app.use(cors({
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", routes);

/**
 * 🩺 Cek koneksi PostgreSQL saat server mulai
 */
(async () => {
  try {
    const result = await pool.query("SELECT NOW() as current_time");
    console.log("🟢 PostgreSQL connected at:", result.rows[0].current_time);
    
    // Initialize database tables and data
    await initializeDatabase();
  } catch (error) {
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