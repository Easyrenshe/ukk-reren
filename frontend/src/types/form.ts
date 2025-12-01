export interface FormState<T> {
  data: T
  showForm: boolean
  editingId: string | number | null
}

export interface LoadingState {
  create: boolean
  update: boolean
  delete: boolean
  fetch: boolean
}
