import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import {
  FaHome,
  FaBook,
  FaBed,
  FaUsers,
  FaCreditCard,
  FaPlus,
  FaTag,
  FaSignOutAlt,
} from 'react-icons/fa'
import Button from './Button'

const allMenuItems = [
  { name: 'Overview', path: '/', icon: <FaHome />, roles: ['manager', 'admin'] },
  { name: 'Bookings', path: '/bookings', icon: <FaBook />, roles: ['staff', 'admin'] },
  { name: 'Rooms', path: '/rooms', icon: <FaBed />, roles: ['admin'] },
  { name: 'Room Types', path: '/room-types', icon: <FaTag />, roles: ['admin'] },
  { name: 'Guests', path: '/guests', icon: <FaUsers />, roles: ['staff', 'admin'] },
  { name: 'Payments', path: '/payments', icon: <FaCreditCard />, roles: ['staff', 'admin'] },
]

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout, loading } = useAuth()

  // Filter menu items based on user role
  const userRole = user?.role?.toLowerCase() || 'guest'
  const menuItems = allMenuItems.filter(item => 
    item.roles.includes(userRole)
  )

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <aside
      className="
        fixed left-0 top-0 w-72 h-screen p-6 flex flex-col justify-between
        text-white z-50 shadow-2xl rounded-tr-3xl rounded-br-3xl
        border-r border-white/10 backdrop-blur-xl overflow-hidden
      "
      style={{
        backgroundImage: `
          linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0.45)),
          url('https://i.pinimg.com/1200x/69/e3/8a/69e38a0f919f5872cb21a3bb291836fa.jpg')
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div>
        {/* Header */}
        <div
          className="
            w-full bg-white/15 backdrop-blur-lg p-5 rounded-2xl shadow-lg 
            border border-white/30 flex items-center gap-4
          "
        >
          <img
            src="https://i.pinimg.com/736x/d1/e1/c4/d1e1c4f9474800e7726a12e663475045.jpg"
            alt="Profile"
            className="
              w-14 h-14 rounded-full object-cover border border-white/40
              shadow-md
            "
          />
          <div>
            <h2 className="text-sm font-bold tracking-wide drop-shadow-sm line-clamp-1">
              {user?.full_name || user?.username || 'User'}
            </h2>
            <p className="text-xs text-white/70 mt-1 line-clamp-1">
              {user?.role || 'Guest'}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 mt-6">
          {menuItems.map((item, idx) => {
            const isActive = location.pathname === item.path

            return (
              <div key={item.name}>
                <Link
                  to={item.path}
                  className={`
                    flex items-center px-5 py-3 rounded-xl relative overflow-hidden
                    transition-all duration-300 group
                    ${
                      isActive
                        ? 'bg-white/20 border-l-4 border-white/60 shadow-inner'
                        : 'hover:bg-white/10 hover:border-l-4 hover:border-white/30'
                    }
                  `}
                >
                  <span className="mr-4 text-xl opacity-90 group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </span>
                  <span className="text-lg tracking-wide font-medium">
                    {item.name}
                  </span>
                </Link>

                {idx < menuItems.length - 1 && (
                  <div className="border-b border-white/15 mx-5 mt-2"></div>
                )}
              </div>
            )
          })}
        </nav>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
      
        
        <button
          onClick={handleLogout}
          disabled={loading}
          className="
            w-full flex items-center justify-center gap-3
            bg-red-500/80 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg
            hover:shadow-2xl transition-all duration-300
            hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed
            py-3 px-5
          "
        >
          <FaSignOutAlt /> {loading ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </aside>
  )
}
