import { useState, useCallback } from 'react'
import { api } from '../lib/api'
import type { User, LoginRequest, LoginResponse } from '../types/auth'

const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem(USER_KEY)
    return stored ? JSON.parse(stored) : null
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = useCallback(async (credentials: LoginRequest) => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.post<LoginResponse>('/auth/login', credentials)
      const { token, user: userData } = response.data

      // Store token and user in localStorage
      localStorage.setItem(TOKEN_KEY, token)
      localStorage.setItem(USER_KEY, JSON.stringify(userData))

      // Set default header for future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`

      setUser(userData)
      return response.data
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Login failed'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    setLoading(true)
    try {
      await api.post('/auth/logout')
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      // Clear storage and state regardless of API call result
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
      delete api.defaults.headers.common['Authorization']
      setUser(null)
      setLoading(false)
    }
  }, [])

  const getToken = useCallback(() => {
    return localStorage.getItem(TOKEN_KEY)
  }, [])

  const isAuthenticated = useCallback(() => {
    return !!getToken() && !!user
  }, [user, getToken])

  // Initialize token in headers on mount
  const token = getToken()
  if (token && !api.defaults.headers.common['Authorization']) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  return {
    user,
    loading,
    error,
    login,
    logout,
    getToken,
    isAuthenticated: isAuthenticated()
  }
}
