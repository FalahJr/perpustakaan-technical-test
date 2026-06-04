import { apiClient } from '@/api/axios'

type ApiListResponse<T> = {
  error?: boolean
  msg?: string
  status?: string
  data: T
}

export type CategoryItem = {
  id: string
  jenis_buku: string
  deskripsi?: string
  updated_at?: string
}

export type AuthorItem = {
  id: string
  penulis_buku: string
  alamat?: string
  email_penulis?: string
  deskripsi?: string
  updated_at?: string
}

export type PublisherItem = {
  id: string
  penerbit_buku: string
  alamat_penerbit?: string
  telp_penerbit?: string
  email_penerbit?: string
  deskripsi_penerbit?: string
  updated_at?: string
}

export type BorrowingItem = {
  id: string
  id_anggota: string
  tgl_pinjam: string
  tgl_hrs_kembali: string
  jaminan: string
  created_at?: string
  updated_at?: string
}

export type FineItem = {
  id: string
  jumlah_denda: number
  tgl_pinjam: string
  tgl_hrs_kembali: string
  tgl_kembali: string
  id_peminjaman: string
  id_anggota: string
  created_at?: string
  updated_at?: string
}

async function fetchList<T>(url: string) {
  const response = await apiClient.get<ApiListResponse<T>>(url)
  return response.data.data
}

export function fetchCategories() {
  return fetchList<CategoryItem[]>('/admin/buku/jenbuk')
}

export function fetchAuthors() {
  return fetchList<AuthorItem[]>('/admin/buku/author')
}

export function fetchPublishers() {
  return fetchList<PublisherItem[]>('/admin/buku/penbuk')
}

export function fetchBorrowings() {
  return fetchList<BorrowingItem[]>('/admin/peminjaman')
}

export function fetchFines() {
  return fetchList<FineItem[]>('/admin/denda')
}
