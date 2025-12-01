import pool from "./postgres";
import fs from "fs";
import path from "path";

export const initializeDatabase = async () => {
  try {
    console.log("🔄 Initializing database...");

    // Read the SQL file - handle both compiled and source environments
    const sqlPath = path.join(__dirname, "init.sql");
    const srcSqlPath = path.join(__dirname, "..", "database", "init.sql");
    const finalPath = fs.existsSync(sqlPath) ? sqlPath : srcSqlPath;
    
    const sql = fs.readFileSync(finalPath, "utf-8");

    // Execute the SQL
    await pool.query(sql);

    console.log("✅ Database initialized successfully!");
  } catch (error) {
    console.error("❌ Error initializing database:", error);
    throw error;
  }
};

// Run initialization if this file is executed directly
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log("Database setup completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Database setup failed:", error);
      process.exit(1);
    });
}
