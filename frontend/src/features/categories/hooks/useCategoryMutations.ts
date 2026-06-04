import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  createCategory,
  deleteCategory,
  updateCategory,
} from '@/features/categories/api/categories'
import type { CategoryFormValues } from '@/features/categories/types'

export function useCategoryMutations() {
  const queryClient = useQueryClient()

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['categories'] })
    queryClient.invalidateQueries({ queryKey: ['dashboard', 'categories'] })
  }

  const createMutation = useMutation({
    mutationFn: (payload: CategoryFormValues) => createCategory(payload),
    onSuccess: invalidate,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CategoryFormValues }) =>
      updateCategory(id, payload),
    onSuccess: invalidate,
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: invalidate,
  })

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  }
}
