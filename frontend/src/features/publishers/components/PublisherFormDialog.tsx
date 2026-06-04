import { useEffect } from "react";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Modal } from "@/components/ui/Modal";
import {
  publisherSchema,
  type PublisherSchema,
} from "@/features/publishers/schemas/publisher-schema";

type PublisherFormDialogProps = {
  open: boolean;
  title: string;
  description: string;
  defaultValues?: PublisherSchema;
  submitLabel: string;
  isSubmitting?: boolean;
  onSubmit: (values: PublisherSchema) => Promise<void> | void;
  onClose: () => void;
};

export function PublisherFormDialog({
  open,
  title,
  description,
  defaultValues,
  submitLabel,
  isSubmitting = false,
  onSubmit,
  onClose,
}: PublisherFormDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PublisherSchema>({
    resolver: zodResolver(publisherSchema),
    defaultValues: defaultValues ?? {
      penerbit_buku: "",
      alamat_penerbit: "",
      telp_penerbit: "",
      email_penerbit: "",
      deskripsi: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset(
        defaultValues ?? {
          penerbit_buku: "",
          alamat_penerbit: "",
          telp_penerbit: "",
          email_penerbit: "",
          deskripsi: "",
        },
      );
    }
  }, [defaultValues, open, reset]);

  const submit = handleSubmit(async (values: PublisherSchema) => {
    await onSubmit(values);
  });

  return (
    <Modal
      open={open}
      title={title}
      description={description}
      onClose={onClose}
    >
      <form onSubmit={submit} className="space-y-5">
        <div>
          <label
            className="mb-2 block text-sm font-medium text-black"
            htmlFor="penerbit_buku"
          >
            Nama penerbit
          </label>
          <Controller
            control={control}
            name="penerbit_buku"
            render={({ field }: { field: any }) => (
              <Input
                {...field}
                id="penerbit_buku"
                placeholder="Contoh: Gramedia"
              />
            )}
          />
          {errors.penerbit_buku ? (
            <p className="mt-2 text-sm text-rose-300">
              {errors.penerbit_buku.message}
            </p>
          ) : null}
        </div>

        <div>
          <label
            className="mb-2 block text-sm font-medium text-black"
            htmlFor="alamat_penerbit"
          >
            Alamat
          </label>
          <Controller
            control={control}
            name="alamat_penerbit"
            render={({ field }: { field: any }) => (
              <Input
                {...field}
                id="alamat_penerbit"
                placeholder="Contoh: Jakarta"
              />
            )}
          />
          {errors.alamat_penerbit ? (
            <p className="mt-2 text-sm text-rose-300">
              {errors.alamat_penerbit.message}
            </p>
          ) : null}
        </div>

        <div>
          <label
            className="mb-2 block text-sm font-medium text-black"
            htmlFor="telp_penerbit"
          >
            Telepon
          </label>
          <Controller
            control={control}
            name="telp_penerbit"
            render={({ field }: { field: any }) => (
              <Input
                {...field}
                id="telp_penerbit"
                placeholder="Contoh: 021123456"
              />
            )}
          />
          {errors.telp_penerbit ? (
            <p className="mt-2 text-sm text-rose-300">
              {errors.telp_penerbit.message}
            </p>
          ) : null}
        </div>

        <div>
          <label
            className="mb-2 block text-sm font-medium text-black"
            htmlFor="email_penerbit"
          >
            Email
          </label>
          <Controller
            control={control}
            name="email_penerbit"
            render={({ field }: { field: any }) => (
              <Input
                {...field}
                id="email_penerbit"
                type="email"
                placeholder="nama@domain.com"
              />
            )}
          />
          {errors.email_penerbit ? (
            <p className="mt-2 text-sm text-rose-300">
              {errors.email_penerbit.message}
            </p>
          ) : null}
        </div>

        <div>
          <label
            className="mb-2 block text-sm font-medium text-black"
            htmlFor="deskripsi"
          >
            Deskripsi
          </label>
          <Controller
            control={control}
            name="deskripsi"
            render={({ field }: { field: any }) => (
              <Textarea
                {...field}
                id="deskripsi"
                placeholder="Deskripsi penerbit"
              />
            )}
          />
          {errors.deskripsi ? (
            <p className="mt-2 text-sm text-rose-300">
              {errors.deskripsi.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
