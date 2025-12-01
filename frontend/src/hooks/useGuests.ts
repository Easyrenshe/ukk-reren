import { useState, useEffect, useCallback } from 'react'
import { guestsAPI } from '../lib/api'
import { Guest } from '../types'

export type { Guest } from '../types'

export const useGuests = () => {
  const [guests, setGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchGuests = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await guestsAPI.getAll()
      setGuests(res.data)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch guests')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchGuests()
  }, [fetchGuests])

  return { guests, loading, error, refetch: fetchGuests }
}

export const useGuestById = (id: number | string) => {
  const [guest, setGuest] = useState<Guest | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(null)
    guestsAPI.getById(id.toString())
      .then((res: any) => setGuest(res.data))
      .catch((err: any) => setError(err.message || 'Failed to fetch guest'))
      .finally(() => setLoading(false))
  }, [id])

  return { guest, loading, error }
}

export const useCreateGuest = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const create = async (data: any) => {
    setLoading(true)
    setError(null)
    try {
      const res = await guestsAPI.create(data)
      return res.data
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to create guest'
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }

  return { create, loading, error }
}

export const useUpdateGuest = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update = async (id: number | string, data: any) => {
    setLoading(true)
    setError(null)
    try {
      const res = await guestsAPI.update(id.toString(), data)
      return res.data
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to update guest'
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }

  return { update, loading, error }
}

export const useDeleteGuest = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const delete_ = async (id: number | string) => {
    setLoading(true)
    setError(null)
    try {
      await guestsAPI.delete(id.toString())
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to delete guest'
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }

  return { delete: delete_, loading, error }
}
