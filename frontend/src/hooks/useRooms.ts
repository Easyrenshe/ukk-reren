// src/hooks/useRooms.ts
import { useState, useEffect, useCallback } from 'react'
import { roomsAPI } from '../lib/api'
import { Room, RoomStatus } from '../types'

export type { Room, RoomStatus } from '../types'

const validStatus: RoomStatus[] = ['available', 'booked', 'maintenance', 'occupied']

const getErrorMessage = (err: any, fallback = 'Terjadi kesalahan') =>
  err.response?.data?.message || err.message || fallback

// GET ROOMS
export const useRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRooms = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await roomsAPI.getAll()
      setRooms(res.data)
    } catch (err: any) {
      setError(getErrorMessage(err, 'Gagal mengambil data kamar'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchRooms() }, [fetchRooms])

  return { rooms, loading, error, refetch: fetchRooms }
}

// CREATE ROOM
export const useCreateRoom = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const create = async (data: Partial<Room>) => {
    setLoading(true)
    setError(null)

    if (data.status && !validStatus.includes(data.status)) {
      const msg = `Status harus salah satu dari: ${validStatus.join(', ')}`
      setError(msg)
      throw new Error(msg)
    }

    try {
      const res = await roomsAPI.create({
        room_number: data.room_number!,
        type_id: data.type_id ?? null,
        status: data.status!,
        floor: data.floor || undefined
      })
      return res.data
    } catch (err: any) {
      const msg = getErrorMessage(err, 'Gagal membuat kamar')
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }

  return { create, loading, error }
}

// UPDATE ROOM
export const useUpdateRoom = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update = async (id: string | number, data: Partial<Room>) => {
    setLoading(true)
    setError(null)

    if (data.status && !validStatus.includes(data.status)) {
      const msg = `Status harus salah satu dari: ${validStatus.join(', ')}`
      setError(msg)
      throw new Error(msg)
    }

    try {
      const res = await roomsAPI.update(id as string, {
        room_number: data.room_number,
        type_id: data.type_id ?? null,
        status: data.status,
        floor: data.floor || undefined
      })
      return res.data
    } catch (err: any) {
      const msg = getErrorMessage(err, 'Gagal memperbarui kamar')
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }

  return { update, loading, error }
}

// DELETE ROOM
export const useDeleteRoom = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const delete_ = async (id: string | number) => {
    setLoading(true)
    setError(null)
    try {
      await roomsAPI.delete(id as string)
    } catch (err: any) {
      const msg = getErrorMessage(err, 'Gagal menghapus kamar')
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }

  return { delete: delete_, loading, error }
}
