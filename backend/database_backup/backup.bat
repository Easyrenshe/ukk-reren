@echo off
REM ============================================
REM Script untuk Backup Database dari PostgreSQL
REM Untuk: Hotel Management System
REM ============================================

setlocal enabledelayedexpansion

REM Konfigurasi
set PG_USER=postgres
set PG_HOST=localhost
set PG_PORT=5432
set DB_NAME=hms
set BACKUP_DIR=%~dp0

REM Generate timestamp
for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set mydate=%%c%%a%%b)
for /f "tokens=1-2 delims=/:" %%a in ('time /t') do (set mytime=%%a%%b)

set BACKUP_FILE=%BACKUP_DIR%hotel_management_system_backup_%mydate%_%mytime%.sql

REM Tampilkan informasi
cls
echo.
echo ============================================
echo   Hotel Management System - Database Backup
echo ============================================
echo.
echo Informasi Backup:
echo - PostgreSQL User: %PG_USER%
echo - Host: %PG_HOST%
echo - Port: %PG_PORT%
echo - Database: %DB_NAME%
echo - Output File: %BACKUP_FILE%
echo.

echo Proses backup dimulai...
echo.

REM Jalankan pg_dump
pg_dump -U %PG_USER% -h %PG_HOST% -p %PG_PORT% %DB_NAME% > "%BACKUP_FILE%"

if errorlevel 1 (
    echo.
    echo ERROR: Backup gagal!
    echo Silakan check:
    echo - PostgreSQL server sedang berjalan?
    echo - Credentials benar?
    echo - Database %DB_NAME% ada?
    echo.
    pause
    exit /b 1
)

REM Cek ukuran file
for %%A in ("%BACKUP_FILE%") do set size=%%~zA

echo.
echo SUCCESS: Database berhasil di-backup!
echo File: %BACKUP_FILE%
echo Ukuran: %size% bytes
echo.
echo Anda dapat restore file ini kapan saja menggunakan restore.bat
echo.

pause
