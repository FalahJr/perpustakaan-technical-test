export type PublisherItem = {
  id: string
  penerbit_buku: string
  alamat_penerbit?: string
  telp_penerbit?: string
  email_penerbit?: string
  deskripsi_penerbit?: string
  updated_at?: string
}

export type PublisherFormValues = {
  penerbit_buku: string
  alamat_penerbit: string
  telp_penerbit: string
  email_penerbit: string
  deskripsi_penerbit: string
}