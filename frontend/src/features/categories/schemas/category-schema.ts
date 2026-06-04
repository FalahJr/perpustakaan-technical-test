import { z } from 'zod'

export const categorySchema = z.object({
  jenis_buku: z.string().min(3, 'Nama kategori minimal 3 karakter'),
  deskripsi: z.string().min(3, 'Deskripsi minimal 3 karakter'),
})

export type CategorySchema = z.infer<typeof categorySchema>
