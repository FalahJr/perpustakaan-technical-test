export type AuthorItem = {
  id: string
  penulis_buku: string
  alamat?: string
  email_penulis?: string
  deskripsi?: string
  updated_at?: string
}

export type AuthorFormValues = {
  penulis_buku: string
  alamat_penulis: string
  email_penulis: string
  deskripsi: string
}