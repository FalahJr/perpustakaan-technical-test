import { z } from 'zod'

export const authorSchema = z.object({
  penulis_buku: z.string().min(3, 'Nama penulis minimal 3 karakter'),
  alamat_penulis: z.string().min(3, 'Alamat minimal 3 karakter'),
  email_penulis: z.string().email('Email penulis tidak valid'),
  deskripsi: z.string().min(3, 'Deskripsi minimal 3 karakter'),
})

export type AuthorSchema = z.infer<typeof authorSchema>