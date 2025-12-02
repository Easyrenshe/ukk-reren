import React, { useState } from 'react'
import { FiEdit, FiTrash2, FiPlus, FiEye } from 'react-icons/fi'
import { usePayments, useCreatePayment, useUpdatePayment, useDeletePayment } from '../hooks/usePayments'
import { useBookings } from '../hooks/useBookings'
import Button from '../components/ui/Button'
import PaymentReceiptModal from '../components/PaymentReceiptModal'

export default function PaymentsPage() {
  const { payments, loading, error, refetch } = usePayments()
  const { bookings } = useBookings()
  const { create: createPayment, loading: creatingPayment } = useCreatePayment()
  const { update: updatePayment, loading: updatingPayment } = useUpdatePayment()
  const { delete: deletePayment, loading: deletingPayment } = useDeletePayment()

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [selectedPayment, setSelectedPayment] = useState<any | null>(null)
  const [showReceiptModal, setShowReceiptModal] = useState(false)
  const [formData, setFormData] = useState({
    booking_id: '',
    amount: '',
    payment_method: 'cash',
    status: 'completed',
    transaction_id: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const data = {
        booking_id: formData.booking_id,
        amount: parseFloat(formData.amount),
        payment_method: formData.payment_method || null,
        status: formData.status || 'completed',
        transaction_id: formData.transaction_id || null
      }

      if (editingId) await updatePayment(editingId, data)
      else await createPayment(data)

      setFormData({ booking_id: '', amount: '', payment_method: 'cash', status: 'completed', transaction_id: '' })
      setEditingId(null)
      setShowForm(false)
      refetch()
    } catch (err) { console.error(err) }
  }

  const handleEdit = (payment: any) => {
    setFormData({
      booking_id: payment.booking_id.toString(),
      amount: payment.amount?.toString() || '',
      payment_method: payment.payment_method || 'cash',
      status: payment.status || 'completed',
      transaction_id: payment.transaction_id || ''
    })
    setEditingId(payment.id)
    setShowForm(true)
  }

  const handleDelete = async (id: number | string) => {
    if (confirm('Yakin ingin menghapus pembayaran ini?')) {
      try { await deletePayment(id); refetch() } 
      catch (err) { console.error(err) }
    }
  }

  const handleCancel = () => {
    setFormData({ booking_id: '', amount: '', payment_method: 'cash', status: 'completed', transaction_id: '' })
    setEditingId(null)
    setShowForm(false)
  }

  const handleView = (payment: any) => {
    setSelectedPayment(payment)
    setShowReceiptModal(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'refunded': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-4xl font-extrabold text-purple-800 tracking-wide">Manajemen Pembayaran</h2>
        <Button
          variant="default"
          className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:scale-105 transition-transform"
          onClick={() => setShowForm(!showForm)}
        >
          <FiPlus /> {showForm ? 'Batal' : 'Pembayaran Baru'}
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-300 rounded-xl p-4 text-red-700 shadow-md">
          {error}
        </div>
      )}

      {/* FORM */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 space-y-6 border border-purple-200 transition"
        >
          <div className="grid grid-cols-2 gap-6">
            
            {/* Booking */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">Pemesanan *</label>
              <select
                value={formData.booking_id}
                onChange={(e) => setFormData({ ...formData, booking_id: e.target.value })}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 shadow-sm"
              >
                <option value="">Pilih Pemesanan</option>
                {bookings.map(booking => (
                  <option key={booking.booking_id} value={booking.booking_id}>
                    {booking.guest_name} - Kamar {booking.room_number}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">Jumlah *</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 shadow-sm"
              />
            </div>

            {/* Payment Method */}
            <div className="col-span-2 flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">Metode Pembayaran</label>
              <select
                value={formData.payment_method}
                onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 shadow-sm"
              >
                <option value="">Pilih Metode</option>
                <option value="cash">Tunai</option>
                <option value="credit_card">Kartu Kredit</option>
                <option value="transfer">Transfer Bank</option>
                <option value="e_wallet">E-Wallet</option>
              </select>
            </div>

            {/* Status */}
            <div className="col-span-2 flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">Status Pembayaran</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 shadow-sm"
              >
                <option value="pending">Pending</option>
                <option value="completed">Selesai</option>
                <option value="failed">Gagal</option>
                <option value="refunded">Refund</option>
              </select>
            </div>

            {/* Transaction ID */}
            <div className="col-span-2 flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">ID Transaksi</label>
              <input
                type="text"
                value={formData.transaction_id}
                onChange={(e) => setFormData({ ...formData, transaction_id: e.target.value })}
                placeholder="Optional"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 shadow-sm"
              />
            </div>

          </div>

          {/* BUTTONS */}
          <div className="flex gap-4 pt-2">
            <Button type="submit" variant="default" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg">
              {creatingPayment || updatingPayment ? 'Menyimpan...' : editingId ? 'Perbarui' : 'Simpan'}
            </Button>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Batal
            </Button>
          </div>
        </form>
      )}

      {/* TABLE */}
      {loading ? (
        <div className="text-center py-12 text-purple-700 font-bold text-lg">Loading...</div>
      ) : (
        <div className="overflow-x-auto rounded-2xl shadow-xl border border-purple-200">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-300">
              <tr>
                {['Pemesanan','Jumlah','Metode','Tanggal','Status','ID Transaksi','Aksi'].map(header => (
                  <th key={header} className="px-6 py-3 text-purple-800 font-semibold">{header}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-purple-400">Tidak ada pembayaran</td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment.id} className="border-b hover:bg-purple-50 hover:shadow-md transition-all">
                    <td className="px-6 py-3 font-medium">#{payment.booking_id} - {payment.guest_name || '-'}</td>
                    <td className="px-6 py-3">Rp {payment.amount?.toLocaleString('id-ID') || '-'}</td>
                    <td className="px-6 py-3">{payment.payment_method || '-'}</td>
                    <td className="px-6 py-3">{new Date(payment.payment_date).toLocaleDateString('id-ID')}</td>

                    <td className="px-6 py-3">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${getStatusColor(payment.status || 'completed')}`}>
                        {payment.status === 'pending' ? 'Pending' :
                         payment.status === 'completed' ? 'Selesai' :
                         payment.status === 'failed' ? 'Gagal' :
                         payment.status === 'refunded' ? 'Refund' : 'Selesai'}
                      </span>
                    </td>

                    <td className="px-6 py-3 text-sm">{payment.transaction_id || '-'}</td>

                    <td className="px-6 py-3 flex gap-2">
                      <Button size="sm" variant="ghost" className="flex items-center gap-1 hover:text-blue-600" onClick={() => handleView(payment)}>
                        <FiEye /> Lihat
                      </Button>
                      <Button size="sm" variant="ghost" className="flex items-center gap-1 hover:text-purple-700" onClick={() => handleEdit(payment)}>
                        <FiEdit /> Edit
                      </Button>
                      <Button
  size="sm"
  className="flex items-center gap-1 bg-yellow-400 hover:bg-yellow-500 text-black"
  onClick={() => handleDelete(payment.id)}
  disabled={deletingPayment}
>
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

      {/* Payment Receipt Modal */}
      <PaymentReceiptModal
        payment={selectedPayment}
        isOpen={showReceiptModal}
        onClose={() => {
          setShowReceiptModal(false)
          setSelectedPayment(null)
        }}
      />
    </div>
  )
}
