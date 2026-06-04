import { apiClient } from '@/api/axios'
import type { BorrowingFormValues, BorrowingItem } from '@/features/borrowings/types'

type ApiListResponse<T> = {
  error?: boolean
  msg?: string
  data: T
}

type ApiMutationResponse = {
  error?: boolean
  msg?: string
  data?: BorrowingItem
}

function normalizeDate(value: string) {
  return new Date(value).toISOString()
}

export async function fetchBorrowings() {
  const response = await apiClient.get<ApiListResponse<BorrowingItem[]>>('/admin/peminjaman')
  return response.data.data
}

export async function fetchBorrowingById(id: string) {
  const response = await apiClient.get<ApiListResponse<BorrowingItem>>(`/admin/peminjaman/${id}`)
  return response.data.data
}

export async function createBorrowing(payload: BorrowingFormValues) {
  const response = await apiClient.post<ApiMutationResponse>('/admin/peminjaman/create', {
    ...payload,
    tgl_pinjam: normalizeDate(payload.tgl_pinjam),
    tgl_hrs_kembali: normalizeDate(payload.tgl_hrs_kembali),
  })

  return response.data.data ?? null
}

export async function updateBorrowing(id: string, payload: BorrowingFormValues) {
  const response = await apiClient.put<ApiMutationResponse>('/admin/peminjaman/update', {
    id_peminjaman: id,
    ...payload,
    tgl_pinjam: normalizeDate(payload.tgl_pinjam),
    tgl_hrs_kembali: normalizeDate(payload.tgl_hrs_kembali),
  })

  return response.data.data ?? null
}

export async function deleteBorrowing(id: string) {
  const response = await apiClient.delete<ApiMutationResponse>('/admin/peminjaman/delete', {
    data: {
      id_peminjaman: id,
    },
  })

  return response.data.msg ?? 'Deleted'
}
