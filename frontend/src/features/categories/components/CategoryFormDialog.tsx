import { useEffect } from 'react'

import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Modal } from '@/components/ui/Modal'
import { categorySchema, type CategorySchema } from '@/features/categories/schemas/category-schema'

type CategoryFormDialogProps = {
  open: boolean
  title: string
  description: string
  defaultValues?: CategorySchema
  submitLabel: string
  isSubmitting?: boolean
  onSubmit: (values: CategorySchema) => Promise<void> | void
  onClose: () => void
}

export function CategoryFormDialog({
  open,
  title,
  description,
  defaultValues,
  submitLabel,
  isSubmitting = false,
  onSubmit,
  onClose,
}: CategoryFormDialogProps) {
  const { control, handleSubmit, reset, formState: { errors } } = useForm<CategorySchema>({
    resolver: zodResolver(categorySchema),
    defaultValues: defaultValues ?? {
      jenis_buku: '',
      deskripsi: '',
    },
  })

  useEffect(() => {
    if (open) {
      reset(defaultValues ?? { jenis_buku: '', deskripsi: '' })
    }
  }, [defaultValues, open, reset])

  const submit = handleSubmit(async (values: CategorySchema) => {
    await onSubmit(values)
  })

  return (
    <Modal open={open} title={title} description={description} onClose={onClose}>
      <form onSubmit={submit} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="jenis_buku">
            Nama kategori
          </label>
          <Controller
            control={control}
            name="jenis_buku"
            render={({ field }: { field: any }) => <Input {...field} id="jenis_buku" placeholder="Contoh: Fiksi" />}
          />
          {errors.jenis_buku ? <p className="mt-2 text-sm text-rose-300">{errors.jenis_buku.message}</p> : null}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="deskripsi">
            Deskripsi
          </label>
          <Controller
            control={control}
            name="deskripsi"
            render={({ field }: { field: any }) => <Textarea {...field} id="deskripsi" placeholder="Deskripsi kategori" />}
          />
          {errors.deskripsi ? <p className="mt-2 text-sm text-rose-300">{errors.deskripsi.message}</p> : null}
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
