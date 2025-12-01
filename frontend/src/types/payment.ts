export type PaymentMethod = 'cash' | 'credit_card' | 'transfer' | 'e_wallet'
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'

export interface Payment {
  id: string | number
  booking_id: string | number
  amount: number | null
  payment_method?: PaymentMethod | null
  payment_date: string
  status?: PaymentStatus
  transaction_id?: string | null
  check_in?: string
  check_out?: string
  total_price?: number
  booking_status?: string
  guest_name?: string
  guest_id?: string
  room_number?: string
  room_id?: string
  created_at?: string
  updated_at?: string
}

export interface PaymentCreateInput {
  booking_id: string
  amount: number
  payment_method?: PaymentMethod | null
  status?: PaymentStatus
  transaction_id?: string | null
}
