import { useQuery } from '@tanstack/react-query'

import { fetchCategories } from '@/features/categories/api/categories'

export function useCategoriesQuery(search = '') {
  return useQuery({
    queryKey: ['categories', search],
    queryFn: () => fetchCategories(search),
    staleTime: 30_000,
  })
}
