export interface User {
  id: string
  username: string
  email: string
  full_name: string | null
  role: string
}

export interface LoginResponse {
  message: string
  token: string
  user: User
}

export interface LoginRequest {
  email?: string
  username?: string
  password: string
}
