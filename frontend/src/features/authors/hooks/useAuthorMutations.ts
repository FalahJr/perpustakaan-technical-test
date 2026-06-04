import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createAuthor, deleteAuthor, updateAuthor } from '@/features/authors/api/authors'
import type { AuthorFormValues } from '@/features/authors/types'

export function useAuthorMutations() {
  const queryClient = useQueryClient()

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['authors'] })
    queryClient.invalidateQueries({ queryKey: ['dashboard', 'authors'] })
  }

  const createMutation = useMutation({
    mutationFn: (payload: AuthorFormValues) => createAuthor(payload),
    onSuccess: invalidate,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AuthorFormValues }) => updateAuthor(id, payload),
    onSuccess: invalidate,
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAuthor(id),
    onSuccess: invalidate,
  })

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  }
}