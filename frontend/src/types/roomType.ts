export interface RoomType {
  id: string | number
  name: string
  description?: string | null
  price: number
  capacity?: number | null
  amenities?: string | null  // JSON format
  image_url?: string | null
  created_at?: string
  updated_at?: string
}

export interface RoomTypeCreateInput {
  name: string
  description?: string | null
  price: number
  capacity?: number | null
  amenities?: string | null
  image_url?: string | null
}
