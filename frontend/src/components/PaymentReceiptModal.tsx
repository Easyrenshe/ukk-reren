import React, { useRef } from 'react'
import { FiX, FiDownload } from 'react-icons/fi'
import Button from './ui/Button'
import { Payment } from '../types'

interface PaymentReceiptModalProps {
  payment: Payment | null
  booking?: any
  isOpen: boolean
  onClose: () => void
}

export default function PaymentReceiptModal({
  payment,
  booking,
  isOpen,
  onClose
}: PaymentReceiptModalProps) {
  const receiptRef = useRef<HTMLDivElement>(null)

  if (!isOpen || !payment) return null

  const handleDownloadAsImage = async () => {
    try {
      // Dynamically import html2canvas
      const html2canvas = (await import('html2canvas')).default

      if (!receiptRef.current) return

      const canvas = await html2canvas(receiptRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false
      })

      const link = document.createElement('a')
      link.href = canvas.toDataURL('image/png')
      link.download = `receipt-${payment.id}-${new Date().getTime()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error('Error downloading receipt:', err)
      alert('Gagal mendownload receipt')
    }
  }

  const getPaymentMethodLabel = (method: string | null | undefined) => {
    const methods: { [key: string]: string } = {
      'cash': 'Tunai',
      'credit_card': 'Kartu Kredit',
      'transfer': 'Transfer Bank',
      'e_wallet': 'E-Wallet'
    }
    return methods[method || ''] || '-'
  }

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'pending': '#fbbf24',
      'completed': '#10b981',
      'failed': '#ef4444',
      'refunded': '#3b82f6'
    }
    return colors[status] || '#6b7280'
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-6 flex justify-between items-center rounded-t-2xl shadow-md">
          <h3 className="text-2xl font-bold">Resi Pembayaran</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-all"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Receipt Content */}
        <div className="p-8">
          <div
            ref={receiptRef}
            className="bg-white border border-gray-300 rounded-lg p-0 space-y-0"
            style={{ fontFamily: 'Arial, sans-serif' }}
          >
            {/* Invoice Header - Professional */}
            <div className="bg-gradient-to-r from-purple-700 to-pink-600 text-white px-12 py-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-4xl font-bold">INVOICE</h1>
                  <p className="text-purple-100 mt-1">Bukti Pembayaran Resmi</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">🏨</p>
                  <p className="text-sm font-semibold mt-2">Hotel Management System</p>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="px-12 py-8 space-y-8">
              {/* Invoice Number & Date Row */}
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">Invoice Number</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">INV-{String(payment.id).padStart(6, '0')}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">Tanggal Pembayaran</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {new Date(payment.payment_date).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-300"></div>

              {/* Guest & Booking Info */}
              <div className="grid grid-cols-2 gap-8">
                {/* Bill To */}
                <div>
                  <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide mb-4">Bill To</p>
                  <div className="space-y-1">
                    <p className="text-lg font-bold text-gray-900">{payment.guest_name || 'Tamu'}</p>
                    <p className="text-sm text-gray-600">Nomor Pemesanan: <span className="font-semibold">#{payment.booking_id || '-'}</span></p>
                    <p className="text-sm text-gray-600">Kamar: <span className="font-semibold">{payment.room_number || '-'}</span></p>
                  </div>
                </div>

                {/* Stay Details */}
                <div>
                  <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide mb-4">Durasi Menginap</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Check-in:</span>
                      <span className="font-semibold text-gray-900">
                        {payment.check_in
                          ? new Date(payment.check_in).toLocaleDateString('id-ID')
                          : '-'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Check-out:</span>
                      <span className="font-semibold text-gray-900">
                        {payment.check_out
                          ? new Date(payment.check_out).toLocaleDateString('id-ID')
                          : '-'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-300"></div>

              {/* Payment Details Table */}
              <div>
                <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide mb-4">Detail Pembayaran</p>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-300 bg-gray-50">
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Deskripsi</th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-900">Jumlah</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="px-4 py-4 text-gray-700">
                        <div>
                          <p className="font-semibold">Biaya Menginap</p>
                          <p className="text-xs text-gray-500 mt-1">Kamar #{payment.room_number || '-'}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right font-bold text-gray-900">
                        Rp {(payment.amount || 0).toLocaleString('id-ID')}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-300"></div>

              {/* Summary */}
              <div className="flex justify-end">
                <div className="w-full max-w-xs">
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600 font-semibold">Subtotal:</span>
                    <span className="text-gray-900 font-semibold">Rp {(payment.amount || 0).toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600 font-semibold">Pajak:</span>
                    <span className="text-gray-900 font-semibold">Rp 0</span>
                  </div>
                  <div className="flex justify-between py-4 bg-gradient-to-r from-purple-100 to-pink-100 px-4 rounded-lg">
                    <span className="text-gray-900 font-bold text-lg">Total:</span>
                    <span className="text-purple-700 font-bold text-lg">Rp {(payment.amount || 0).toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>

              {/* Payment Method & Status */}
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide mb-3">Metode Pembayaran</p>
                  <p className="text-lg font-bold text-gray-900">
                    {getPaymentMethodLabel(payment.payment_method)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide mb-3">Status</p>
                  <span
                    className="inline-block px-6 py-2 rounded-lg font-bold text-white text-lg"
                    style={{ backgroundColor: getStatusColor(payment.status || 'completed') }}
                  >
                    {payment.status === 'completed' ? '✓ Terbayar' :
                     payment.status === 'pending' ? '⏳ Pending' :
                     payment.status === 'failed' ? '✗ Gagal' :
                     payment.status === 'refunded' ? '↩ Refund' : '✓ Terbayar'}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-300"></div>

              {/* Footer */}
              <div className="text-center space-y-2 py-4">
                <p className="font-semibold text-gray-900">Terima kasih atas pembayaran Anda!</p>
                <p className="text-sm text-gray-600">Dokumen ini adalah bukti resmi pembayaran yang sah</p>
                <p className="text-xs text-gray-500 mt-4">
                  Diterbitkan: {new Date().toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-0 bg-gray-50 px-8 py-4 flex gap-4 justify-end border-t border-gray-200 rounded-b-2xl">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="px-6"
          >
            Tutup
          </Button>
          <Button
            type="button"
            variant="default"
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:scale-105 transition-transform px-6"
            onClick={handleDownloadAsImage}
          >
            <FiDownload />
            Download Resi
          </Button>
        </div>
      </div>
    </div>
  )
}
