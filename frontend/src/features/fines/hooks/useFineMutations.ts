import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createFine, deleteFine, updateFine } from '@/features/fines/api/fines'
import type { FineFormValues } from '@/features/fines/types'

export function useFineMutations() {
  const queryClient = useQueryClient()

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['fines'] })
    queryClient.invalidateQueries({ queryKey: ['dashboard', 'fines'] })
  }

  const createMutation = useMutation({
    mutationFn: (payload: FineFormValues) => createFine(payload),
    onSuccess: invalidate,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: FineFormValues }) => updateFine(id, payload),
    onSuccess: invalidate,
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteFine(id),
    onSuccess: invalidate,
  })

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  }
}
