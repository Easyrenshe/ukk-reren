import React, { useMemo } from 'react'
import { FiUsers, FiHome, FiLayers, FiBook } from 'react-icons/fi'
import { useBookings } from '../hooks/useBookings'
import { useRooms } from '../hooks/useRooms'
import { useRoomTypes } from '../hooks/useRoomTypes'
import { useGuests } from '../hooks/useGuests'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { motion } from 'framer-motion'

export default function Dashboard() {
  const { bookings, loading: bookingsLoading } = useBookings()
  const { rooms, loading: roomsLoading } = useRooms()
  const { roomTypes, loading: roomTypesLoading } = useRoomTypes()
  const { guests, loading: guestsLoading } = useGuests()

  const totalBookings = bookings.length
  const availableRooms = rooms.filter(r => r.status === 'available').length
  const totalRoomTypes = roomTypes.length
  const totalGuests = guests.length

  const monthlyData = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(0, i).toLocaleString('default', { month: 'short' }),
      bookings: 0,
    }))

    bookings.forEach(b => {
      const monthIndex = new Date(b.check_in).getMonth()
      months[monthIndex].bookings += 1
    })

    return months
  }, [bookings])

  return (
    <div className="space-y-10 p-8">

      {/* ===== STAT CARDS ===== */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          {
            label: 'Total Bookings',
            value: totalBookings,
            loading: bookingsLoading,
            icon: <FiBook size={34} />,
            gradient: 'from-indigo-600 via-purple-600 to-pink-600'
          },
          {
            label: 'Available Rooms',
            value: availableRooms,
            loading: roomsLoading,
            icon: <FiHome size={34} />,
            gradient: 'from-emerald-500 via-teal-500 to-cyan-500'
          },
          {
            label: 'Room Types',
            value: totalRoomTypes,
            loading: roomTypesLoading,
            icon: <FiLayers size={34} />,
            gradient: 'from-fuchsia-500 via-pink-500 to-rose-500'
          },
          {
            label: 'Total Guests',
            value: totalGuests,
            loading: guestsLoading,
            icon: <FiUsers size={34} />,
            gradient: 'from-amber-400 via-orange-500 to-red-500'
          }
        ].map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05, rotate: 0.3 }}
            className={`rounded-3xl p-6 text-white shadow-[0_20px_40px_rgba(0,0,0,0.2)] bg-gradient-to-r ${item.gradient} flex items-center gap-6`}
          >
            <div className="p-4 bg-white/20 rounded-2xl shadow-inner">
              {item.icon}
            </div>

            <div>
              <p className="text-sm uppercase tracking-widest opacity-90">
                {item.label}
              </p>
              <h2 className="text-4xl font-extrabold mt-1">
                {item.loading ? '...' : item.value}
              </h2>
            </div>
          </motion.div>
        ))}
      </section>

      {/* ===== CHART SECTION ===== */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-8 shadow-lg"
      >
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">
          Monthly Booking Trend
        </h3>

        {bookingsLoading ? (
          <p className="text-gray-500">Loading chart...</p>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="bookings"
                stroke="#6366f1"
                strokeWidth={4}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </motion.section>

    </div>
  )
}
