import { apiClient } from '@/api/axios'
import type { AuthorFormValues, AuthorItem } from '@/features/authors/types'

type ApiListResponse = {
  error?: boolean
  msg?: string
  data: AuthorItem[]
}

type ApiSingleResponse = {
  status?: string
  msg?: string
  data: AuthorItem
}

type ApiMutationResponse = {
  msg?: string
  data?: AuthorItem
}

export async function fetchAuthors(query = '') {
  const response = await apiClient.get<ApiListResponse>('/admin/buku/author', {
    params: query ? { q: query } : undefined,
  })

  return response.data.data
}

export async function fetchAuthorById(id: string) {
  const response = await apiClient.get<ApiSingleResponse>(`/admin/buku/author/${id}`)

  return response.data.data
}

export async function createAuthor(payload: AuthorFormValues) {
  const response = await apiClient.post<ApiMutationResponse>('/admin/buku/author/create', payload)

  return response.data.data ?? null
}

export async function updateAuthor(id: string, payload: AuthorFormValues) {
  const response = await apiClient.put<ApiMutationResponse>('/admin/buku/author/update', {
    id,
    ...payload,
  })

  return response.data.data ?? null
}

export async function deleteAuthor(id: string) {
  const response = await apiClient.delete<ApiMutationResponse>('/admin/buku/author/delete', {
    data: { id },
  })

  return response.data.msg ?? 'Deleted'
}