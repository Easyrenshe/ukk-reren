export type RoomStatus = 'available' | 'booked' | 'maintenance' | 'occupied'

export interface Room {
  id: string
  room_number: string
  type_id: string | null
  type_name?: string
  type_price?: number
  type_image_url?: string | null
  floor?: number
  status: RoomStatus
  created_at?: string
  updated_at?: string
}
