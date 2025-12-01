import { useState, useEffect } from 'react'
import { bookingsAPI } from '../lib/api'
import { Booking } from '../types'

export type { Booking } from '../types'

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBookings = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await bookingsAPI.getAll()
      setBookings(res.data)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch bookings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  return { bookings, loading, error, refetch: fetchBookings }
}

export const useBookingById = (id: number | string) => {
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(null)
    bookingsAPI.getById(id.toString())
      .then((res: any) => setBooking(res.data))
      .catch((err: any) => setError(err.message || 'Failed to fetch booking'))
      .finally(() => setLoading(false))
  }, [id])

  return { booking, loading, error }
}

export const useCreateBooking = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const create = async (data: any) => {
    setLoading(true)
    setError(null)
    try {
      const res = await bookingsAPI.create(data)
      return res.data
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to create booking'
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }

  return { create, loading, error }
}

export const useUpdateBooking = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update = async (id: number | string, data: any) => {
    setLoading(true)
    setError(null)
    try {
      const res = await bookingsAPI.update(id.toString(), data)
      return res.data
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to update booking'
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }

  return { update, loading, error }
}

export const useDeleteBooking = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const delete_ = async (id: number | string) => {
    setLoading(true)
    setError(null)
    try {
      await bookingsAPI.delete(id.toString())
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to delete booking'
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }

  return { delete: delete_, loading, error }
}
