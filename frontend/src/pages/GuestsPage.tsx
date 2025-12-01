import React, { useState } from 'react'
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi'
import { useGuests, useCreateGuest, useUpdateGuest, useDeleteGuest } from '../hooks/useGuests'
import Button from '../components/ui/Button'

export default function GuestsPage() {
  const { guests, loading, error, refetch } = useGuests()
  const { create: createGuest, loading: creatingGuest } = useCreateGuest()
  const { update: updateGuest, loading: updatingGuest } = useUpdateGuest()
  const { delete: deleteGuest, loading: deletingGuest } = useDeleteGuest()

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [search, setSearch] = useState("") // 🔍 Search state

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    address: '',
    id_type: '',
    id_number: '',
    nationality: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const data = {
        full_name: formData.full_name,
        phone: formData.phone || null,
        email: formData.email || null,
        address: formData.address || null,
        id_type: formData.id_type || null,
        id_number: formData.id_number || null,
        nationality: formData.nationality || null
      }

      if (editingId) await updateGuest(editingId, data)
      else await createGuest(data)

      setFormData({ full_name: '', phone: '', email: '', address: '', id_type: '', id_number: '', nationality: '' })
      setEditingId(null)
      setShowForm(false)
      refetch()
    } catch (err) { console.error(err) }
  }

  const handleEdit = (guest: any) => {
    setFormData({
      full_name: guest.full_name,
      phone: guest.phone || '',
      email: guest.email || '',
      address: guest.address || '',
      id_type: guest.id_type || '',
      id_number: guest.id_number || '',
      nationality: guest.nationality || ''
    })
    setEditingId(guest.id)
    setShowForm(true)
  }

  const handleDelete = async (id: number | string) => {
    if (confirm('Yakin ingin menghapus tamu ini?')) {
      try { await deleteGuest(id); refetch() } 
      catch (err) { console.error(err) }
    }
  }

  const handleCancel = () => {
    setFormData({ full_name: '', phone: '', email: '', address: '', id_type: '', id_number: '', nationality: '' })
    setEditingId(null)
    setShowForm(false)
  }

  // 🔍 FILTERING TAMU BERDASARKAN SEARCH
  const filteredGuests = guests.filter((guest) => {
    const q = search.toLowerCase()
    return (
      guest.full_name.toLowerCase().includes(q) ||
      guest.phone?.toLowerCase().includes(q) ||
      guest.email?.toLowerCase().includes(q) ||
      guest.address?.toLowerCase().includes(q) ||
      guest.id_type?.toLowerCase().includes(q) ||
      guest.nationality?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-4xl font-extrabold text-purple-800 tracking-wide">Manajemen Tamu</h2>
        <Button
          variant="default"
          className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:scale-105 transition-transform"
          onClick={() => setShowForm(!showForm)}
        >
          <FiPlus /> {showForm ? 'Batal' : 'Tambah Tamu'}
        </Button>
      </div>

      {/* 🔍 Search Input */}
      <div className="max-w-sm">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari tamu (nama, telepon, email, kebangsaan...)"
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
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap *</label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 shadow-sm transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Telepon</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 shadow-sm transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 shadow-sm transition"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Alamat</label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={2}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 shadow-sm transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tipe ID</label>
              <select
                value={formData.id_type}
                onChange={(e) => setFormData({ ...formData, id_type: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 shadow-sm transition"
              >
                <option value="">Pilih Tipe</option>
                <option value="passport">Paspor</option>
                <option value="ktp">KTP</option>
                <option value="sim">SIM</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">No. ID</label>
              <input
                type="text"
                value={formData.id_number}
                onChange={(e) => setFormData({ ...formData, id_number: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 shadow-sm transition"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Kebangsaan</label>
              <input
                type="text"
                value={formData.nationality}
                onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                placeholder="Indonesia, Thailand, dll"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 shadow-sm transition"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" variant="default" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg">
              {creatingGuest || updatingGuest ? 'Menyimpan...' : editingId ? 'Perbarui' : 'Simpan'}
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
                {['Nama','Telepon','Email','Alamat','Tipe ID','Kebangsaan','Aksi'].map(header => (
                  <th key={header} className="px-6 py-3 text-purple-800 font-semibold">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-purple-400">Tidak ada tamu ditemukan</td>
                </tr>
              ) : (
                filteredGuests.map((guest) => (
                  <tr key={guest.id} className="border-b hover:bg-purple-50 hover:shadow-md transition-all">
                    <td className="px-6 py-3 font-medium">{guest.full_name}</td>
                    <td className="px-6 py-3">{guest.phone || '-'}</td>
                    <td className="px-6 py-3">{guest.email || '-'}</td>
                    <td className="px-6 py-3 text-sm">{guest.address || '-'}</td>
                    <td className="px-6 py-3 text-sm">
                      {guest.id_type ? (guest.id_type === 'passport' ? 'Paspor' : guest.id_type === 'ktp' ? 'KTP' : 'SIM') : '-'}
                    </td>
                    <td className="px-6 py-3 text-sm">{guest.nationality || '-'}</td>
                    <td className="px-6 py-3 flex gap-2">
                      <Button size="sm" variant="ghost" className="flex items-center gap-1 hover:text-purple-700" onClick={() => handleEdit(guest)}>
                        <FiEdit /> Edit
                      </Button>
                      <Button size="sm" variant="destructive" className="flex items-center gap-1" onClick={() => handleDelete(guest.id)} disabled={deletingGuest}>
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
