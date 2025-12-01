import React, { useState } from 'react'
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi'
import {
  useRooms,
  useCreateRoom,
  useUpdateRoom,
  useDeleteRoom,
  Room,
  RoomStatus
} from '../hooks/useRooms'
import { useRoomTypes } from '../hooks/useRoomTypes'
import Button from '../components/ui/Button'

export default function RoomsPage() {
  const { rooms, loading, error, refetch } = useRooms()
  const { roomTypes } = useRoomTypes()
  const { create: createRoom, loading: creatingRoom } = useCreateRoom()
  const { update: updateRoom, loading: updatingRoom } = useUpdateRoom()
  const { delete: deleteRoom, loading: deletingRoom } = useDeleteRoom()

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    room_number: '',
    type_id: '',
    status: 'available' as RoomStatus,
    floor: ''
  })

  // 🔍 SEARCH STATE
  const [search, setSearch] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const data = {
        room_number: formData.room_number,
        type_id: formData.type_id || null,
        status: formData.status,
        floor: formData.floor ? parseInt(formData.floor) : undefined
      }

      if (editingId) {
        await updateRoom(editingId, data)
      } else {
        await createRoom(data)
      }

      setFormData({ room_number: '', type_id: '', status: 'available', floor: '' })
      setEditingId(null)
      setShowForm(false)
      refetch()
    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan')
    }
  }

  const handleEdit = (room: Room) => {
    setFormData({
      room_number: room.room_number,
      type_id: room.type_id || '',
      status: room.status,
      floor: room.floor?.toString() || ''
    })
    setEditingId(room.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus kamar ini?')) return
    try {
      await deleteRoom(id)
      refetch()
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus kamar')
    }
  }

  const handleCancel = () => {
    setFormData({ room_number: '', type_id: '', status: 'available', floor: '' })
    setEditingId(null)
    setShowForm(false)
  }

  const getStatusColor = (status: RoomStatus) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800'
      case 'occupied': return 'bg-blue-100 text-blue-800'
      case 'booked': return 'bg-yellow-100 text-yellow-800'
      case 'maintenance': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusLabel = (status: RoomStatus) => {
    switch (status) {
      case 'available': return 'Tersedia'
      case 'booked': return 'Dipesan'
      case 'maintenance': return 'Perawatan'
      case 'occupied': return 'Terisi'
      default: return 'Unknown'
    }
  }

  // 🧠 FILTERING ROOMS DENGAN SEARCH
  const filteredRooms = rooms.filter(room => {
    const q = search.toLowerCase()
    return (
      room.room_number.toLowerCase().includes(q) ||
      room.type_name?.toLowerCase().includes(q) ||
      room.floor?.toString().includes(q)
    )
  })

  return (
    <div className="space-y-8 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-4xl font-extrabold text-purple-800 tracking-wide">Manajemen Kamar</h2>
        <Button
          variant="default"
          className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:scale-105 transition-transform"
          onClick={() => setShowForm(!showForm)}
        >
          <FiPlus /> {showForm ? 'Batal' : 'Tambah Kamar'}
        </Button>
      </div>

      {/* 🔍 SEARCH INPUT */}
      <div className="max-w-sm">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari kamar (nomor, tipe, lantai)..."
          className="w-full px-4 py-2 rounded-xl border border-purple-300 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-300 rounded-xl p-4 text-red-700 shadow-md">
          <p className="font-semibold">⚠️ Error: {error}</p>
          <p className="text-sm mt-2">Periksa browser console (F12) untuk detail lengkap</p>
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 space-y-6 border border-purple-200 transition"
        >
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nomor Kamar</label>
              <input
                type="text"
                required
                value={formData.room_number}
                onChange={e => setFormData({ ...formData, room_number: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 shadow-sm transition"
                placeholder="101"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Lantai</label>
              <input
                type="number"
                value={formData.floor}
                onChange={e => setFormData({ ...formData, floor: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 shadow-sm transition"
                placeholder="1"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tipe Kamar</label>
              <select
                value={formData.type_id}
                onChange={e => setFormData({ ...formData, type_id: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 shadow-sm transition"
              >
                <option value="">Pilih Tipe</option>
                {roomTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name} - Rp {type.price.toLocaleString('id-ID')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as RoomStatus })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 shadow-sm transition"
              >
                <option value="available">Tersedia</option>
                <option value="booked">Dipesan</option>
                <option value="maintenance">Perawatan</option>
                <option value="occupied">Terisi</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              variant="default"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
              disabled={creatingRoom || updatingRoom}
            >
              {creatingRoom || updatingRoom ? 'Menyimpan...' : editingId ? 'Perbarui' : 'Simpan'}
            </Button>
            <Button type="button" variant="outline" onClick={handleCancel}>Batal</Button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-12 text-purple-700 font-bold text-lg">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Jika hasil search kosong */}
          {filteredRooms.length === 0 ? (
            <div className="col-span-full text-center py-8 text-purple-400">
              Tidak ada kamar ditemukan
            </div>
          ) : (
            filteredRooms.map(room => (
              <div
                key={room.id}
                className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition overflow-hidden relative"
              >
                
                {room.type_image_url && (
                  <div className="absolute inset-0 overflow-hidden rounded-2xl">
                    <img
                      src={room.type_image_url}
                      alt={room.type_name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
                  </div>
                )}

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold">Kamar {room.room_number}</h3>
                      {room.floor && (
                        <p className="text-sm text-purple-600">Lantai {room.floor}</p>
                      )}
                    </div>

                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${getStatusColor(room.status)}`}
                    >
                      {getStatusLabel(room.status)}
                    </span>
                  </div>

                  <p className="text-sm text-purple-700 mb-2">{room.type_name || 'Standard'}</p>
                  <p className="text-sm font-medium text-purple-800 mb-4">
                    Rp {(room.type_price || 0).toLocaleString('id-ID')} / malam
                  </p>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="default"
                      className="flex items-center gap-1"
                      onClick={() => handleEdit(room)}
                    >
                      <FiEdit /> Edit
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      className="flex items-center gap-1"
                      onClick={() => handleDelete(room.id)}
                      disabled={deletingRoom}
                    >
                      <FiTrash2 /> Hapus
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
