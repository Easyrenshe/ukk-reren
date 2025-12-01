@echo off
REM ============================================
REM Script untuk Restore Database ke PostgreSQL
REM Untuk: Hotel Management System
REM ============================================

setlocal enabledelayedexpansion

REM Konfigurasi
set PG_USER=postgres
set PG_HOST=localhost
set PG_PORT=5432
set DB_NAME=hms
set BACKUP_FILE=%~dp0hotel_management_system.sql

REM Tampilkan informasi
cls
echo.
echo ============================================
echo   Hotel Management System - Database Restore
echo ============================================
echo.
echo Informasi Restore:
echo - PostgreSQL User: %PG_USER%
echo - Host: %PG_HOST%
echo - Port: %PG_PORT%
echo - Database: %DB_NAME%
echo - Backup File: %BACKUP_FILE%
echo.

REM Cek apakah file backup ada
if not exist "%BACKUP_FILE%" (
    echo ERROR: File backup tidak ditemukan!
    echo Path yang dicari: %BACKUP_FILE%
    echo.
    pause
    exit /b 1
)

echo File backup ditemukan.
echo.

REM Tanya kepada user
echo Pilihan:
echo 1. Restore database (jika database sudah ada, akan ditimpa)
echo 2. Drop database kemudian Restore (bersihkan semua data)
echo 3. Batal
echo.

set /p CHOICE="Pilih opsi (1-3): "

if "%CHOICE%"=="1" (
    echo.
    echo Proses restore dimulai...
    echo.
    psql -U %PG_USER% -h %PG_HOST% -p %PG_PORT% -f "%BACKUP_FILE%"
    
    if errorlevel 1 (
        echo.
        echo ERROR: Restore gagal!
        echo Silakan check:
        echo - PostgreSQL server sedang berjalan?
        echo - Credentials benar?
        echo - File backup valid?
        echo.
        pause
        exit /b 1
    )
    
    echo.
    echo SUCCESS: Database berhasil di-restore!
    echo.
    
) else if "%CHOICE%"=="2" (
    echo.
    echo Proses DROP database dimulai...
    echo.
    
    REM Prompt untuk konfirmasi
    set /p CONFIRM="Apakah Anda yakin ingin menghapus database %DB_NAME%? (Y/N): "
    
    if /i "%CONFIRM%"=="Y" (
        psql -U %PG_USER% -h %PG_HOST% -p %PG_PORT% -c "DROP DATABASE IF EXISTS %DB_NAME%;"
        
        if errorlevel 1 (
            echo ERROR: Gagal menghapus database!
            pause
            exit /b 1
        )
        
        echo Database %DB_NAME% berhasil dihapus.
        echo.
        echo Proses restore dimulai...
        echo.
        
        psql -U %PG_USER% -h %PG_HOST% -p %PG_PORT% -f "%BACKUP_FILE%"
        
        if errorlevel 1 (
            echo ERROR: Restore gagal!
            pause
            exit /b 1
        )
        
        echo.
        echo SUCCESS: Database berhasil di-restore!
        echo.
    ) else (
        echo Dibatalkan.
    )
    
) else if "%CHOICE%"=="3" (
    echo Dibatalkan.
    
) else (
    echo Pilihan tidak valid!
    pause
    exit /b 1
)

echo.
echo Verifikasi Database (menampilkan list tables):
echo.
psql -U %PG_USER% -h %PG_HOST% -p %PG_PORT% -d %DB_NAME% -c "\dt"

echo.
echo Press any key untuk menutup window...
pause >nul
