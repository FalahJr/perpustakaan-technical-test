import { z } from 'zod'

export const borrowingSchema = z
  .object({
    id_anggota: z.string().min(3, 'ID anggota minimal 3 karakter'),
    tgl_pinjam: z
      .string()
      .min(10, 'Tanggal pinjam wajib diisi')
      .refine((value) => !Number.isNaN(Date.parse(value)), 'Tanggal pinjam tidak valid'),
    tgl_hrs_kembali: z
      .string()
      .min(10, 'Tanggal kembali wajib diisi')
      .refine((value) => !Number.isNaN(Date.parse(value)), 'Tanggal kembali tidak valid'),
    jaminan: z.string().min(3, 'Jaminan minimal 3 karakter'),
  })
  .refine((data) => new Date(data.tgl_hrs_kembali) >= new Date(data.tgl_pinjam), {
    message: 'Tanggal kembali harus sama atau setelah tanggal pinjam',
    path: ['tgl_hrs_kembali'],
  })

export type BorrowingSchema = z.infer<typeof borrowingSchema>
