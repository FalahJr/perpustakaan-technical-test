import { apiClient } from '@/api/axios'
import type { FineFormValues, FineItem } from '@/features/fines/types'

type ApiListResponse<T> = {
  error?: boolean
  msg?: string
  data: T
}

type ApiMutationResponse = {
  error?: boolean
  msg?: string
  data?: FineItem
}

function normalizeDate(value: string) {
  return new Date(value).toISOString()
}

export async function fetchFines() {
  const response = await apiClient.get<ApiListResponse<FineItem[]>>('/admin/denda')
  return response.data.data
}

export async function createFine(payload: FineFormValues) {
  const response = await apiClient.post<ApiMutationResponse>('/admin/denda/create', {
    ...payload,
    jumlah_denda: Number(payload.jumlah_denda),
    tgl_pinjam: normalizeDate(payload.tgl_pinjam),
    tgl_hrs_kembali: normalizeDate(payload.tgl_hrs_kembali),
    tgl_kembali: normalizeDate(payload.tgl_kembali),
  })
  return response.data.data ?? null
}

export async function updateFine(id: string, payload: FineFormValues) {
  const response = await apiClient.put<ApiMutationResponse>('/admin/denda/update', {
    id_denda: id,
    ...payload,
    jumlah_denda: Number(payload.jumlah_denda),
    tgl_pinjam: normalizeDate(payload.tgl_pinjam),
    tgl_hrs_kembali: normalizeDate(payload.tgl_hrs_kembali),
    tgl_kembali: normalizeDate(payload.tgl_kembali),
  })
  return response.data.data ?? null
}

export async function deleteFine(id: string) {
  const response = await apiClient.delete<ApiMutationResponse>('/admin/denda/delete', {
    data: {
      id_denda: id,
    },
  })
  return response.data.msg ?? 'Deleted'
}
