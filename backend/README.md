# 🏨 Hotel Management System - Backend

Backend API untuk sistem manajemen hotel yang dibangun dengan **Express.js**, **TypeScript**, dan **PostgreSQL**. Sistem ini menyediakan REST API lengkap untuk mengelola tamu, kamar, pemesanan, dan pembayaran.

---

## 📋 Daftar Isi

- [Fitur Utama](#fitur-utama)
- [Tech Stack](#tech-stack)
- [Instalasi](#instalasi)
- [Konfigurasi Environment](#konfigurasi-environment)
- [Cara Menjalankan](#cara-menjalankan)
- [Struktur Project](#struktur-project)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Middleware](#middleware)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Fitur Utama

✅ **Autentikasi & Autorisasi**
- Registrasi dan login pengguna dengan JWT
- Role-based access control (Admin, Staff, Manager)
- Password hashing dengan bcryptjs

✅ **Manajemen Kamar**
- CRUD tipe kamar (Room Types)
- CRUD kamar dengan status tracking
- Informasi kapasitas dan fasilitas kamar

✅ **Manajemen Tamu**
- CRUD data tamu (Guests)
- Penyimpanan data identitas dan kontak

✅ **Sistem Pemesanan**
- CRUD pemesanan (Bookings)
- Status pemesanan (pending, confirmed, checked-in, checked-out, cancelled)
- Manajemen tanggal check-in dan check-out

✅ **Manajemen Pembayaran**
- CRUD pembayaran (Payments)
- Tracking status pembayaran
- Integrasi dengan sistem pemesanan

✅ **Database Relational**
- PostgreSQL dengan relasi cascade
- Indexes untuk optimasi performa
- UUID untuk primary key yang aman

---

## 🛠️ Tech Stack

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| **Express.js** | ^4.21.2 | Web framework |
| **TypeScript** | ^5.9.3 | Type safety |
| **PostgreSQL** | - | Database |
| **Node.js** | 18+ | Runtime |
| **pg** | ^8.16.3 | PostgreSQL driver |
| **JWT** | ^9.0.2 | Token authentication |
| **bcryptjs** | ^3.0.3 | Password hashing |
| **CORS** | ^2.8.5 | Cross-origin requests |
| **dotenv** | ^16.4.5 | Environment variables |
| **Nodemon** | ^3.1.4 | Development auto-reload |
| **ts-node** | ^10.9.2 | TypeScript execution |

---

### Seed untuk Login
npx ts-node src/database/seedUsers.ts

## 📦 Instalasi

### Prerequisites

Pastikan sudah terinstall:
- **Node.js** v18+ ([Download](https://nodejs.org/))
- **PostgreSQL** v12+ ([Download](https://www.postgresql.org/))
- **pnpm** atau **npm** ([Install pnpm](https://pnpm.io/installation))

### Langkah Instalasi

1. **Clone repository atau masuk ke folder backend**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # atau jika menggunakan npm
   npm install
   ```

3. **Konfigurasi environment variables** (lihat [Konfigurasi Environment](#konfigurasi-environment))

4. **Setup database**
   ```bash
   # Database akan otomatis diinisialisasi saat server dijalankan
   # Atau jalankan seed data
   pnpm seed
   ```

---

## ⚙️ Konfigurasi Environment

Buat file `.env` di root folder backend:

```env
# Database Configuration
PG_HOST=localhost
PG_PORT=5432
PG_USER=postgres
PG_PASSWORD=your_password_here
PG_DATABASE=hms

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=hotel_management_system_secret_key_change_in_production
```

### Penjelasan Environment Variables:

| Variable | Deskripsi | Default |
|----------|-----------|---------|
| `PG_HOST` | Host PostgreSQL | localhost |
| `PG_PORT` | Port PostgreSQL | 5432 |
| `PG_USER` | Username database | postgres |
| `PG_PASSWORD` | Password database | - |
| `PG_DATABASE` | Nama database | hms |
| `PORT` | Port server Express | 5000 |
| `NODE_ENV` | Environment (development/production) | development |
| `JWT_SECRET` | Secret key untuk JWT signing | - |

---

## 🚀 Cara Menjalankan

### Development Mode (dengan Hot Reload)

```bash
pnpm dev
```

Server akan berjalan di `http://localhost:5000` dan akan otomatis restart saat ada perubahan file.

### Production Mode

```bash
# Build TypeScript ke JavaScript
pnpm build

# Jalankan hasil build
pnpm start
```

### Build Watch Mode

```bash
# TypeScript akan terus dicompile saat ada perubahan
pnpm build:watch
```

### Seed Database (opsional)

```bash
# Menambahkan data dummy untuk testing
pnpm seed
```

### Package Executable (optional)

```bash
# Buat file executable untuk Linux & Windows
pnpm package
```

---

## 📂 Struktur Project

```
backend/
├── src/
│   ├── app.ts                      # Main application entry point
│   ├── config/
│   │   └── config.ts               # Configuration settings
│   ├── controller/
│   │   ├── auth.controller.ts       # Authentication logic
│   │   ├── bookings.controller.ts   # Bookings management
│   │   ├── guests.controller.ts     # Guests management
│   │   ├── payments.controller.ts   # Payments management
│   │   ├── rooms.controller.ts      # Rooms management
│   │   └── roomTypes.controller.ts  # Room types management
│   ├── database/
│   │   ├── init.ts                  # Database initialization
│   │   ├── init.sql                 # Database schema
│   │   ├── postgres.ts              # PostgreSQL connection pool
│   │   ├── seedUsers.ts             # Seed dummy data
│   │   └── migrate_cascade.sql      # Migration with cascade
│   ├── middleware/
│   │   ├── auth.middlerware.ts      # Authentication middleware
│   │   └── error.middleware.ts      # Error handling middleware
│   ├── routes/
│   │   ├── authRouter.ts            # Auth routes
│   │   ├── bookingsRouter.ts        # Bookings routes
│   │   ├── guestsRouter.ts          # Guests routes
│   │   ├── index.ts                 # Main router
│   │   ├── paymentsRouter.ts        # Payments routes
│   │   ├── roomsRouter.ts           # Rooms routes
│   │   └── roomTypesRouter.ts       # Room types routes
│   └── test-rest/                   # REST client test files
│       ├── bookings.rest
│       ├── guests.rest
│       ├── payments.rest
│       ├── room-types.rest
│       └── rooms.rest
├── dist/                            # Compiled JavaScript (generated)
├── .env                             # Environment variables
├── nodemon.json                     # Nodemon configuration
├── package.json                     # Dependencies & scripts
├── tsconfig.json                    # TypeScript configuration
└── README.md                        # This file
```
---

## 🔌 API Endpoints

### Base URL: `http://localhost:5000/api`

### 📌 Authentication Endpoints

**POST** `/auth/register` - Daftar pengguna baru
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "full_name": "John Doe"
}
```

**POST** `/auth/login` - Login pengguna
```json
{
  "username": "john_doe",
  "password": "securePassword123"
}
// atau gunakan email
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**POST** `/auth/logout` - Logout pengguna
```
Header: Authorization: Bearer <token>
```

---

### 🏨 Room Types Endpoints

**GET** `/room-types` - Dapatkan semua tipe kamar
```bash
curl http://localhost:5000/api/room-types
```

**GET** `/room-types/:id` - Dapatkan tipe kamar spesifik
```bash
curl http://localhost:5000/api/room-types/uuid-here
```

**POST** `/room-types` - Buat tipe kamar baru
```json
{
  "name": "Deluxe Room",
  "description": "Spacious room with ocean view",
  "price": 150000,
  "capacity": 2,
  "amenities": "WiFi, AC, TV, Mini Bar",
  "image_url": "http://example.com/image.jpg"
}
```

**PUT** `/room-types/:id` - Update tipe kamar
```json
{
  "name": "Deluxe Room Updated",
  "price": 160000
}
```

**DELETE** `/room-types/:id` - Hapus tipe kamar

---

### 🛏️ Rooms Endpoints

**GET** `/rooms` - Dapatkan semua kamar
```bash
curl http://localhost:5000/api/rooms
```

**GET** `/rooms/:id` - Dapatkan kamar spesifik

**POST** `/rooms` - Buat kamar baru
```json
{
  "room_number": "101",
  "type_id": "uuid-of-room-type",
  "floor": 1,
  "status": "available"
}
```

**PUT** `/rooms/:id` - Update kamar
```json
{
  "status": "maintenance"
}
```

**DELETE** `/rooms/:id` - Hapus kamar

---

### 👥 Guests Endpoints

**GET** `/guests` - Dapatkan semua tamu
```bash
curl http://localhost:5000/api/guests
```

**GET** `/guests/:id` - Dapatkan tamu spesifik

**POST** `/guests` - Tambah tamu baru
```json
{
  "full_name": "Ahmad Rizki",
  "phone": "08123456789",
  "email": "ahmad@example.com",
  "address": "Jl. Sudirman No. 10, Jakarta",
  "id_type": "ktp",
  "id_number": "1234567890123456",
  "nationality": "Indonesian"
}
```

**PUT** `/guests/:id` - Update data tamu
```json
{
  "phone": "08987654321"
}
```

**DELETE** `/guests/:id` - Hapus tamu

---

### 📅 Bookings Endpoints

**GET** `/bookings` - Dapatkan semua pemesanan
```bash
curl http://localhost:5000/api/bookings
```

**GET** `/bookings/:id` - Dapatkan pemesanan spesifik

**POST** `/bookings` - Buat pemesanan baru
```json
{
  "guest_id": "uuid-of-guest",
  "room_id": "uuid-of-room",
  "check_in": "2025-12-15",
  "check_out": "2025-12-20",
  "total_price": 750000,
  "notes": "Smoking room preferred"
}
```

**PUT** `/bookings/:id` - Update pemesanan
```json
{
  "status": "confirmed",
  "notes": "Updated notes"
}
```

**DELETE** `/bookings/:id` - Hapus pemesanan

---

### 💳 Payments Endpoints

**GET** `/payments` - Dapatkan semua pembayaran
```bash
curl http://localhost:5000/api/payments
```

**GET** `/payments/:id` - Dapatkan pembayaran spesifik

**POST** `/payments` - Buat pembayaran baru
```json
{
  "booking_id": "uuid-of-booking",
  "amount": 750000,
  "payment_method": "card",
  "transaction_id": "TXN123456789"
}
```

**PUT** `/payments/:id` - Update pembayaran
```json
{
  "status": "completed"
}
```

**DELETE** `/payments/:id` - Hapus pembayaran

---

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(150),
    role VARCHAR(50) DEFAULT 'staff', -- admin, staff, manager
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### Room Types Table
```sql
CREATE TABLE room_types (
    id UUID PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    capacity INT DEFAULT 2,
    amenities TEXT,
    image_url VARCHAR(500),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### Rooms Table
```sql
CREATE TABLE rooms (
    id UUID PRIMARY KEY,
    room_number VARCHAR(50) UNIQUE NOT NULL,
    type_id UUID REFERENCES room_types(id),
    status VARCHAR(20) DEFAULT 'available',
    floor INT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### Guests Table
```sql
CREATE TABLE guests (
    id UUID PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    id_type VARCHAR(50),
    id_number VARCHAR(50),
    nationality VARCHAR(100),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### Bookings Table
```sql
CREATE TABLE bookings (
    id UUID PRIMARY KEY,
    guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
    room_id UUID REFERENCES rooms(id),
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    total_price DECIMAL(12, 2),
    status VARCHAR(20) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### Payments Table
```sql
CREATE TABLE payments (
    id UUID PRIMARY KEY,
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL,
    payment_method VARCHAR(50),
    payment_date TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending',
    transaction_id VARCHAR(100),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

---

## 🔐 Middleware

### Authentication Middleware
- **File:** `src/middleware/auth.middlerware.ts`
- **Fungsi:** Mengamankan endpoint dengan JWT token
- **Penggunaan:**
  ```typescript
  import { authenticateToken } from "../middleware/auth.middleware";
  
  router.post("/protected-route", authenticateToken, (req, res) => {
    // Endpoint terlindungi
  });
  ```

### Error Middleware
- **File:** `src/middleware/error.middleware.ts`
- **Fungsi:** Menangani error globally di aplikasi

---

## 🐛 Troubleshooting

### ❌ Error: Cannot find module 'dotenv'
**Solusi:**
```bash
pnpm install
```

### ❌ Error: Connection refused to PostgreSQL
**Solusi:**
1. Pastikan PostgreSQL sudah running
2. Cek konfigurasi di `.env`
3. Verifikasi password database
```bash
# Check PostgreSQL service (Windows)
sc query postgresql-x64-15

# Start PostgreSQL (Windows)
net start postgresql-x64-15
```

### ❌ Error: database "hms" does not exist
**Solusi:**
```bash
# Buat database baru di PostgreSQL
psql -U postgres

# Di psql shell
CREATE DATABASE hms;
\q
```

### ❌ Error: Port 5000 already in use
**Solusi 1:** Ubah PORT di `.env`
```env
PORT=5001
```

**Solusi 2:** Kill proses yang menggunakan port 5000
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5000
kill -9 <PID>
```

### ❌ Error: Cannot read property 'query' of undefined
**Solusi:** Pastikan PostgreSQL connection terhubung. Cek logs di console.

### ❌ CORS Error
**Solusi:** Pastikan frontend URL sudah ditambahkan di CORS configuration di `app.ts`

---

## 📝 Development Tips

### Testing dengan REST Client Extension (VS Code)

1. Install extension "REST Client" (REST Client by Huachao Mao)
2. Gunakan file `.rest` di folder `src/test-rest/`
3. Buka file dan klik "Send Request"

Contoh:
```http
### Fetch all room types
GET http://localhost:5000/api/room-types

### Create new room type
POST http://localhost:5000/api/room-types
Content-Type: application/json

{
  "name": "Standard Room",
  "price": 100000,
  "capacity": 2
}
```

### Debugging dengan VS Code

1. Tambahkan breakpoint dengan klik di sebelah nomor baris
2. Jalankan: `npm run dev`
3. Browser DevTools atau VS Code Debugger akan pause di breakpoint

### Monitoring Database

```bash
# Connect ke database
psql -U postgres -d hms

# Useful commands
\dt                     # Lihat semua table
\d users               # Lihat struktur table users
SELECT * FROM users;   # Query data
\q                     # Keluar
```