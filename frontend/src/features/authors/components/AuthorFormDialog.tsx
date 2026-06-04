import { useEffect } from "react";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Modal } from "@/components/ui/Modal";
import {
  authorSchema,
  type AuthorSchema,
} from "@/features/authors/schemas/author-schema";

type AuthorFormDialogProps = {
  open: boolean;
  title: string;
  description: string;
  defaultValues?: AuthorSchema;
  submitLabel: string;
  isSubmitting?: boolean;
  onSubmit: (values: AuthorSchema) => Promise<void> | void;
  onClose: () => void;
};

export function AuthorFormDialog({
  open,
  title,
  description,
  defaultValues,
  submitLabel,
  isSubmitting = false,
  onSubmit,
  onClose,
}: AuthorFormDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AuthorSchema>({
    resolver: zodResolver(authorSchema),
    defaultValues: defaultValues ?? {
      penulis_buku: "",
      alamat_penulis: "",
      email_penulis: "",
      deskripsi: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset(
        defaultValues ?? {
          penulis_buku: "",
          alamat_penulis: "",
          email_penulis: "",
          deskripsi: "",
        },
      );
    }
  }, [defaultValues, open, reset]);

  const submit = handleSubmit(async (values: AuthorSchema) => {
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
            htmlFor="penulis_buku"
          >
            Nama penulis
          </label>
          <Controller
            control={control}
            name="penulis_buku"
            render={({ field }: { field: any }) => (
              <Input
                {...field}
                id="penulis_buku"
                placeholder="Contoh: Andrea Hirata"
              />
            )}
          />
          {errors.penulis_buku ? (
            <p className="mt-2 text-sm text-rose-300">
              {errors.penulis_buku.message}
            </p>
          ) : null}
        </div>

        <div>
          <label
            className="mb-2 block text-sm font-medium text-black"
            htmlFor="alamat_penulis"
          >
            Alamat
          </label>
          <Controller
            control={control}
            name="alamat_penulis"
            render={({ field }: { field: any }) => (
              <Input
                {...field}
                id="alamat_penulis"
                placeholder="Contoh: Jakarta"
              />
            )}
          />
          {errors.alamat_penulis ? (
            <p className="mt-2 text-sm text-rose-300">
              {errors.alamat_penulis.message}
            </p>
          ) : null}
        </div>

        <div>
          <label
            className="mb-2 block text-sm font-medium text-black"
            htmlFor="email_penulis"
          >
            Email
          </label>
          <Controller
            control={control}
            name="email_penulis"
            render={({ field }: { field: any }) => (
              <Input
                {...field}
                id="email_penulis"
                type="email"
                placeholder="nama@domain.com"
              />
            )}
          />
          {errors.email_penulis ? (
            <p className="mt-2 text-sm text-rose-300">
              {errors.email_penulis.message}
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
                placeholder="Deskripsi penulis"
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
