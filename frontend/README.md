# 🏨 Hotel Management System - Frontend

Frontend dashboard modern untuk sistem manajemen hotel yang dibangun dengan **React**, **TypeScript**, **Vite**, dan **Tailwind CSS**. Interface intuitif dengan role-based access control untuk berbagai level pengguna.

---

## 📋 Daftar Isi

- [Fitur Utama](#fitur-utama)
- [Tech Stack](#tech-stack)
- [Instalasi](#instalasi)
- [Konfigurasi Environment](#konfigurasi-environment)
- [Cara Menjalankan](#cara-menjalankan)
- [Struktur Project](#struktur-project)
- [Komponen & Pages](#komponen--pages)
- [Hooks & Context](#hooks--context)
- [Role-Based Access Control](#role-based-access-control)
- [API Integration](#api-integration)
- [Styling & UI](#styling--ui)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Fitur Utama

✅ **Autentikasi & Autorisasi**
- Login dengan email/username
- Session management dengan JWT token
- Role-based access control (Admin, Staff, Manager)
- Persistent login dengan localStorage

✅ **Dashboard**
- Overview ringkas untuk manager dan admin
- Visualisasi data dengan charts
- Status kamar real-time

✅ **Manajemen Kamar**
- CRUD tipe kamar (Room Types)
- CRUD kamar dengan status tracking
- Informasi kapasitas, fasilitas, dan gambar
- Admin only access

✅ **Manajemen Tamu**
- CRUD data tamu (Guests)
- Informasi identitas dan kontak
- Staff dan admin access

✅ **Sistem Pemesanan**
- CRUD pemesanan (Bookings)
- Status tracking dan calendar view
- Check-in/Check-out management
- Staff dan admin access

✅ **Manajemen Pembayaran**
- CRUD pembayaran (Payments)
- Payment receipt modal
- Status tracking dan transaction history
- PDF export functionality
- Staff dan admin access

✅ **UI/UX Modern**
- Responsive design untuk semua ukuran layar
- Smooth animations dengan Framer Motion
- Dark mode ready dengan Tailwind CSS
- Toast notifications untuk user feedback
- Icon library lengkap (React Icons)

---

## 🛠️ Tech Stack

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| **React** | ^18.2.0 | UI library |
| **TypeScript** | ^5.1.6 | Type safety |
| **Vite** | ^5.1.0 | Build tool & dev server |
| **Tailwind CSS** | ^3.4.7 | Styling |
| **React Router** | ^6.20.0 | Client-side routing |
| **Axios** | ^1.6.1 | HTTP client |
| **Framer Motion** | ^12.23.24 | Animations |
| **React Icons** | ^5.5.0 | Icon library |
| **React Hot Toast** | ^2.6.0 | Toast notifications |
| **Recharts** | ^3.4.1 | Charts & graphs |
| **HTML2Canvas** | ^1.4.1 | Screenshot/PDF export |
| **PostCSS** | ^8.4.21 | CSS processing |
| **Autoprefixer** | ^10.4.14 | CSS vendor prefixes |

---

## 📦 Instalasi

### Prerequisites

Pastikan sudah terinstall:
- **Node.js** v16+ ([Download](https://nodejs.org/))
- **pnpm** atau **npm** ([Install pnpm](https://pnpm.io/installation))
- **Backend API** sudah running di `http://localhost:5000`

### Langkah Instalasi

1. **Navigasi ke folder frontend**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # atau jika menggunakan npm
   npm install
   ```

3. **Konfigurasi environment variables** (lihat [Konfigurasi Environment](#konfigurasi-environment))

4. **Jalankan development server**
   ```bash
   pnpm dev
   ```

Frontend akan terbuka di `http://localhost:5173`

---

## ⚙️ Konfigurasi Environment

Buat atau edit file `.env` di root folder frontend:

```env
# Backend API URL
VITE_API_URL=http://localhost:5000
```

### Penjelasan Environment Variables:

| Variable | Deskripsi | Default |
|----------|-----------|---------|
| `VITE_API_URL` | Base URL backend API | http://localhost:5000 |

### Untuk Production:

```env
VITE_API_URL=https://api.yourdomain.com
```

---

## 🚀 Cara Menjalankan

### Development Mode (dengan Hot Reload)

```bash
pnpm dev
```

- Server akan berjalan di `http://localhost:5173`
- Perubahan file akan auto-refresh di browser
- TypeScript errors akan ditampilkan di console

### Production Build

```bash
# Build untuk production
pnpm build

# Preview hasil build
pnpm preview
```

Output build akan tersimpan di folder `dist/`

### Scripts Available

```bash
pnpm dev          # Start development server
pnpm build        # Build untuk production
pnpm preview      # Preview production build locally
pnpm install      # Install dependencies
```

---

## 📂 Struktur Project

```
frontend/
├── src/
│   ├── App.tsx                         # Root component dengan routing
│   ├── main.tsx                        # Entry point
│   ├── components/
│   │   ├── Dashboard.tsx               # Dashboard overview
│   │   ├── PaymentReceiptModal.tsx     # Payment receipt modal
│   │   └── ui/
│   │       ├── Button.tsx              # Reusable button component
│   │       └── Sidebar.tsx             # Navigation sidebar
│   ├── contexts/
│   │   └── AuthContext.tsx             # Auth context provider
│   ├── hooks/
│   │   ├── useAuth.ts                  # Authentication hook
│   │   ├── useBookings.ts              # Bookings data hook
│   │   ├── useGuests.ts                # Guests data hook
│   │   ├── usePayments.ts              # Payments data hook
│   │   ├── useRooms.ts                 # Rooms data hook
│   │   └── useRoomTypes.ts             # Room types data hook
│   ├── lib/
│   │   ├── api.ts                      # Axios instance & API endpoints
│   │   └── authUtils.ts                # Authentication utilities
│   ├── pages/
│   │   ├── BookingsPage.tsx            # Bookings management page
│   │   ├── GuestsPage.tsx              # Guests management page
│   │   ├── LoginPage.tsx               # Login page
│   │   ├── PaymentsPage.tsx            # Payments management page
│   │   ├── RoomsPage.tsx               # Rooms management page
│   │   └── RoomTypesPage.tsx           # Room types management page
│   ├── styles/
│   │   └── globals.css                 # Global styles & Tailwind
│   └── types/
│       ├── auth.ts                     # Auth types
│       ├── booking.ts                  # Booking types
│       ├── form.ts                     # Form types
│       ├── guest.ts                    # Guest types
│       ├── index.ts                    # Type exports
│       ├── payment.ts                  # Payment types
│       ├── room.ts                     # Room types
│       └── roomType.ts                 # Room type types
├── dist/                               # Built files (generated)
├── node_modules/                       # Dependencies (generated)
├── .env                                # Environment variables
├── .env.example                        # Environment template
├── .gitignore                          # Git ignore file
├── index.html                          # HTML entry point
├── package.json                        # Dependencies & scripts
├── postcss.config.cjs                  # PostCSS configuration
├── tailwind.config.cjs                 # Tailwind CSS configuration
├── tsconfig.json                       # TypeScript configuration
├── vite.config.ts                      # Vite configuration
└── README.md                           # This file
```

---

## 🎨 Komponen & Pages

### Components

#### **Dashboard.tsx**
Menampilkan overview ringkas sistem hotel
- Statistik total kamar, tamu, pemesanan
- Charts visualisasi data
- Quick actions untuk manager/admin

#### **PaymentReceiptModal.tsx**
Modal untuk menampilkan dan export payment receipt
- Informasi pembayaran lengkap
- PDF export functionality
- Print support

#### **Sidebar.tsx**
Navigation sidebar dengan role-based menu
- Dynamic menu items berdasarkan user role
- Active route highlighting
- Logout button
- User profile display

#### **Button.tsx**
Reusable button component
- Variants: primary, secondary, danger
- Loading state
- Disabled state

### Pages

#### **LoginPage.tsx**
Halaman login dengan fitur:
- Email/username input
- Password toggle visibility
- Loading state
- Error handling
- Animated form dengan Framer Motion

#### **DashboardPage (di App.tsx)**
Dashboard untuk manager/admin
- Melihat overview sistem
- Statistik real-time

#### **BookingsPage.tsx**
Manajemen pemesanan:
- List/table pemesanan
- Create booking
- Update booking status
- Delete booking
- Filter & search
- Akses: Staff & Admin

#### **RoomsPage.tsx**
Manajemen kamar:
- List/table kamar
- Create room
- Update room status
- Delete room
- Status filtering
- Akses: Admin only

#### **RoomTypesPage.tsx**
Manajemen tipe kamar:
- CRUD room types
- Price management
- Capacity & amenities
- Image upload
- Akses: Admin only

#### **GuestsPage.tsx**
Manajemen tamu:
- CRUD guests
- Identity verification data
- Contact information
- Akses: Staff & Admin

#### **PaymentsPage.tsx**
Manajemen pembayaran:
- CRUD payments
- Status tracking
- Receipt modal
- Payment history
- Akses: Staff & Admin

---

## 🪝 Hooks & Context

### useAuth Hook

Mengelola authentication state dan operations:

```typescript
const { 
  user,              // Current user data
  loading,           // Loading state
  error,             // Error message
  isAuthenticated,   // Boolean flag
  login,             // Login function
  logout,            // Logout function
  getToken           // Get JWT token
} = useAuth()
```

**Contoh penggunaan:**
```typescript
const { login } = useAuth()

const handleLogin = async () => {
  await login({ email: 'user@example.com', password: 'pass123' })
}
```

### useBookings Hook

Mengelola bookings data:
```typescript
const { bookings, loading, error, createBooking, updateBooking, deleteBooking } = useBookings()
```

### useRooms Hook

Mengelola rooms data:
```typescript
const { rooms, loading, error, createRoom, updateRoom, deleteRoom } = useRooms()
```

### useRoomTypes Hook

Mengelola room types data:
```typescript
const { roomTypes, loading, error, createRoomType, updateRoomType, deleteRoomType } = useRoomTypes()
```

### useGuests Hook

Mengelola guests data:
```typescript
const { guests, loading, error, createGuest, updateGuest, deleteGuest } = useGuests()
```

### usePayments Hook

Mengelola payments data:
```typescript
const { payments, loading, error, createPayment, updatePayment, deletePayment } = usePayments()
```

### AuthContext

Global authentication context untuk akses auth state di mana saja:

```typescript
import { useAuthContext } from './contexts/AuthContext'

function MyComponent() {
  const { user, isAuthenticated } = useAuthContext()
  return <div>{user?.full_name}</div>
}
```

---

## 🔐 Role-Based Access Control

Sistem memiliki 3 role dengan akses berbeda:

### Admin
✅ Akses penuh ke semua fitur
- Dashboard
- Bookings
- Rooms (CRUD)
- Room Types (CRUD)
- Guests
- Payments

### Manager
✅ Akses overview saja
- Dashboard
- View-only access

### Staff
✅ Akses operational
- Bookings (CRUD)
- Guests (CRUD)
- Payments (CRUD)
- Tidak bisa akses: Rooms, Room Types

### Implementation

**File:** `src/lib/authUtils.ts`

```typescript
export const routeAccessControl: RouteAccess[] = [
  { path: '/', allowedRoles: ['manager', 'admin'] },
  { path: '/bookings', allowedRoles: ['staff', 'admin'] },
  { path: '/rooms', allowedRoles: ['admin'] },
  { path: '/room-types', allowedRoles: ['admin'] },
  { path: '/guests', allowedRoles: ['staff', 'admin'] },
  { path: '/payments', allowedRoles: ['staff', 'admin'] },
]
```

---

## 🔌 API Integration

### Axios Instance

File: `src/lib/api.ts`

```typescript
export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { 'Content-Type': 'application/json' }
})
```

### API Endpoints

Semua endpoints tersedia melalui module-specific APIs:

```typescript
import { bookingsAPI, roomsAPI, guestsAPI, paymentsAPI, roomTypesAPI } from '../lib/api'

// Bookings
bookingsAPI.getAll()
bookingsAPI.getById(id)
bookingsAPI.create(data)
bookingsAPI.update(id, data)
bookingsAPI.delete(id)

// Rooms
roomsAPI.getAll()
roomsAPI.create(data)
roomsAPI.update(id, data)

// Guests
guestsAPI.getAll()
guestsAPI.create(data)
guestsAPI.update(id, data)

// Payments
paymentsAPI.getAll()
paymentsAPI.create(data)
paymentsAPI.update(id, data)

// Room Types
roomTypesAPI.getAll()
roomTypesAPI.create(data)
roomTypesAPI.update(id, data)
```

### Error Handling

Response interceptor otomatis menangani errors:

```typescript
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    })
    return Promise.reject(error)
  }
)
```

---

## 🎨 Styling & UI

### Tailwind CSS

File: `tailwind.config.cjs`

Configuration untuk custom tema dan components.

### Global Styles

File: `src/styles/globals.css`

- Tailwind CSS imports
- Custom CSS variables
- Global utility classes

### UI Components

- **Button.tsx**: Reusable button dengan variants
- **Sidebar.tsx**: Navigation component
- Custom form inputs dan modals

### Icons

Menggunakan React Icons:
```typescript
import { FaHotel, FaHome, FaBook, FaBed, FaUsers, FaCreditCard } from 'react-icons/fa'
```

### Animations

Framer Motion untuk smooth animations:
```typescript
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.8 }}
>
  Content
</motion.div>
```

### Toast Notifications

React Hot Toast untuk user feedback:
```typescript
import toast from 'react-hot-toast'

toast.success('Berhasil disimpan!')
toast.error('Terjadi kesalahan')
toast.loading('Loading...')
```

---

## 🐛 Troubleshooting

### ❌ Error: API connection refused
**Solusi:**
1. Pastikan backend sudah running di `http://localhost:5000`
2. Cek konfigurasi `VITE_API_URL` di `.env`
3. Verifikasi CORS configuration di backend

```env
VITE_API_URL=http://localhost:5000
```

### ❌ Error: Module not found
**Solusi:**
```bash
pnpm install
# atau
npm install
```

### ❌ Error: Cannot find 'react-router-dom'
**Solusi:**
```bash
pnpm add react-router-dom
```

### ❌ Vite port already in use
**Solusi:**

Edit `vite.config.ts`:
```typescript
export default defineConfig({
  server: {
    port: 3000  // Ubah ke port lain
  }
})
```

### ❌ TypeScript errors di IDE
**Solusi:**
- Reload VS Code window (Cmd+Shift+P → "Reload Window")
- Atau restart TypeScript server (Cmd+Shift+P → "Restart TS Server")

### ❌ Login tidak berfungsi
**Solusi:**
1. Cek credentials di backend
2. Pastikan backend API endpoint `/auth/login` accessible
3. Buka DevTools → Network tab untuk melihat request
4. Verifikasi response dari API

### ❌ CORS error di browser console
**Solusi:**
1. Pastikan backend CORS configuration sudah include frontend URL
2. Di `backend/src/app.ts`:
```typescript
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true
}))
```

### ❌ Token tidak tersimpan
**Solusi:**
- Cek localStorage di DevTools (F12 → Application → Local Storage)
- Pastikan login response berisi `token` field
- Buka console untuk melihat error details

---

## 📝 Development Tips

### 1. Using React Developer Tools

Install extension di browser:
- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/)
- Debug component props, state, dan hooks

### 2. Debugging dengan VS Code

Buat `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "attach",
      "name": "Attach Chrome",
      "port": 9222,
      "pathMapping": {
        "/": "${workspaceRoot}/",
        "/src": "${workspaceRoot}/src"
      }
    }
  ]
}
```

### 3. Hot Reload Development

Vite otomatis hot reload saat file berubah. Untuk disable:
```typescript
// vite.config.ts
export default defineConfig({
  server: {
    middlewareMode: true,
    hmr: false
  }
})
```

### 4. Environment Variables di Development

Buat `.env.local` untuk local overrides:
```env
VITE_API_URL=http://localhost:5000
```

### 5. Adding New Pages

1. Buat file baru di `src/pages/NewPage.tsx`
2. Add route di `App.tsx`:
```typescript
<Route path="/new-page" element={<NewPage />} />
```
3. Add menu item di `Sidebar.tsx`

### 6. Adding New Hooks

1. Buat file di `src/hooks/useNewFeature.ts`
2. Export hook dari file
3. Import di components yang membutuhkan

---

## 🚀 Building untuk Production

### Optimisasi Build

```bash
# Build dengan optimasi
pnpm build

# Preview build
pnpm preview
```
