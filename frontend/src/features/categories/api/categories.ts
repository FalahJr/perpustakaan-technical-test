import { apiClient } from '@/api/axios'
import type { CategoryFormValues, CategoryItem } from '@/features/categories/types'

type ApiListResponse = {
  error?: boolean
  msg?: string
  data: CategoryItem[]
}

type ApiSingleResponse = {
  status?: string
  msg?: string
  data: CategoryItem
}

type ApiMutationResponse = {
  msg?: string
  data?: CategoryItem
}

export async function fetchCategories(query = '') {
  const response = await apiClient.get<ApiListResponse>('/admin/buku/jenbuk', {
    params: query ? { q: query } : undefined,
  })

  return response.data.data
}

export async function fetchCategoryById(id: string) {
  const response = await apiClient.get<ApiSingleResponse>(`/admin/buku/jenbuk/${id}`)

  return response.data.data
}

export async function createCategory(payload: CategoryFormValues) {
  const response = await apiClient.post<ApiMutationResponse>('/admin/buku/jenbuk/create', payload)

  return response.data.data ?? null
}

export async function updateCategory(id: string, payload: CategoryFormValues) {
  const response = await apiClient.put<ApiMutationResponse>('/admin/buku/jenbuk/update', {
    id,
    ...payload,
  })

  return response.data.data ?? null
}

export async function deleteCategory(id: string) {
  const response = await apiClient.delete<ApiMutationResponse>('/admin/buku/jenbuk/delete', {
    data: { id },
  })

  return response.data.msg ?? 'Deleted'
}
