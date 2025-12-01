# 📦 Database Backup & Restore - Hotel Management System

## Deskripsi

Folder ini berisi file-file backup database dan script untuk memudahkan proses restore database Hotel Management System ke PostgreSQL, baik untuk development maupun production.

---

## 📁 File-File di Folder Ini

| File | Deskripsi |
|------|-----------|
| `hotel_management_system.sql` | File SQL backup lengkap dengan schema, indexes, dan sample data |
| `RESTORE_GUIDE.md` | Panduan lengkap restore database (4 metode berbeda) |
| `restore.bat` | Script batch otomatis untuk restore database (Windows) |
| `backup.bat` | Script batch otomatis untuk backup database terbaru (Windows) |
| `README.md` | File ini - panduan cepat dan overview |

---

## ⚡ Quick Start

### Cara Tercepat: Gunakan Script Batch

#### Step 1: Pastikan PostgreSQL Running
```bash
# Verify PostgreSQL service running
psql -U postgres -c "SELECT version();"
```

#### Step 2: Run Script Restore
**Klik 2x file `restore.bat`** atau buka Command Prompt:

```bash
cd c:\HOTEL-MANAGEMENT-SYSTEM\backend\database_backup
restore.bat
```

#### Step 3: Ikuti Instruksi
- Pilih opsi (1-3)
- Tunggu hingga selesai
- Script akan verifikasi otomatis

---

## 📋 Informasi Database

### Connection Details
```
Host: localhost
Port: 5432
Database: hms
User: postgres
Password: Mayreren12 (sesuai .env)
```

### Table Structure
- **users** - Data pengguna/staff (admin, manager, staff)
- **room_types** - Tipe-tipe kamar (Standard, Deluxe, Suite, Family)
- **rooms** - Kamar individual dengan nomor
- **guests** - Data tamu hotel
- **bookings** - Data pemesanan kamar
- **payments** - Data pembayaran

### Sample Data Included
✅ 3 users (admin, manager, staff)
✅ 4 room types dengan harga berbeda
✅ 4 rooms dengan status berbeda
✅ 3 guests contoh
✅ 1 booking dengan payment

---

## 🔄 Metode Restore

### 1️⃣ **Metode Tercepat: Batch Script (Recommended)**

```bash
restore.bat
```

**Keuntungan:**
- User-friendly, tinggal klik
- Automatic verification
- Pilihan drop & restore untuk clean start

---

### 2️⃣ **Metode Command Line (Advanced)**

```bash
# Simple restore
psql -U postgres -h localhost -p 5432 -f hotel_management_system.sql

# Dengan password prompt
psql -U postgres -h localhost -p 5432 -W -f hotel_management_system.sql

# Drop dan restore clean
psql -U postgres -h localhost -p 5432 -c "DROP DATABASE IF EXISTS hms;"
psql -U postgres -h localhost -p 5432 -f hotel_management_system.sql
```

---

### 3️⃣ **Metode pgAdmin UI**

1. Buka pgAdmin 4 (http://localhost:5050)
2. Klik kanan database **hms** → **Restore**
3. Browse ke file `hotel_management_system.sql`
4. Klik **Restore**
5. Tunggu selesai

---

### 4️⃣ **Metode pgAdmin Query Tool**

1. Buka Query Tool di pgAdmin
2. Buka file `hotel_management_system.sql`
3. Tekan **F5** untuk execute
4. Tunggu selesai

**Detail lengkap ada di `RESTORE_GUIDE.md`**

---

## 💾 Cara Backup Database Terbaru

### Gunakan Script Batch

```bash
backup.bat
```

File akan di-save dengan naming: `hotel_management_system_backup_YYYYMMDD_HHMM.sql`

### Atau Manual Command

```bash
pg_dump -U postgres -h localhost -p 5432 hms > backup_$(date +%Y%m%d_%H%M%S).sql
```

---

## ✅ Verifikasi Database Berhasil

### Via Command Line

```bash
# Cek apakah database ada
psql -U postgres -l | findstr hms

# Cek semua tables
psql -U postgres -d hms -c "\dt"

# Cek data di users table
psql -U postgres -d hms -c "SELECT * FROM users;"
```

### Via pgAdmin

1. Buka pgAdmin
2. Server → PostgreSQL → Databases → hms
3. Expand **Schemas** → **public** → **Tables**
4. Seharusnya terlihat 6 tables: users, room_types, rooms, guests, bookings, payments

---

## 🚨 Troubleshooting

### ❌ Error: "database already exists"
```bash
# Drop database existing
psql -U postgres -h localhost -p 5432 -c "DROP DATABASE IF EXISTS hms;"

# Kemudian restore
psql -U postgres -h localhost -p 5432 -f hotel_management_system.sql
```

### ❌ Error: "could not connect to server"
**Pastikan:**
1. PostgreSQL service sudah running
2. Host, port, credentials sesuai di `.env`
3. Firewall tidak memblok port 5432

**Cek service:**
```bash
# Windows - cek PostgreSQL service
sc query postgresql-x64-14

# Atau cek di Services.msc
```

### ❌ Error: "password authentication failed"
1. Verify password di `.env` file
2. Atau reset password PostgreSQL
3. Coba login manual terlebih dahulu: `psql -U postgres -h localhost`

### ❌ Error: "permission denied"
Pastikan running sebagai Administrator atau dengan credentials yang tepat:
```bash
# Run Command Prompt as Administrator
# Then run restore.bat
```

---

## 📚 Dokumentasi Lengkap

Untuk panduan lengkap dengan semua detail, lihat: **`RESTORE_GUIDE.md`**

Isi file tersebut:
- ✅ 4 metode restore berbeda
- ✅ Step-by-step instructions untuk setiap metode
- ✅ Troubleshooting lengkap
- ✅ Verifikasi database
- ✅ Backup database yang sudah running

---

## 🔐 Keamanan

⚠️ **Penting untuk Production:**

1. **Jangan commit `.env` ke git** - file ini berisi password
2. **Ganti JWT_SECRET** di `.env` untuk production
3. **Ubah password postgres default**
4. **Backup data secara berkala**
5. **Gunakan encrypted backup** untuk production

---

## 📝 Tech Stack

- **Database**: PostgreSQL 12+
- **Driver**: Node.js pg library
- **Format**: SQL standard dengan UUID
- **Relations**: Foreign keys dengan CASCADE
- **Indexes**: Optimized untuk query performa

---

## 🎯 Use Cases

### Development
✅ Restore sample database untuk testing
✅ Reset database jika ada kesalahan
✅ Share database dengan tim

### Staging/Production
✅ Deploy database structure ke server baru
✅ Backup data berkala
✅ Disaster recovery
✅ Database migration

---

## 📞 Support

Jika ada masalah:

1. **Baca `RESTORE_GUIDE.md`** - sudah cover 90% masalah
2. **Check PostgreSQL logs** - location: `C:\Program Files\PostgreSQL\14\data`
3. **Verify credentials** - di `.env` file backend
4. **Test koneksi manual**: `psql -U postgres -h localhost`

---

## 📄 Changelog

### Version 1.0 (Dec 1, 2025)
- ✨ Initial backup file dengan sample data
- ✨ Restore batch script untuk Windows
- ✨ Backup batch script untuk database terbaru
- ✨ Dokumentasi lengkap 4 metode restore
- ✨ README dengan quick start guide

---

## 🔄 Version Info

- Database Name: `hms`
- Schema Version: 1.0
- Created: December 1, 2025
- Last Updated: December 1, 2025

---

**Happy Restoring! 🚀**
