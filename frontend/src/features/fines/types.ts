export type FineItem = {
  id_denda: string
  jumlah_denda: number
  tgl_pinjam: string
  tgl_hrs_kembali: string
  tgl_kembali: string
  id_peminjaman: string
  id_anggota: string
  created_at: string
  updated_at: string
}

export type FineFormValues = {
  jumlah_denda: number
  tgl_pinjam: string
  tgl_hrs_kembali: string
  tgl_kembali: string
  id_peminjaman: string
  id_anggota: string
}
