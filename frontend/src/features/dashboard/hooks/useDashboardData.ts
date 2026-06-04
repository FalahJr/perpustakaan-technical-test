import { useQueries } from '@tanstack/react-query'

import {
  fetchAuthors,
  fetchBorrowings,
  fetchCategories,
  fetchFines,
  fetchPublishers,
  type AuthorItem,
  type BorrowingItem,
  type CategoryItem,
  type FineItem,
  type PublisherItem,
} from '@/features/dashboard/api/dashboard'
import type { DashboardMetric, DashboardRecord } from '@/features/dashboard/types'

type QueryResult<T> = {
  data?: T
  isPending: boolean
  isError: boolean
  error: unknown
}

function toIso(value?: string) {
  return value && !Number.isNaN(Date.parse(value)) ? value : undefined
}

function formatDateTime(value?: string) {
  if (!value) {
    return 'Unknown date'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function makeRecords() {
  return {
    fromCategories(categories: CategoryItem[]): DashboardRecord[] {
      return categories.map((item) => ({
        id: `category-${item.id}`,
        type: 'Categories',
        title: item.jenis_buku,
        subtitle: item.deskripsi?.trim() || 'Kategori buku',
        createdAt: toIso(item.updated_at),
      }))
    },
    fromAuthors(authors: AuthorItem[]): DashboardRecord[] {
      return authors.map((item) => ({
        id: `author-${item.id}`,
        type: 'Authors',
        title: item.penulis_buku,
        subtitle: item.email_penulis || item.alamat || 'Penulis buku',
        createdAt: toIso(item.updated_at),
      }))
    },
    fromPublishers(publishers: PublisherItem[]): DashboardRecord[] {
      return publishers.map((item) => ({
        id: `publisher-${item.id}`,
        type: 'Publishers',
        title: item.penerbit_buku,
        subtitle: item.email_penerbit || item.alamat_penerbit || 'Penerbit buku',
        createdAt: toIso(item.updated_at),
      }))
    },
    fromBorrowings(borrowings: BorrowingItem[]): DashboardRecord[] {
      return borrowings.map((item) => ({
        id: `borrowing-${item.id}`,
        type: 'Borrowings',
        title: item.id,
        subtitle: `Anggota ${item.id_anggota} • ${formatDateTime(item.tgl_pinjam)}`,
        createdAt: toIso(item.updated_at ?? item.created_at),
      }))
    },
    fromFines(fines: FineItem[]): DashboardRecord[] {
      return fines.map((item) => ({
        id: `fine-${item.id}`,
        type: 'Fines',
        title: `Rp ${new Intl.NumberFormat('id-ID').format(item.jumlah_denda)}`,
        subtitle: `Peminjaman ${item.id_peminjaman} • Anggota ${item.id_anggota}`,
        createdAt: toIso(item.updated_at ?? item.created_at),
      }))
    },
  }
}

function sortRecent(records: DashboardRecord[]) {
  return [...records]
    .sort((left, right) => {
      const leftValue = left.createdAt ? new Date(left.createdAt).getTime() : 0
      const rightValue = right.createdAt ? new Date(right.createdAt).getTime() : 0

      return rightValue - leftValue
    })
    .slice(0, 8)
}

export function useDashboardData() {
  const results = useQueries({
    queries: [
      { queryKey: ['dashboard', 'categories'], queryFn: fetchCategories, staleTime: 60_000 },
      { queryKey: ['dashboard', 'authors'], queryFn: fetchAuthors, staleTime: 60_000 },
      { queryKey: ['dashboard', 'publishers'], queryFn: fetchPublishers, staleTime: 60_000 },
      { queryKey: ['dashboard', 'borrowings'], queryFn: fetchBorrowings, staleTime: 30_000 },
      { queryKey: ['dashboard', 'fines'], queryFn: fetchFines, staleTime: 30_000 },
    ],
  }) as [
    QueryResult<CategoryItem[]>,
    QueryResult<AuthorItem[]>,
    QueryResult<PublisherItem[]>,
    QueryResult<BorrowingItem[]>,
    QueryResult<FineItem[]>,
  ]

  const [categories, authors, publishers, borrowings, fines] = results
  const recordsFactory = makeRecords()

  const isLoading = results.some((result) => result.isPending)
  const isError = results.some((result) => result.isError)

  const metrics: DashboardMetric[] = [
    { label: 'Total Categories', value: categories.data?.length ?? 0, hint: 'Jenis buku aktif' },
    { label: 'Total Authors', value: authors.data?.length ?? 0, hint: 'Penulis terdaftar' },
    { label: 'Total Publishers', value: publishers.data?.length ?? 0, hint: 'Penerbit terdaftar' },
    { label: 'Total Borrowings', value: borrowings.data?.length ?? 0, hint: 'Transaksi peminjaman' },
    { label: 'Total Fines', value: fines.data?.length ?? 0, hint: 'Data denda masuk' },
  ]

  const recentRecords = sortRecent([
    ...(categories.data ? recordsFactory.fromCategories(categories.data) : []),
    ...(authors.data ? recordsFactory.fromAuthors(authors.data) : []),
    ...(publishers.data ? recordsFactory.fromPublishers(publishers.data) : []),
    ...(borrowings.data ? recordsFactory.fromBorrowings(borrowings.data) : []),
    ...(fines.data ? recordsFactory.fromFines(fines.data) : []),
  ])

  return {
    metrics,
    recentRecords,
    isLoading,
    isError,
    error: results.find((result) => result.isError)?.error ?? null,
  }
}
