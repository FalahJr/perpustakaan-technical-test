import { useQuery } from '@tanstack/react-query'

import { fetchBorrowings } from '@/features/borrowings/api/borrowings'

export function useBorrowingsQuery() {
  return useQuery({
    queryKey: ['borrowings'],
    queryFn: fetchBorrowings,
    staleTime: 30_000,
  })
}
