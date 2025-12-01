-- ============================================
-- Script untuk update relasi ke CASCADE
-- Jalankan script ini untuk mengupdate constraint yang sudah ada
-- ============================================

-- Drop existing foreign keys untuk bookings table
ALTER TABLE IF EXISTS bookings DROP CONSTRAINT IF EXISTS bookings_guest_id_fkey;
ALTER TABLE IF EXISTS bookings DROP CONSTRAINT IF EXISTS bookings_room_id_fkey;

-- Drop existing foreign keys untuk payments table
ALTER TABLE IF EXISTS payments DROP CONSTRAINT IF EXISTS payments_booking_id_fkey;

-- Drop existing foreign keys untuk rooms table
ALTER TABLE IF EXISTS rooms DROP CONSTRAINT IF EXISTS rooms_type_id_fkey;

-- Tambah foreign key baru dengan CASCADE
-- Guests ke Bookings: Jika guest dihapus, booking akan terhapus
ALTER TABLE bookings ADD CONSTRAINT bookings_guest_id_fkey 
    FOREIGN KEY (guest_id) REFERENCES guests(id) 
    ON DELETE CASCADE ON UPDATE CASCADE;

-- Rooms ke Bookings: Jika room dihapus, booking.room_id akan SET NULL
ALTER TABLE bookings ADD CONSTRAINT bookings_room_id_fkey 
    FOREIGN KEY (room_id) REFERENCES rooms(id) 
    ON DELETE SET NULL ON UPDATE CASCADE;

-- Bookings ke Payments: Jika booking dihapus, payment akan terhapus
ALTER TABLE payments ADD CONSTRAINT payments_booking_id_fkey 
    FOREIGN KEY (booking_id) REFERENCES bookings(id) 
    ON DELETE CASCADE ON UPDATE CASCADE;

-- Room Types ke Rooms: Jika room type dihapus, room.type_id akan SET NULL
ALTER TABLE rooms ADD CONSTRAINT rooms_type_id_fkey 
    FOREIGN KEY (type_id) REFERENCES room_types(id) 
    ON DELETE SET NULL ON UPDATE CASCADE;

-- ============================================
-- Penjelasan Relasi CASCADE:
-- ============================================
-- 1. ON DELETE CASCADE: Jika parent record dihapus, child records otomatis dihapus
-- 2. ON UPDATE CASCADE: Jika parent record di-update (ID berubah), child records otomatis ter-update
-- 3. ON DELETE SET NULL: Jika parent record dihapus, foreign key di child di-set NULL
--
-- Relasi yang diterapkan:
-- - Guest dihapus → Semua Booking guest itu otomatis dihapus → Semua Payment booking itu otomatis dihapus
-- - Room dihapus → Booking.room_id menjadi NULL (tidak ada cascading)
-- - Booking dihapus → Semua Payment booking itu otomatis dihapus
-- - Room Type dihapus → Room.type_id menjadi NULL (tidak ada cascading)
-- ============================================
