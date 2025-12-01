export type BookingStatus = 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled'

export interface Booking {
  booking_id: string
  guest_id: string
  guest_name: string
  room_id: string
  room_number: string
  room_type: string
  room_type_id: string
  check_in: string
  check_out: string
  total_price: number | null
  status: string
  notes?: string | null
  created_at?: string
  updated_at?: string
}

export interface BookingCreateInput {
  guest_id: string
  room_id: string
  check_in: string
  check_out: string
  total_price?: number | null
  status?: BookingStatus
  notes?: string | null
}
