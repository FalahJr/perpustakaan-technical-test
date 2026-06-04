import { z } from 'zod'

export const publisherSchema = z.object({
  penerbit_buku: z.string().min(3, 'Nama penerbit minimal 3 karakter'),
  alamat_penerbit: z.string().min(3, 'Alamat minimal 3 karakter'),
  telp_penerbit: z.string().min(3, 'Telepon minimal 3 karakter'),
  email_penerbit: z.string().email('Email penerbit tidak valid'),
  deskripsi: z.string().min(3, 'Deskripsi minimal 3 karakter'),
})

export type PublisherSchema = z.infer<typeof publisherSchema>