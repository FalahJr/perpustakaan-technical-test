import { useQuery } from '@tanstack/react-query'

import { fetchFines } from '@/features/fines/api/fines'

export function useFinesQuery() {
  return useQuery({
    queryKey: ['fines'],
    queryFn: fetchFines,
    staleTime: 30_000,
  })
}
