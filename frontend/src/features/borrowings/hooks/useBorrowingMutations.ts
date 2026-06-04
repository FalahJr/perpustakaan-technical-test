import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createBorrowing, deleteBorrowing, updateBorrowing } from '@/features/borrowings/api/borrowings'
import type { BorrowingFormValues } from '@/features/borrowings/types'

export function useBorrowingMutations() {
  const queryClient = useQueryClient()

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['borrowings'] })
    queryClient.invalidateQueries({ queryKey: ['dashboard', 'borrowings'] })
  }

  const createMutation = useMutation({
    mutationFn: (payload: BorrowingFormValues) => createBorrowing(payload),
    onSuccess: invalidate,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: BorrowingFormValues }) =>
      updateBorrowing(id, payload),
    onSuccess: invalidate,
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteBorrowing(id),
    onSuccess: invalidate,
  })

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  }
}
