-- ============================================
-- Hotel Management System - Complete Database Backup
-- Database: hms
-- Dapat di-restore langsung ke pgAdmin
-- ============================================

-- Create Database
CREATE DATABASE IF NOT EXISTS hms;

-- Connect to the database (ini hanya untuk referensi)
-- \c hms;

-- ============================================
-- Extensions
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Users Table (for authentication)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(150),
    role VARCHAR(50) DEFAULT 'staff',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Room Types Table
-- ============================================
CREATE TABLE IF NOT EXISTS room_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    capacity INT DEFAULT 2,
    amenities TEXT,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Rooms Table
-- ============================================
CREATE TABLE IF NOT EXISTS rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_number VARCHAR(50) UNIQUE NOT NULL,
    type_id UUID REFERENCES room_types(id) ON DELETE SET NULL ON UPDATE CASCADE,
    status VARCHAR(20) DEFAULT 'available',
    floor INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Guests Table
-- ============================================
CREATE TABLE IF NOT EXISTS guests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    id_type VARCHAR(50),
    id_number VARCHAR(50),
    nationality VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Bookings Table
-- ============================================
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE ON UPDATE CASCADE,
    room_id UUID REFERENCES rooms(id) ON DELETE SET NULL ON UPDATE CASCADE,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    total_price DECIMAL(12, 2),
    status VARCHAR(20) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Payments Table
-- ============================================
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE ON UPDATE CASCADE,
    amount DECIMAL(12, 2) NOT NULL,
    payment_method VARCHAR(50),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending',
    transaction_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Create Indexes
-- ============================================
CREATE INDEX IF NOT EXISTS idx_rooms_type_id ON rooms(type_id);
CREATE INDEX IF NOT EXISTS idx_bookings_guest_id ON bookings(guest_id);
CREATE INDEX IF NOT EXISTS idx_bookings_room_id ON bookings(room_id);
CREATE INDEX IF NOT EXISTS idx_bookings_check_in ON bookings(check_in);
CREATE INDEX IF NOT EXISTS idx_bookings_check_out ON bookings(check_out);
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================
-- Sample Data
-- ============================================

-- Insert sample users
INSERT INTO users (username, password, email, full_name, role, is_active) VALUES
('admin', '$2a$10$adminhashpassword123456', 'admin@hotel.com', 'Administrator', 'admin', true),
('manager', '$2a$10$managerhashpassword12345', 'manager@hotel.com', 'Manager Hotel', 'manager', true),
('staff', '$2a$10$staffhashpassword123456', 'staff@hotel.com', 'Staff Hotel', 'staff', true)
ON CONFLICT (username) DO NOTHING;

-- Insert sample room types
INSERT INTO room_types (name, description, price, capacity, amenities, image_url) VALUES
('Standard Room', 'Kamar standar dengan fasilitas dasar', 250000, 2, '["WiFi", "TV", "AC", "Kamar Mandi"]', 'https://via.placeholder.com/400x300?text=Standard+Room'),
('Deluxe Room', 'Kamar mewah dengan pemandangan kota', 500000, 2, '["WiFi", "Smart TV", "AC", "Kamar Mandi", "Mini Bar"]', 'https://via.placeholder.com/400x300?text=Deluxe+Room'),
('Suite Room', 'Kamar suite dengan ruang tamu terpisah', 1000000, 4, '["WiFi", "Smart TV", "AC", "Kamar Mandi", "Mini Bar", "Dapur Kecil"]', 'https://via.placeholder.com/400x300?text=Suite+Room'),
('Family Room', 'Kamar keluarga berukuran besar', 750000, 4, '["WiFi", "TV", "AC", "2 Kamar Mandi"]', 'https://via.placeholder.com/400x300?text=Family+Room')
ON CONFLICT (name) DO NOTHING;

-- Insert sample rooms
-- Dapatkan ID dari room_types
WITH rt AS (
    SELECT id, name FROM room_types WHERE name = 'Standard Room' LIMIT 1
)
INSERT INTO rooms (room_number, type_id, status, floor) 
SELECT '101', id, 'available', 1 FROM rt
ON CONFLICT (room_number) DO NOTHING;

WITH rt AS (
    SELECT id, name FROM room_types WHERE name = 'Deluxe Room' LIMIT 1
)
INSERT INTO rooms (room_number, type_id, status, floor) 
SELECT '102', id, 'available', 1 FROM rt
ON CONFLICT (room_number) DO NOTHING;

WITH rt AS (
    SELECT id, name FROM room_types WHERE name = 'Suite Room' LIMIT 1
)
INSERT INTO rooms (room_number, type_id, status, floor) 
SELECT '201', id, 'booked', 2 FROM rt
ON CONFLICT (room_number) DO NOTHING;

WITH rt AS (
    SELECT id, name FROM room_types WHERE name = 'Family Room' LIMIT 1
)
INSERT INTO rooms (room_number, type_id, status, floor) 
SELECT '202', id, 'available', 2 FROM rt
ON CONFLICT (room_number) DO NOTHING;

-- Insert sample guests
INSERT INTO guests (full_name, phone, email, address, id_type, id_number, nationality) VALUES
('John Doe', '081234567890', 'john@example.com', '123 Main Street', 'passport', 'AB12345678', 'American'),
('Budi Santoso', '081298765432', 'budi@example.com', 'Jl. Sudirman 45', 'ktp', '3201234567890123', 'Indonesian'),
('Emma Smith', '081211223344', 'emma@example.com', '456 Oak Avenue', 'passport', 'CD98765432', 'British')
ON CONFLICT (email) DO NOTHING;

-- Insert sample bookings
WITH guest_ids AS (
    SELECT id, full_name FROM guests WHERE email IN ('john@example.com', 'budi@example.com') LIMIT 2
),
room_ids AS (
    SELECT id, room_number FROM rooms WHERE room_number IN ('101', '201') LIMIT 2
)
INSERT INTO bookings (guest_id, room_id, check_in, check_out, total_price, status, notes)
SELECT 
    (SELECT id FROM guests WHERE email = 'john@example.com'),
    (SELECT id FROM rooms WHERE room_number = '101'),
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '3 days',
    750000,
    'confirmed',
    'Booking awal sistem'
ON CONFLICT DO NOTHING;

-- Insert sample payments
WITH booking_ids AS (
    SELECT id FROM bookings LIMIT 1
)
INSERT INTO payments (booking_id, amount, payment_method, status, transaction_id)
SELECT 
    id,
    750000,
    'transfer',
    'completed',
    'TXN-' || id
FROM booking_ids
ON CONFLICT DO NOTHING;

-- ============================================
-- Database Comments
-- ============================================
COMMENT ON TABLE users IS 'Tabel untuk menyimpan data pengguna/staff hotel';
COMMENT ON TABLE room_types IS 'Tabel untuk menyimpan tipe-tipe kamar yang tersedia';
COMMENT ON TABLE rooms IS 'Tabel untuk menyimpan data kamar individual';
COMMENT ON TABLE guests IS 'Tabel untuk menyimpan data tamu hotel';
COMMENT ON TABLE bookings IS 'Tabel untuk menyimpan data pemesanan kamar';
COMMENT ON TABLE payments IS 'Tabel untuk menyimpan data pembayaran pemesanan';

-- ============================================
-- End of Database Backup
-- ============================================
