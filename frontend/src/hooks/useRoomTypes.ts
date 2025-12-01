import { useState, useEffect, useCallback } from 'react'
import { roomTypesAPI } from '../lib/api'
import { RoomType } from '../types'

export type { RoomType } from '../types'

export const useRoomTypes = () => {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRoomTypes = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await roomTypesAPI.getAll()
      setRoomTypes(res.data)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch room types')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRoomTypes()
  }, [fetchRoomTypes])

  return { roomTypes, loading, error, refetch: fetchRoomTypes }
}

export const useRoomTypeById = (id: number | string) => {
  const [roomType, setRoomType] = useState<RoomType | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(null)
    roomTypesAPI.getById(id.toString())
      .then((res: any) => setRoomType(res.data))
      .catch((err: any) => setError(err.message || 'Failed to fetch room type'))
      .finally(() => setLoading(false))
  }, [id])

  return { roomType, loading, error }
}

export const useCreateRoomType = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const create = async (data: any) => {
    setLoading(true)
    setError(null)
    try {
      const res = await roomTypesAPI.create(data)
      return res.data
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to create room type'
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }

  return { create, loading, error }
}

export const useUpdateRoomType = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update = async (id: number | string, data: any) => {
    setLoading(true)
    setError(null)
    try {
      const res = await roomTypesAPI.update(id.toString(), data)
      return res.data
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to update room type'
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }

  return { update, loading, error }
}

export const useDeleteRoomType = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const delete_ = async (id: number | string) => {
    setLoading(true)
    setError(null)
    try {
      await roomTypesAPI.delete(id.toString())
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to delete room type'
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }

  return { delete: delete_, loading, error }
}
