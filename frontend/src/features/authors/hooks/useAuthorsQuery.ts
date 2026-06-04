import { useQuery } from '@tanstack/react-query'

import { fetchAuthors } from '@/features/authors/api/authors'

export function useAuthorsQuery(search = '') {
  return useQuery({
    queryKey: ['authors', search],
    queryFn: () => fetchAuthors(search),
    staleTime: 30_000,
  })
}