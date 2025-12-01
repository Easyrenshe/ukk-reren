-- ============================================
-- Hotel Management System Database Schema
-- ============================================

-- Create UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Users Table (for authentication)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(150),
    role VARCHAR(50) DEFAULT 'staff', -- admin, staff, manager
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Room Types Table
CREATE TABLE IF NOT EXISTS room_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    capacity INT DEFAULT 2,
    amenities TEXT, -- JSON format for flexibility
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Rooms Table
CREATE TABLE IF NOT EXISTS rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_number VARCHAR(50) UNIQUE NOT NULL,
    type_id UUID REFERENCES room_types(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'available', -- available, booked, maintenance, occupied
    floor INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Guests Table
CREATE TABLE IF NOT EXISTS guests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    id_type VARCHAR(50), -- passport, ktp, sim
    id_number VARCHAR(50),
    nationality VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
    room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    total_price DECIMAL(12, 2),
    status VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, checked-in, checked-out, cancelled
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL,
    payment_method VARCHAR(50), -- cash, card, transfer, etc
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending', -- pending, completed, failed, refunded
    transaction_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes for better performance
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

-- Insert Room Types
INSERT INTO room_types (name, description, price, capacity, amenities) VALUES
('Standard Room', 'Basic room with essential facilities', 500000, 2, '["WiFi", "AC", "TV"]'),
('Deluxe Room', 'Spacious room with premium amenities', 750000, 2, '["WiFi", "AC", "TV", "Mini Bar", "Bathtub"]'),
('Suite', 'Luxury suite with separate living area', 1500000, 4, '["WiFi", "AC", "TV", "Mini Bar", "Bathtub", "Jacuzzi"]'),
('Presidential Suite', 'Top-tier luxury accommodation', 3000000, 4, '["WiFi", "AC", "TV", "Mini Bar", "Bathtub", "Jacuzzi", "Concierge"]')
ON CONFLICT DO NOTHING;

-- Insert Sample Rooms
INSERT INTO rooms (room_number, type_id, status, floor) VALUES
('101', 1, 'available', 1),
('102', 1, 'available', 1),
('103', 2, 'available', 1),
('104', 2, 'available', 1),
('201', 1, 'available', 2),
('202', 1, 'available', 2),
('203', 3, 'available', 2),
('204', 3, 'available', 2),
('301', 4, 'available', 3)
ON CONFLICT DO NOTHING;

-- Insert Sample Guest
INSERT INTO guests (full_name, phone, email, address, id_type, id_number, nationality) VALUES
('John Doe', '+1234567890', 'john@example.com', '123 Main St', 'passport', 'A12345678', 'American'),
('Jane Smith', '+9876543210', 'jane@example.com', '456 Oak Ave', 'ktp', '1234567890123456', 'Indonesian')
ON CONFLICT DO NOTHING;

-- Insert Admin User
INSERT INTO users (username, password, email, full_name, role, is_active) VALUES
('admin', '$2a$10$W7yLQ8D7VPAY1eY4hZSM.el7TwZGxHPK/x2fE8F5Z/5K8ZKbGlrQS', 'admin@hotel.com', 'Admin User', 'admin', true)
ON CONFLICT DO NOTHING;

-- ============================================
-- Note: Password is "password123" for admin user
-- ============================================
