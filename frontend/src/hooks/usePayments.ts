import { useState, useEffect, useCallback } from 'react'
import { paymentsAPI } from '../lib/api'
import { Payment } from '../types'

export type { Payment } from '../types'

export const usePayments = () => {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPayments = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await paymentsAPI.getAll()
      setPayments(res.data)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch payments')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPayments()
  }, [fetchPayments])

  return { payments, loading, error, refetch: fetchPayments }
}

export const usePaymentById = (id: number | string) => {
  const [payment, setPayment] = useState<Payment | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(null)
    paymentsAPI.getById(id.toString())
      .then((res: any) => setPayment(res.data))
      .catch((err: any) => setError(err.message || 'Failed to fetch payment'))
      .finally(() => setLoading(false))
  }, [id])

  return { payment, loading, error }
}

export const useCreatePayment = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const create = async (data: any) => {
    setLoading(true)
    setError(null)
    try {
      const res = await paymentsAPI.create(data)
      return res.data
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to create payment'
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }

  return { create, loading, error }
}

export const useUpdatePayment = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update = async (id: number | string, data: any) => {
    setLoading(true)
    setError(null)
    try {
      const res = await paymentsAPI.update(id.toString(), data)
      return res.data
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to update payment'
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }

  return { update, loading, error }
}

export const useDeletePayment = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const delete_ = async (id: number | string) => {
    setLoading(true)
    setError(null)
    try {
      await paymentsAPI.delete(id.toString())
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to delete payment'
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }

  return { delete: delete_, loading, error }
}
