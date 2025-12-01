import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

console.log('🔧 API Configuration:', { VITE_API_URL: import.meta.env.VITE_API_URL, API_URL })

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add response interceptor for better error handling
api.interceptors.response.use(
  response => response,
  error => {
    console.error('❌ API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url
    })
    return Promise.reject(error)
  }
)

// Bookings API
export const bookingsAPI = {
  getAll: () => api.get('/bookings'),
  getById: (id: string | number) => api.get(`/bookings/${id}`),
  create: (data: { guest_id: string; room_id: string; check_in: string; check_out: string; total_price?: number | null; status?: string; notes?: string | null }) =>
    api.post('/bookings', data),
  update: (id: string | number, data: { guest_id?: string; room_id?: string; check_in?: string; check_out?: string; total_price?: number | null; status?: string; notes?: string | null }) =>
    api.put(`/bookings/${id}`, data),
  delete: (id: string | number) => api.delete(`/bookings/${id}`)
}

// Rooms API
export const roomsAPI = {
  getAll: () => api.get('/rooms'),
  getById: (id: string) => api.get(`/rooms/${id}`),
  create: (data: { room_number: string; type_id?: string | null; status?: string; floor?: number }) =>
    api.post('/rooms', data),
  update: (id: string, data: { room_number?: string; type_id?: string | null; status?: string; floor?: number }) =>
    api.put(`/rooms/${id}`, data),
  delete: (id: string) => api.delete(`/rooms/${id}`)
}

// Guests API
export const guestsAPI = {
  getAll: () => api.get('/guests'),
  getById: (id: string | number) => api.get(`/guests/${id}`),
  create: (data: { full_name: string; phone?: string | null; email?: string | null; address?: string | null; id_type?: string | null; id_number?: string | null; nationality?: string | null }) =>
    api.post('/guests', data),
  update: (id: string | number, data: { full_name?: string; phone?: string | null; email?: string | null; address?: string | null; id_type?: string | null; id_number?: string | null; nationality?: string | null }) =>
    api.put(`/guests/${id}`, data),
  delete: (id: string | number) => api.delete(`/guests/${id}`)
}

// Payments API
export const paymentsAPI = {
  getAll: () => api.get('/payments'),
  getById: (id: string | number) => api.get(`/payments/${id}`),
  create: (data: { booking_id: string; amount: number; payment_method?: string | null; status?: string; transaction_id?: string | null }) =>
    api.post('/payments', data),
  update: (id: string | number, data: { amount?: number; payment_method?: string | null; status?: string; transaction_id?: string | null }) =>
    api.put(`/payments/${id}`, data),
  delete: (id: string | number) => api.delete(`/payments/${id}`)
}

// Room Types API
export const roomTypesAPI = {
  getAll: () => api.get('/room-types'),
  getById: (id: string | number) => api.get(`/room-types/${id}`),
  create: (data: { name: string; description?: string | null; price: number; capacity?: number | null; amenities?: string | null; image_url?: string | null }) =>
    api.post('/room-types', data),
  update: (id: string | number, data: { name?: string; description?: string | null; price?: number; capacity?: number | null; amenities?: string | null; image_url?: string | null }) =>
    api.put(`/room-types/${id}`, data),
  delete: (id: string | number) => api.delete(`/room-types/${id}`)
}
