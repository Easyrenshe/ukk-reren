import React, { useState } from 'react'
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi'
import { useRoomTypes, useCreateRoomType, useUpdateRoomType, useDeleteRoomType } from '../hooks/useRoomTypes'
import Button from '../components/ui/Button'

export default function RoomTypesPage() {
  const { roomTypes, loading, error, refetch } = useRoomTypes()
  const { create: createRoomType, loading: creatingRoomType } = useCreateRoomType()
  const { update: updateRoomType, loading: updatingRoomType } = useUpdateRoomType()
  const { delete: deleteRoomType, loading: deletingRoomType } = useDeleteRoomType()

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    capacity: '',
    amenities: '',
    image_url: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const data = {
        name: formData.name,
        description: formData.description || null,
        price: formData.price ? parseFloat(formData.price) : null,
        capacity: formData.capacity ? parseInt(formData.capacity) : null,
        amenities: formData.amenities || null,
        image_url: formData.image_url || null
      }

      if (editingId) await updateRoomType(editingId, data)
      else await createRoomType(data)

      setFormData({ name: '', description: '', price: '', capacity: '', amenities: '', image_url: '' })
      setEditingId(null)
      setShowForm(false)
      refetch()
    } catch (err) { console.error(err) }
  }

  const handleEdit = (roomType: any) => {
    setFormData({
      name: roomType.name,
      description: roomType.description || '',
      price: (roomType.price || '').toString(),
      capacity: (roomType.capacity || '').toString(),
      amenities: roomType.amenities || '',
      image_url: roomType.image_url || ''
    })
    setEditingId(roomType.id)
    setShowForm(true)
  }

  const handleDelete = async (id: number | string) => {
    if (confirm('Yakin ingin menghapus tipe kamar ini?')) {
      try { await deleteRoomType(id); refetch() } 
      catch (err) { console.error(err) }
    }
  }

  const handleCancel = () => {
    setFormData({ name: '', description: '', price: '', capacity: '', amenities: '', image_url: '' })
    setEditingId(null)
    setShowForm(false)
  }

  return (
    <div className="w-full flex justify-center">
      <div className="space-y-8 p-6 w-full max-w-6xl">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-4xl font-extrabold text-purple-800 tracking-wide">Manajemen Tipe Kamar</h2>
          <Button
            variant="default"
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:scale-105 transition-transform"
            onClick={() => setShowForm(!showForm)}
          >
            <FiPlus /> {showForm ? 'Batal' : 'Tambah Tipe Kamar'}
          </Button>
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
            className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 space-y-6 border border-purple-200 transition"
            onSubmit={handleSubmit}
          >
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Tipe Kamar *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Standar, Deluxe, Suite"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 shadow-sm transition"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                placeholder="Deskripsi lengkap tipe kamar..."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 shadow-sm transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Harga per Malam (Rp)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="500000"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 shadow-sm transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Kapasitas (orang)</label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                placeholder="2"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 shadow-sm transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Amenities (comma-separated)</label>
              <input
                type="text"
                value={formData.amenities}
                onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                placeholder="WiFi, AC, TV, minibar"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 shadow-sm transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">URL Gambar</label>
              <input
                type="text"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 shadow-sm transition"
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" variant="default" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg">
                {creatingRoomType || updatingRoomType ? 'Menyimpan...' : editingId ? 'Perbarui' : 'Simpan'}
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel}>Batal</Button>
            </div>
          </form>
        )}

        {/* Room Type Cards */}
        {loading ? (
          <div className="text-center py-12 text-purple-700 font-bold text-lg">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roomTypes.length === 0 ? (
              <div className="col-span-full text-center py-8 text-purple-400">Tidak ada tipe kamar</div>
            ) : (
              roomTypes.map(rt => (
                <div key={rt.id} className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition">

                  {/* IMAGE 16:9 */}
                  {rt.image_url && (
                    <div className="w-full aspect-video rounded-xl overflow-hidden mb-4">
                      <img 
                        src={rt.image_url} 
                        alt={rt.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="mb-3">
                    <h3 className="text-lg font-semibold">{rt.name}</h3>
                    {rt.description && <p className="text-sm text-purple-600 mt-1">{rt.description}</p>}
                  </div>

                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-purple-500">Harga:</span>
                    <span className="text-sm font-medium text-purple-700">
                      Rp {(rt.price || 0).toLocaleString('id-ID')} / malam
                    </span>
                  </div>

                  {rt.capacity && (
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-purple-500">Kapasitas:</span>
                      <span className="text-sm font-medium text-purple-700">{rt.capacity} orang</span>
                    </div>
                  )}

                  {rt.amenities && (
                    <div className="mb-4">
                      <p className="text-sm text-purple-500">Amenities:</p>
                      <p className="text-sm text-purple-700">{rt.amenities}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button size="sm" variant="default" className="flex items-center gap-1" onClick={() => handleEdit(rt)}>
                      <FiEdit /> Edit
                    </Button>
                    <Button size="sm" variant="destructive" className="flex items-center gap-1" onClick={() => handleDelete(rt.id)} disabled={deletingRoomType}>
                      <FiTrash2 /> Hapus
                    </Button>
                  </div>

                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
