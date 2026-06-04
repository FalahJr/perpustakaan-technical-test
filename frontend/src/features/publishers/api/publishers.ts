import { apiClient } from '@/api/axios'
import type { PublisherFormValues, PublisherItem } from '@/features/publishers/types'

type ApiListResponse = {
  error?: boolean
  msg?: string
  data: PublisherItem[]
}

type ApiSingleResponse = {
  status?: string
  msg?: string
  data: PublisherItem
}

type ApiMutationResponse = {
  msg?: string
  data?: PublisherItem
}

export async function fetchPublishers(query = '') {
  const response = await apiClient.get<ApiListResponse>('/admin/buku/penbuk', {
    params: query ? { q: query } : undefined,
  })

  return response.data.data
}

export async function fetchPublisherById(id: string) {
  const response = await apiClient.get<ApiSingleResponse>(`/admin/buku/penbuk/${id}`)

  return response.data.data
}

export async function createPublisher(payload: PublisherFormValues) {
  const response = await apiClient.post<ApiMutationResponse>('/admin/buku/penbuk/create', payload)

  return response.data.data ?? null
}

export async function updatePublisher(id: string, payload: PublisherFormValues) {
  const response = await apiClient.put<ApiMutationResponse>('/admin/buku/penbuk/update', {
    id,
    ...payload,
  })

  return response.data.data ?? null
}

export async function deletePublisher(id: string) {
  const response = await apiClient.delete<ApiMutationResponse>('/admin/buku/penbuk/delete', {
    data: { id },
  })

  return response.data.msg ?? 'Deleted'
}