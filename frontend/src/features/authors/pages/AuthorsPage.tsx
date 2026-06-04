import { useMemo, useState } from "react";
import { Edit3, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { DataTable, type TableColumn } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { SearchInput } from "@/components/ui/SearchInput";
import { SkeletonLoader } from "@/components/ui/SkeletonLoader";
import { AuthorFormDialog } from "@/features/authors/components/AuthorFormDialog";
import { useAuthorMutations } from "@/features/authors/hooks/useAuthorMutations";
import { useAuthorsQuery } from "@/features/authors/hooks/useAuthorsQuery";
import type { AuthorItem } from "@/features/authors/types";
import type { AuthorSchema } from "@/features/authors/schemas/author-schema";

const emptyForm: AuthorSchema = {
  penulis_buku: "",
  alamat_penulis: "",
  email_penulis: "",
  deskripsi: "",
};

export function AuthorsPage() {
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<AuthorItem | null>(null);
  const [deletingAuthor, setDeletingAuthor] = useState<AuthorItem | null>(null);

  const authorsQuery = useAuthorsQuery(search);
  const { createMutation, updateMutation, deleteMutation } =
    useAuthorMutations();

  const authors = authorsQuery.data ?? [];

  const columns = useMemo<TableColumn<AuthorItem>[]>(
    () => [
      {
        header: "Nama penulis",
        cell: (item) => (
          <div>
            <p className="font-semibold text-slate-900">{item.penulis_buku}</p>
            <p className="mt-1 text-xs text-slate-500">ID: {item.id}</p>
          </div>
        ),
      },
      {
        header: "Kontak",
        cell: (item) => (
          <div className="space-y-1 text-sm text-slate-700">
            <p>{item.alamat ?? "-"}</p>
            <p>{item.email_penulis ?? "-"}</p>
          </div>
        ),
      },
      {
        header: "Deskripsi",
        cell: (item) => (
          <p className="max-w-xl text-sm leading-6 text-slate-700">
            {item.deskripsi ?? "-"}
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
                setEditingAuthor(item);
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
              onClick={() => setDeletingAuthor(item)}
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
    setEditingAuthor(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingAuthor(null);
  };

  const handleSubmit = async (values: AuthorSchema) => {
    if (editingAuthor) {
      await updateMutation.mutateAsync({
        id: editingAuthor.id,
        payload: values,
      });
    } else {
      await createMutation.mutateAsync(values);
    }

    closeForm();
  };

  const handleDelete = async () => {
    if (!deletingAuthor) {
      return;
    }

    await deleteMutation.mutateAsync(deletingAuthor.id);
    setDeletingAuthor(null);
  };

  const isBusy = createMutation.isPending || updateMutation.isPending;

  return (
    <section className="space-y-6">
      <header className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Kelola Data Penulis
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
              Tambah, edit, atau hapus data penulis buku dalam perpustakaan.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <SearchInput
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari penulis..."
            />
            <Button type="button" onClick={openCreateForm}>
              <Plus className="h-4 w-4" />
              Tambah penulis
            </Button>
          </div>
        </div>
      </header>

      {authorsQuery.isError ? (
        <ErrorState
          title="Gagal memuat penulis"
          description={
            authorsQuery.error instanceof Error
              ? authorsQuery.error.message
              : "Silakan coba lagi."
          }
        />
      ) : authorsQuery.isLoading ? (
        <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <SkeletonLoader className="h-12 w-full rounded-lg" />
          <SkeletonLoader className="h-64 w-full rounded-lg" />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <article className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-glow backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Total penulis
              </p>
              <p className="mt-3 text-3xl font-semibold text-black">
                {authors.length}
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
            data={authors}
            columns={columns}
            getRowKey={(item) => item.id}
            emptyTitle="Belum ada penulis"
            emptyDescription="Tambahkan penulis baru untuk mulai mengelola data penulis buku."
          />
        </div>
      )}

      <AuthorFormDialog
        open={isFormOpen}
        title={editingAuthor ? "Edit penulis" : "Tambah penulis"}
        description={
          editingAuthor
            ? "Ubah detail penulis yang dipilih."
            : "Tambahkan penulis baru ke sistem."
        }
        defaultValues={
          editingAuthor
            ? {
                penulis_buku: editingAuthor.penulis_buku,
                alamat_penulis: editingAuthor.alamat ?? "",
                email_penulis: editingAuthor.email_penulis ?? "",
                deskripsi: editingAuthor.deskripsi ?? "",
              }
            : emptyForm
        }
        submitLabel={editingAuthor ? "Simpan perubahan" : "Simpan penulis"}
        isSubmitting={isBusy}
        onSubmit={handleSubmit}
        onClose={closeForm}
      />

      <ConfirmDialog
        open={Boolean(deletingAuthor)}
        title="Hapus penulis"
        description={`Hapus penulis ${deletingAuthor?.penulis_buku ?? ""} dari sistem?`}
        confirmLabel="Hapus"
        cancelLabel="Batal"
        danger
        isLoading={deleteMutation.isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeletingAuthor(null)}
      >
        <EmptyState
          title="Tindakan ini tidak bisa dibatalkan"
          description="Semua data penulis akan dihapus dari daftar."
        />
      </ConfirmDialog>
    </section>
  );
}
