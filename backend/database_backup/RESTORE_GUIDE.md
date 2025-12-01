# Panduan Restore Database ke PostgreSQL

## Metode 1: Menggunakan psql Command Line (Recommended)

### Step 1: Buka Command Prompt/Terminal

### Step 2: Navigate ke direktori backup
```bash
cd c:\HOTEL-MANAGEMENT-SYSTEM\backend\database_backup
```

### Step 3: Restore database menggunakan psql
```bash
psql -U postgres -h localhost -p 5432 -f hotel_management_system.sql
```

**Atau jika perlu masukkan password:**
```bash
psql -U postgres -h localhost -p 5432 -W -f hotel_management_system.sql
```

### Step 4: Verifikasi berhasil
Setelah proses selesai, Anda akan melihat pesan sukses.

---

## Metode 2: Menggunakan pgAdmin 4

### Step 1: Buka pgAdmin 4
- Akses `http://localhost:5050` (atau alamat pgAdmin Anda)
- Login dengan credentials pgAdmin Anda

### Step 2: Buat Database Baru (opsional)
- Jika database `hms` belum ada, buat terlebih dahulu
- Klik kanan **Databases** → **Create** → **Database**
- Nama: `hms`
- Klik **Save**

### Step 3: Restore dari File SQL
- Klik kanan database **hms** → **Restore...**
- Atau gunakan **Tools** → **Restore...**

### Step 4: Pilih File Backup
- Klik folder icon untuk browse file
- Navigasi ke `c:\HOTEL-MANAGEMENT-SYSTEM\backend\database_backup\hotel_management_system.sql`
- Pilih file tersebut
- Klik **Restore**

### Step 5: Tunggu Proses Selesai
- Akan ada notifikasi ketika proses selesai
- Cek refresh database untuk melihat tables yang baru

---

## Metode 3: Menggunakan pgAdmin Query Tool

### Step 1: Buka Query Tool
- Koneksi ke server PostgreSQL Anda di pgAdmin
- Klik database **hms** (atau create baru jika belum ada)
- Buka **Tools** → **Query Tool** (atau tekan Alt+Shift+Q)

### Step 2: Buka File SQL
- Di Query Tool, klik **File** → **Open...**
- Navigasi ke `c:\HOTEL-MANAGEMENT-SYSTEM\backend\database_backup\hotel_management_system.sql`
- Klik **Open**

### Step 3: Execute Query
- Tekan **F5** atau klik tombol **Execute**
- Tunggu hingga selesai

---

## Metode 4: Menggunakan DBeaver

### Step 1: Buka DBeaver
- Koneksi ke database PostgreSQL Anda

### Step 2: Import SQL File
- Klik kanan database **hms** → **Execute Script**
- Pilih file `hotel_management_system.sql`
- Klik **Execute**

---

## Troubleshooting

### Error: "database "hms" already exists"
**Solusi:**
```bash
# Hapus database yang ada
psql -U postgres -h localhost -p 5432 -c "DROP DATABASE IF EXISTS hms;"

# Kemudian restore kembali
psql -U postgres -h localhost -p 5432 -f hotel_management_system.sql
```

### Error: "permission denied for schema public"
**Solusi:**
```bash
# Jalankan sebagai superuser
psql -U postgres -h localhost -p 5432 -f hotel_management_system.sql
```

### Error: "could not connect to server"
**Solusi:**
1. Pastikan PostgreSQL server sudah running
2. Cek host, port, dan credentials di `.env`
3. Verify firewall tidak memblok koneksi

### Error: "password authentication failed"
**Solusi:**
1. Pastikan password di `.env` sesuai dengan password PostgreSQL
2. Jika lupa, reset password PostgreSQL:
```bash
# Windows - dari PostgreSQL installation folder
cd "C:\Program Files\PostgreSQL\14\bin"
pg_ctl -D "C:\Program Files\PostgreSQL\14\data" stop
# Lalu ubah password via pgAdmin atau tools lain
```

---

## Cara Backup Database Saat Ini

Jika ingin membuat backup dari database yang sudah ada:

### Command:
```bash
pg_dump -U postgres -h localhost -p 5432 hms > c:\HOTEL-MANAGEMENT-SYSTEM\backend\database_backup\hotel_management_system_backup_$(date +%Y%m%d_%H%M%S).sql
```

### Atau menggunakan pgAdmin:
1. Klik kanan database **hms**
2. Pilih **Backup...**
3. Atur opsi sesuai kebutuhan
4. Klik **Backup** untuk menyimpan file

---

## Verifikasi Database Berhasil Di-restore

### Menggunakan psql:
```bash
# Tampilkan semua databases
psql -U postgres -l

# Tampilkan semua tables di database hms
psql -U postgres -d hms -c "\dt"

# Tampilkan struktur tabel users
psql -U postgres -d hms -c "\d users"

# Query data
psql -U postgres -d hms -c "SELECT * FROM users;"
```

### Menggunakan pgAdmin:
1. Buka pgAdmin
2. Navigasi ke **Servers** → **PostgreSQL** → **Databases** → **hms**
3. Expand untuk melihat **Schemas** → **public** → **Tables**
4. Klik refresh jika tidak langsung muncul

---

## Catatan Penting

- File backup ini sudah include struktur table, indexes, dan sample data
- Database name: `hms`
- Username default: `postgres`
- Host: `localhost` (sesuai .env)
- Port: `5432` (sesuai .env)
- Semua table memiliki UUID sebagai primary key
- Relasi foreign key sudah include CASCADE rules

## Koneksi String untuk Application

Setelah database di-restore, gunakan koneksi string berikut di aplikasi:

```env
PG_HOST=localhost
PG_PORT=5432
PG_USER=postgres
PG_PASSWORD=Mayreren12
PG_DATABASE=hms
```

---

**Dibuat pada:** December 1, 2025
**Version:** 1.0
