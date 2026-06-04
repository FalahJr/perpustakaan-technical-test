import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { borrowingSchema, type BorrowingSchema } from '@/features/borrowings/schemas/borrowing-schema'

type AnggotaOption = {
  id_anggota: string
  nama: string
}

type BorrowingFormDialogProps = {
  open: boolean
  title: string
  description: string
  defaultValues?: BorrowingSchema
  submitLabel: string
  isSubmitting?: boolean
  onSubmit: (values: BorrowingSchema) => Promise<void> | void
  onClose: () => void
}

export function BorrowingFormDialog({
  open,
  title,
  description,
  defaultValues,
  submitLabel,
  isSubmitting = false,
  onSubmit,
  onClose,
}: BorrowingFormDialogProps) {
  const [anggotaOptions, setAnggotaOptions] = useState<AnggotaOption[]>([])

  // Fetch anggota data
  const { data: anggotaData } = useQuery({
    queryKey: ['anggota'],
    queryFn: async () => {
      const response = await fetch('http://localhost:8001/api/v1/anggota')
      const json = await response.json()
      return json.data || []
    },
  })

  // Update options when data changes
  useEffect(() => {
    if (anggotaData) {
      setAnggotaOptions(anggotaData)
    }
  }, [anggotaData])

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BorrowingSchema>({
    resolver: zodResolver(borrowingSchema),
    defaultValues: defaultValues ?? {
      id_anggota: '',
      tgl_pinjam: '',
      tgl_hrs_kembali: '',
      jaminan: '',
    },
  })

  useEffect(() => {
    if (open) {
      reset(
        defaultValues ?? {
          id_anggota: '',
          tgl_pinjam: '',
          tgl_hrs_kembali: '',
          jaminan: '',
        },
      )
    }
  }, [defaultValues, open, reset])

  const submit = handleSubmit(async (values: BorrowingSchema) => {
    await onSubmit(values)
  })

  return (
    <Modal open={open} title={title} description={description} onClose={onClose}>
      <form onSubmit={submit} className="space-y-5">
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
          <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="jaminan">
            Jaminan
          </label>
          <Controller
            control={control}
            name="jaminan"
            render={({ field }: { field: any }) => <Input {...field} id="jaminan" placeholder="Contoh: KTP / SIM" />}
          />
          {errors.jaminan ? <p className="mt-2 text-sm text-rose-300">{errors.jaminan.message}</p> : null}
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
