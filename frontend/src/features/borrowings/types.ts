export type BorrowingItem = {
  id: string
  id_anggota: string
  tgl_pinjam: string
  tgl_hrs_kembali: string
  jaminan: string
  created_at?: string
  updated_at?: string
}

export type BorrowingFormValues = {
  id_anggota: string
  tgl_pinjam: string
  tgl_hrs_kembali: string
  jaminan: string
}
