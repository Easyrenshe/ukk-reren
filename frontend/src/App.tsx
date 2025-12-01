import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { isRouteAccessible, getAccessibleRoutes } from './lib/authUtils'
import Sidebar from './components/ui/Sidebar'
import Dashboard from './components/Dashboard'
import LoginPage from './pages/LoginPage'
import BookingsPage from './pages/BookingsPage'
import RoomsPage from './pages/RoomsPage'
import RoomTypesPage from './pages/RoomTypesPage'
import GuestsPage from './pages/GuestsPage'
import PaymentsPage from './pages/PaymentsPage'

// Protected Layout Component - checks auth and redirects if needed
function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}

// Route-based access control component
function ProtectedRoute({ element, path }: { element: React.ReactElement; path: string }) {
  const { user } = useAuth()
  
  // Check if user has access to this route
  if (!isRouteAccessible(path, user?.role)) {
    // Return null - the sidebar won't show this menu anyway
    return null
  }
  
  return element
}

// Landing page that redirects based on user role
function DefaultPage() {
  const { user } = useAuth()
  const accessibleRoutes = getAccessibleRoutes(user?.role)
  const defaultRoute = accessibleRoutes[0] || '/login'
  
  return <Navigate to={defaultRoute} replace />
}

// Dashboard or redirect if user doesn't have access
function DashboardOrDefault() {
  const { user } = useAuth()
  
  // If user is manager or admin, show dashboard
  if (isRouteAccessible('/', user?.role)) {
    return <Dashboard />
  }
  
  // Otherwise redirect to their first accessible route
  const accessibleRoutes = getAccessibleRoutes(user?.role)
  const defaultRoute = accessibleRoutes[0] || '/login'
  return <Navigate to={defaultRoute} replace />
}

export default function App() {
  const { getToken } = useAuth()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if token exists in localStorage on mount
    const token = getToken()
    setIsLoading(false)
  }, [getToken])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-semibold text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedLayout>
              <div
                className="min-h-screen bg-cover bg-center"
                style={{ backgroundImage: "url('https://i.pinimg.com/1200x/59/7c/65/597c65e6c30895c8ff5254c0ef9f9876.jpg')" }}
              >
                <div className="flex h-screen">
                  <Sidebar />
                  <main className="flex-1 p-6 overflow-y-auto ml-72">
                    <Routes>
                      <Route path="/" element={<DashboardOrDefault />} />
                      <Route path="/bookings" element={<ProtectedRoute path="/bookings" element={<BookingsPage />} />} />
                      <Route path="/rooms" element={<ProtectedRoute path="/rooms" element={<RoomsPage />} />} />
                      <Route path="/room-types" element={<ProtectedRoute path="/room-types" element={<RoomTypesPage />} />} />
                      <Route path="/guests" element={<ProtectedRoute path="/guests" element={<GuestsPage />} />} />
                      <Route path="/payments" element={<ProtectedRoute path="/payments" element={<PaymentsPage />} />} />
                      <Route path="*" element={<DefaultPage />} />
                    </Routes>
                  </main>
                </div>
              </div>
            </ProtectedLayout>
          }
        />
      </Routes>
    </Router>
  )
}
