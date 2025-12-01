export interface Guest {
  id: string | number
  full_name: string
  phone?: string | null
  email?: string | null
  address?: string | null
  id_type?: string | null  // passport, ktp, sim
  id_number?: string | null
  nationality?: string | null
  created_at?: string
  updated_at?: string
}

export interface GuestCreateInput {
  full_name: string
  phone?: string | null
  email?: string | null
  address?: string | null
  id_type?: string | null
  id_number?: string | null
  nationality?: string | null
}
