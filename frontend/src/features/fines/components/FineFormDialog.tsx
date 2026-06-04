import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { fetchBorrowings } from '@/features/borrowings/api/borrowings'
import { fineSchema, type FineSchema } from '@/features/fines/schemas/fine-schema'

type BorrowingOption = {
  id: string
  id_anggota: string
}

type AnggotaOption = {
  id_anggota: string
  nama: string
}

type FineFormDialogProps = {
  open: boolean
  title: string
  description: string
  defaultValues?: FineSchema
  submitLabel: string
  isSubmitting?: boolean
  onSubmit: (values: FineSchema) => Promise<void> | void
  onClose: () => void
}

export function FineFormDialog({
  open,
  title,
  description,
  defaultValues,
  submitLabel,
  isSubmitting = false,
  onSubmit,
  onClose,
}: FineFormDialogProps) {
  const [anggotaOptions, setAnggotaOptions] = useState<AnggotaOption[]>([])
  const [peminjamanOptions, setPeminjamanOptions] = useState<BorrowingOption[]>([])

  const { data: anggotaData } = useQuery({
    queryKey: ['anggota'],
    queryFn: async () => {
      const response = await fetch('http://localhost:8001/api/v1/anggota')
      const json = await response.json()
      return json.data || []
    },
  })

  const { data: peminjamanData } = useQuery({
    queryKey: ['borrowings'],
    queryFn: fetchBorrowings,
  })

  useEffect(() => {
    if (anggotaData) {
      setAnggotaOptions(anggotaData)
    }
  }, [anggotaData])

  useEffect(() => {
    if (peminjamanData) {
      setPeminjamanOptions(
        peminjamanData.map((item) => ({ id: item.id, id_anggota: item.id_anggota })),
      )
    }
  }, [peminjamanData])

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FineSchema>({
    resolver: zodResolver(fineSchema),
    defaultValues: defaultValues ?? {
      jumlah_denda: 0,
      tgl_pinjam: '',
      tgl_hrs_kembali: '',
      tgl_kembali: '',
      id_peminjaman: '',
      id_anggota: '',
    },
  })

  useEffect(() => {
    if (open) {
      reset(
        defaultValues ?? {
          jumlah_denda: 0,
          tgl_pinjam: '',
          tgl_hrs_kembali: '',
          tgl_kembali: '',
          id_peminjaman: '',
          id_anggota: '',
        },
      )
    }
  }, [defaultValues, open, reset])

  const submit = handleSubmit(async (values: FineSchema) => {
    await onSubmit(values)
  })

  return (
    <Modal open={open} title={title} description={description} onClose={onClose}>
      <form onSubmit={submit} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="jumlah_denda">
            Jumlah denda
          </label>
          <Controller
            control={control}
            name="jumlah_denda"
            render={({ field }: { field: any }) => (
              <Input {...field} id="jumlah_denda" type="number" min={0} placeholder="Contoh: 5000" />
            )}
          />
          {errors.jumlah_denda ? <p className="mt-2 text-sm text-rose-300">{errors.jumlah_denda.message}</p> : null}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="tgl_pinjam">
            Tanggal pinjam
          </label>
          <Controller
            control={control}
            name="tgl_pinjam"
            render={({ field }: { field: any }) => <Input {...field} id="tgl_pinjam" type="date" />}
          />
          {errors.tgl_pinjam ? <p className="mt-2 text-sm text-rose-300">{errors.tgl_pinjam.message}</p> : null}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="tgl_hrs_kembali">
            Tanggal harus kembali
          </label>
          <Controller
            control={control}
            name="tgl_hrs_kembali"
            render={({ field }: { field: any }) => <Input {...field} id="tgl_hrs_kembali" type="date" />}
          />
          {errors.tgl_hrs_kembali ? <p className="mt-2 text-sm text-rose-300">{errors.tgl_hrs_kembali.message}</p> : null}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="tgl_kembali">
            Tanggal kembali
          </label>
          <Controller
            control={control}
            name="tgl_kembali"
            render={({ field }: { field: any }) => <Input {...field} id="tgl_kembali" type="date" />}
          />
          {errors.tgl_kembali ? <p className="mt-2 text-sm text-rose-300">{errors.tgl_kembali.message}</p> : null}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="id_peminjaman">
            ID peminjaman
          </label>
          <Controller
            control={control}
            name="id_peminjaman"
            render={({ field }: { field: any }) => (
              <Select {...field} id="id_peminjaman">
                <option value="">Pilih peminjaman</option>
                {peminjamanOptions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.id}
                  </option>
                ))}
              </Select>
            )}
          />
          {errors.id_peminjaman ? <p className="mt-2 text-sm text-rose-300">{errors.id_peminjaman.message}</p> : null}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="id_anggota">
            ID anggota
          </label>
          <Controller
            control={control}
            name="id_anggota"
            render={({ field }: { field: any }) => (
              <Select {...field} id="id_anggota">
                <option value="">Pilih anggota</option>
                {anggotaOptions.map((anggota) => (
                  <option key={anggota.id_anggota} value={anggota.id_anggota}>
                    {anggota.nama}
                  </option>
                ))}
              </Select>
            )}
          />
          {errors.id_anggota ? <p className="mt-2 text-sm text-rose-300">{errors.id_anggota.message}</p> : null}
        </div>

        <div className="flex flex-wrap justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Batal
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
