import { z } from 'zod'

export const fineSchema = z
  .object({
    jumlah_denda: z.coerce.number().min(1, 'Jumlah denda minimal 1'),
    tgl_pinjam: z
      .string()
      .min(10, 'Tanggal pinjam wajib diisi')
      .refine((value) => !Number.isNaN(Date.parse(value)), 'Tanggal pinjam tidak valid'),
    tgl_hrs_kembali: z
      .string()
      .min(10, 'Tanggal harus kembali wajib diisi')
      .refine((value) => !Number.isNaN(Date.parse(value)), 'Tanggal harus kembali tidak valid'),
    tgl_kembali: z
      .string()
      .min(10, 'Tanggal kembali wajib diisi')
      .refine((value) => !Number.isNaN(Date.parse(value)), 'Tanggal kembali tidak valid'),
    id_peminjaman: z.string().min(1, 'ID peminjaman wajib dipilih'),
    id_anggota: z.string().min(1, 'ID anggota wajib dipilih'),
  })
  .refine((data) => new Date(data.tgl_hrs_kembali) >= new Date(data.tgl_pinjam), {
    message: 'Tanggal harus kembali harus sama atau setelah tanggal pinjam',
    path: ['tgl_hrs_kembali'],
  })
  .refine((data) => new Date(data.tgl_kembali) >= new Date(data.tgl_hrs_kembali), {
    message: 'Tanggal kembali harus sama atau setelah tanggal harus kembali',
    path: ['tgl_kembali'],
  })

export type FineSchema = z.infer<typeof fineSchema>
