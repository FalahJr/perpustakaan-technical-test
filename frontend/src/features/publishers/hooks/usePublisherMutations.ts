import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createPublisher, deletePublisher, updatePublisher } from '@/features/publishers/api/publishers'
import type { PublisherFormValues } from '@/features/publishers/types'

export function usePublisherMutations() {
  const queryClient = useQueryClient()

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['publishers'] })
    queryClient.invalidateQueries({ queryKey: ['dashboard', 'publishers'] })
  }

  const createMutation = useMutation({
    mutationFn: (payload: PublisherFormValues) => createPublisher(payload),
    onSuccess: invalidate,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: PublisherFormValues }) =>
      updatePublisher(id, payload),
    onSuccess: invalidate,
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePublisher(id),
    onSuccess: invalidate,
  })

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  }
}