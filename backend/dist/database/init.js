"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabase = void 0;
const postgres_1 = __importDefault(require("./postgres"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const initializeDatabase = async () => {
    try {
        console.log("🔄 Initializing database...");
        // Read the SQL file - handle both compiled and source environments
        const sqlPath = path_1.default.join(__dirname, "init.sql");
        const srcSqlPath = path_1.default.join(__dirname, "..", "database", "init.sql");
        const finalPath = fs_1.default.existsSync(sqlPath) ? sqlPath : srcSqlPath;
        const sql = fs_1.default.readFileSync(finalPath, "utf-8");
        // Execute the SQL
        await postgres_1.default.query(sql);
        console.log("✅ Database initialized successfully!");
    }
    catch (error) {
        console.error("❌ Error initializing database:", error);
        throw error;
    }
};
exports.initializeDatabase = initializeDatabase;
// Run initialization if this file is executed directly
if (require.main === module) {
    (0, exports.initializeDatabase)()
        .then(() => {
        console.log("Database setup completed!");
        process.exit(0);
    })
        .catch((error) => {
        console.error("Database setup failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=init.js.map