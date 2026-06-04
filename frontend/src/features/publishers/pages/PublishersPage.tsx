import { useMemo, useState } from "react";
import { Edit3, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { DataTable, type TableColumn } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { SearchInput } from "@/components/ui/SearchInput";
import { SkeletonLoader } from "@/components/ui/SkeletonLoader";
import { PublisherFormDialog } from "@/features/publishers/components/PublisherFormDialog";
import { usePublisherMutations } from "@/features/publishers/hooks/usePublisherMutations";
import { usePublishersQuery } from "@/features/publishers/hooks/usePublishersQuery";
import type { PublisherSchema } from "@/features/publishers/schemas/publisher-schema";
import type { PublisherItem } from "@/features/publishers/types";

const emptyForm: PublisherSchema = {
  penerbit_buku: "",
  alamat_penerbit: "",
  telp_penerbit: "",
  email_penerbit: "",
  deskripsi: "",
};

export function PublishersPage() {
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPublisher, setEditingPublisher] =
    useState<PublisherItem | null>(null);
  const [deletingPublisher, setDeletingPublisher] =
    useState<PublisherItem | null>(null);

  const publishersQuery = usePublishersQuery(search);
  const { createMutation, updateMutation, deleteMutation } =
    usePublisherMutations();

  const publishers = publishersQuery.data ?? [];

  const columns = useMemo<TableColumn<PublisherItem>[]>(
    () => [
      {
        header: "Nama penerbit",
        cell: (item) => (
          <div>
            <p className="font-semibold text-slate-900">{item.penerbit_buku}</p>
            <p className="mt-1 text-xs text-slate-500">ID: {item.id}</p>
          </div>
        ),
      },
      {
        header: "Kontak",
        cell: (item) => (
          <div className="space-y-1 text-sm text-slate-700">
            <p>{item.alamat_penerbit ?? "-"}</p>
            <p>{item.telp_penerbit ?? "-"}</p>
            <p>{item.email_penerbit ?? "-"}</p>
          </div>
        ),
      },
      {
        header: "Deskripsi",
        cell: (item) => (
          <p className="max-w-xl text-sm leading-6 text-slate-700">
            {item.deskripsi_penerbit ?? "-"}
          </p>
        ),
      },
      {
        header: "Update",
        cell: (item) => (
          <span className="text-sm text-slate-600">
            {item.updated_at
              ? new Intl.DateTimeFormat("id-ID", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }).format(new Date(item.updated_at))
              : "-"}
          </span>
        ),
        className: "whitespace-nowrap",
      },
      {
        header: "Aksi",
        cell: (item) => (
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => {
                setEditingPublisher(item);
                setIsFormOpen(true);
              }}
            >
              <Edit3 className="h-4 w-4" />
              Edit
            </Button>
            <Button
              type="button"
              size="sm"
              variant="danger"
              onClick={() => setDeletingPublisher(item)}
            >
              <Trash2 className="h-4 w-4" />
              Hapus
            </Button>
          </div>
        ),
      },
    ],
    [],
  );

  const openCreateForm = () => {
    setEditingPublisher(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingPublisher(null);
  };

  const handleSubmit = async (values: PublisherSchema) => {
    if (editingPublisher) {
      await updateMutation.mutateAsync({
        id: editingPublisher.id,
        payload: values,
      });
    } else {
      await createMutation.mutateAsync(values);
    }

    closeForm();
  };

  const handleDelete = async () => {
    if (!deletingPublisher) {
      return;
    }

    await deleteMutation.mutateAsync(deletingPublisher.id);
    setDeletingPublisher(null);
  };

  const isBusy = createMutation.isPending || updateMutation.isPending;

  return (
    <section className="space-y-6">
      <header className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Kelola Data Penerbit
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
              Tambah, edit, atau hapus data penerbit buku dalam perpustakaan.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <SearchInput
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari penerbit..."
            />
            <Button type="button" onClick={openCreateForm}>
              <Plus className="h-4 w-4" />
              Tambah penerbit
            </Button>
          </div>
        </div>
      </header>

      {publishersQuery.isError ? (
        <ErrorState
          title="Gagal memuat penerbit"
          description={
            publishersQuery.error instanceof Error
              ? publishersQuery.error.message
              : "Silakan coba lagi."
          }
        />
      ) : publishersQuery.isLoading ? (
        <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <SkeletonLoader className="h-12 w-full rounded-lg" />
          <SkeletonLoader className="h-64 w-full rounded-lg" />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <article className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-glow backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Total penerbit
              </p>
              <p className="mt-3 text-3xl font-semibold text-black">
                {publishers.length}
              </p>
            </article>
            <article className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-glow backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Pencarian aktif
              </p>
              <p className="mt-3 text-3xl font-semibold text-black">
                {search ? "Ya" : "Tidak"}
              </p>
            </article>
            <article className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-glow backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Action status
              </p>
              <p className="mt-3 text-lg font-semibold text-black">
                {isBusy ? "Menyimpan..." : "Siap"}
              </p>
            </article>
          </div>

          <DataTable
            data={publishers}
            columns={columns}
            getRowKey={(item) => item.id}
            emptyTitle="Belum ada penerbit"
            emptyDescription="Tambahkan penerbit baru untuk mulai mengelola data penerbit buku."
          />
        </div>
      )}

      <PublisherFormDialog
        open={isFormOpen}
        title={editingPublisher ? "Edit penerbit" : "Tambah penerbit"}
        description={
          editingPublisher
            ? "Ubah detail penerbit yang dipilih."
            : "Tambahkan penerbit baru ke sistem."
        }
        defaultValues={
          editingPublisher
            ? {
                penerbit_buku: editingPublisher.penerbit_buku,
                alamat_penerbit: editingPublisher.alamat_penerbit ?? "",
                telp_penerbit: editingPublisher.telp_penerbit ?? "",
                email_penerbit: editingPublisher.email_penerbit ?? "",
                deskripsi: editingPublisher.deskripsi_penerbit ?? "",
              }
            : emptyForm
        }
        submitLabel={editingPublisher ? "Simpan perubahan" : "Simpan penerbit"}
        isSubmitting={isBusy}
        onSubmit={handleSubmit}
        onClose={closeForm}
      />

      <ConfirmDialog
        open={Boolean(deletingPublisher)}
        title="Hapus penerbit"
        description={`Hapus penerbit ${deletingPublisher?.penerbit_buku ?? ""} dari sistem?`}
        confirmLabel="Hapus"
        cancelLabel="Batal"
        danger
        isLoading={deleteMutation.isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeletingPublisher(null)}
      >
        <EmptyState
          title="Tindakan ini tidak bisa dibatalkan"
          description="Semua data penerbit akan dihapus dari daftar."
        />
      </ConfirmDialog>
    </section>
  );
}
