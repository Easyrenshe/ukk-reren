import React, { useState } from 'react'
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi'
import { useBookings, useCreateBooking, useUpdateBooking, useDeleteBooking } from '../hooks/useBookings'
import { useGuests } from '../hooks/useGuests'
import { useRooms } from '../hooks/useRooms'
import Button from '../components/ui/Button'

export default function BookingsPage() {
  const { bookings, loading, error, refetch } = useBookings()
  const { guests } = useGuests()
  const { rooms } = useRooms()
  const { create: createBooking, loading: creatingBooking } = useCreateBooking()
  const { update: updateBooking, loading: updatingBooking } = useUpdateBooking()
  const { delete: deleteBooking, loading: deletingBooking } = useDeleteBooking()

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    guest_id: '',
    room_id: '',
    check_in: '',
    check_out: '',
    total_price: '',
    status: 'pending',
    notes: ''
  })

  // 🔍 SEARCH
  const [search, setSearch] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const data = {
        guest_id: formData.guest_id,
        room_id: formData.room_id,
        check_in: formData.check_in,
        check_out: formData.check_out,
        total_price: parseFloat(formData.total_price) || null,
        status: formData.status,
        notes: formData.notes || null
      }

      if (editingId !== null) await updateBooking(editingId, data)
      else await createBooking(data)

      setFormData({ guest_id: '', room_id: '', check_in: '', check_out: '', total_price: '', status: 'pending', notes: '' })
      setEditingId(null)
      setShowForm(false)
      refetch()
    } catch (err) { console.error(err) }
  }

  const handleEdit = (booking: any) => {
    setFormData({
      guest_id: booking.guest_id,
      room_id: booking.room_id,
      check_in: booking.check_in,
      check_out: booking.check_out,
      total_price: booking.total_price?.toString() || '',
      status: booking.status,
      notes: booking.notes || ''
    })
    setEditingId(booking.booking_id)
    setShowForm(true)
  }

  const handleDelete = async (id: string | number) => {
    if (confirm('Yakin ingin membatalkan pemesanan ini?')) {
      try { await deleteBooking(id); refetch() } 
      catch (err) { console.error(err) }
    }
  }

  const handleCancel = () => {
    setFormData({ guest_id: '', room_id: '', check_in: '', check_out: '', total_price: '', status: 'pending', notes: '' })
    setEditingId(null)
    setShowForm(false)
  }

  const getStatusStyle = (status: string) => {
    const base = 'px-3 py-1 text-xs font-semibold rounded-full shadow-sm'
    switch (status) {
      case 'pending': return `${base} bg-yellow-100 text-yellow-800`
      case 'confirmed': return `${base} bg-green-100 text-green-800`
      case 'checked-in': return `${base} bg-blue-100 text-blue-800`
      case 'checked-out': return `${base} bg-gray-200 text-gray-700`
      case 'cancelled': return `${base} bg-red-100 text-red-800`
      default: return `${base} bg-gray-100 text-gray-700`
    }
  }

  // 🧠 FILTER BOOKING DENGAN SEARCH
  const filteredBookings = bookings.filter(b => {
    const q = search.toLowerCase()

    return (
      b.guest_name?.toLowerCase().includes(q) ||
      b.room_number?.toLowerCase().includes(q) ||
      b.room_type?.toLowerCase().includes(q) ||
      b.status?.toLowerCase().includes(q) ||
      b.notes?.toLowerCase().includes(q) ||
      b.total_price?.toString().includes(q) ||
      new Date(b.check_in).toLocaleDateString('id-ID').includes(q) ||
      new Date(b.check_out).toLocaleDateString('id-ID').includes(q)
    )
  })

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-4xl font-extrabold text-purple-800 tracking-wide">Manajemen Pemesanan</h2>
        <Button
          variant="default"
          className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:scale-105 transition-transform"
          onClick={() => setShowForm(!showForm)}
        >
          <FiPlus /> {showForm ? 'Batal' : 'Pemesanan Baru'}
        </Button>
      </div>

      {/* 🔍 SEARCH INPUT */}
      <div className="max-w-sm">
        <input
          type="text"
          placeholder="Cari pemesanan (tamu, kamar, tipe, tanggal, status)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 rounded-xl border border-purple-300 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-300 rounded-xl p-4 text-red-700 shadow-md">
          {error}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 space-y-6 border border-purple-200 transition"
        >
          <div className="grid grid-cols-2 gap-6">
            {/* Guest */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tamu *</label>
              <select
                value={formData.guest_id}
                onChange={(e) => setFormData({ ...formData, guest_id: e.target.value })}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 shadow-sm transition"
              >
                <option value="">Pilih Tamu</option>
                {guests.map(guest => (
                  <option key={guest.id} value={guest.id}>{guest.full_name}</option>
                ))}
              </select>
            </div>

            {/* Room */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Kamar *</label>
              <select
                value={formData.room_id}
                onChange={(e) => setFormData({ ...formData, room_id: e.target.value })}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 shadow-sm transition"
              >
                <option value="">Pilih Kamar</option>
                {rooms.map(room => (
                  <option key={room.id} value={room.id}>
                    Kamar {room.room_number} {room.type_name && `- ${room.type_name}`}
                    {room.status !== 'available' && ` (${room.status})`}
                  </option>
                ))}
              </select>
            </div>

            {/* Check-in */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Check-in *</label>
              <input
                type="date"
                value={formData.check_in}
                onChange={(e) => setFormData({ ...formData, check_in: e.target.value })}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-400 transition"
              />
            </div>

            {/* Check-out */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Check-out *</label>
              <input
                type="date"
                value={formData.check_out}
                onChange={(e) => setFormData({ ...formData, check_out: e.target.value })}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-400 transition"
              />
            </div>

            {/* Total Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Total Harga</label>
              <input
                type="number"
                value={formData.total_price}
                onChange={(e) => setFormData({ ...formData, total_price: e.target.value })}
                placeholder="0"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-400 transition"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-400 transition"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Dikonfirmasi</option>
                <option value="checked-in">Check-in</option>
                <option value="checked-out">Check-out</option>
                <option value="cancelled">Dibatalkan</option>
              </select>
            </div>

            {/* Notes */}
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Catatan</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={2}
                placeholder="Catatan tambahan untuk pemesanan ini"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-400 transition"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" variant="default" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg">
              {creatingBooking || updatingBooking ? 'Menyimpan...' : editingId ? 'Perbarui' : 'Simpan'}
            </Button>
            <Button type="button" variant="outline" onClick={handleCancel}>Batal</Button>
          </div>
        </form>
      )}

      {/* Table */}
      {loading ? (
        <div className="text-center py-12 text-purple-700 font-bold text-lg">Loading...</div>
      ) : (
        <div className="overflow-x-auto rounded-2xl shadow-xl border border-purple-200">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-300">
              <tr>
                {['Tamu','Kamar','Tipe','Check-in','Check-out','Harga','Status','Aksi'].map(header => (
                  <th key={header} className="px-6 py-3 text-purple-800 font-semibold">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-purple-400">Tidak ada pemesanan ditemukan</td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr key={booking.booking_id} className="border-b hover:bg-purple-50 hover:shadow-md transition-all">
                    <td className="px-6 py-3 font-medium">{booking.guest_name}</td>
                    <td className="px-6 py-3">Kamar {booking.room_number}</td>
                    <td className="px-6 py-3">{booking.room_type}</td>
                    <td className="px-6 py-3">{new Date(booking.check_in).toLocaleDateString('id-ID')}</td>
                    <td className="px-6 py-3">{new Date(booking.check_out).toLocaleDateString('id-ID')}</td>
                    <td className="px-6 py-3">Rp {booking.total_price?.toLocaleString('id-ID') || '-'}</td>
                    <td className="px-6 py-3">
                      <span className={getStatusStyle(booking.status)}>
                        {booking.status === 'pending' ? 'Pending' :
                         booking.status === 'confirmed' ? 'Dikonfirmasi' :
                         booking.status === 'checked-in' ? 'Check-in' :
                         booking.status === 'checked-out' ? 'Check-out' : 'Dibatalkan'}
                      </span>
                    </td>
                    <td className="px-6 py-3 flex gap-2">
                      <Button size="sm" variant="ghost" className="flex items-center gap-1 hover:text-purple-700" onClick={() => handleEdit(booking)}>
                        <FiEdit /> Edit
                      </Button>
                      <Button size="sm" variant="destructive" className="flex items-center gap-1" onClick={() => handleDelete(booking.booking_id)} disabled={deletingBooking}>
                        <FiTrash2 /> Hapus
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
