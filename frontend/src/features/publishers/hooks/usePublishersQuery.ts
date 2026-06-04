import { useQuery } from '@tanstack/react-query'

import { fetchPublishers } from '@/features/publishers/api/publishers'

export function usePublishersQuery(search = '') {
  return useQuery({
    queryKey: ['publishers', search],
    queryFn: () => fetchPublishers(search),
    staleTime: 30_000,
  })
}