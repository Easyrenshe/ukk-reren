import pool from "./postgres";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

async function seedUsers() {
  try {
    console.log("🌱 Seeding demo users...");

    // Demo users to seed
    const demoUsers = [
      {
        username: "admin",
        email: "admin@hotel.com",
        password: "password123",
        full_name: "Admin User",
        role: "admin",
      },
      {
        username: "staff",
        email: "staff@hotel.com",
        password: "password123",
        full_name: "Staff User",
        role: "staff",
      },
      {
        username: "manager",
        email: "manager@hotel.com",
        password: "password123",
        full_name: "Manager User",
        role: "manager",
      },
    ];

    for (const user of demoUsers) {
      // Check if user already exists
      const existingUser = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [user.email]
      );

      if (existingUser.rows.length === 0) {
        // Hash password
        const hashedPassword = await bcrypt.hash(user.password, 10);

        // Insert user
        await pool.query(
          `INSERT INTO users (username, email, password, full_name, role, is_active) 
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [user.username, user.email, hashedPassword, user.full_name, user.role, true]
        );

        console.log(`✅ Created user: ${user.email}`);
      } else {
        console.log(`⏭️  User already exists: ${user.email}`);
      }
    }

    console.log("✨ Seeding completed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    process.exit(1);
  }
}

seedUsers();
