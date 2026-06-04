import { useMemo, useState } from "react";
import { Edit3, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { DataTable, type TableColumn } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { SearchInput } from "@/components/ui/SearchInput";
import { SkeletonLoader } from "@/components/ui/SkeletonLoader";
import { CategoryFormDialog } from "@/features/categories/components/CategoryFormDialog";
import { useCategoryMutations } from "@/features/categories/hooks/useCategoryMutations";
import { useCategoriesQuery } from "@/features/categories/hooks/useCategoriesQuery";
import type { CategoryItem } from "@/features/categories/types";
import type { CategorySchema } from "@/features/categories/schemas/category-schema";

const emptyForm: CategorySchema = {
  jenis_buku: "",
  deskripsi: "",
};

export function CategoriesPage() {
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(
    null,
  );
  const [deletingCategory, setDeletingCategory] = useState<CategoryItem | null>(
    null,
  );

  const categoriesQuery = useCategoriesQuery(search);
  const { createMutation, updateMutation, deleteMutation } =
    useCategoryMutations();

  const categories = categoriesQuery.data ?? [];

  const columns = useMemo<TableColumn<CategoryItem>[]>(
    () => [
      {
        header: "Nama kategori",
        cell: (item) => (
          <div>
            <p className="font-semibold text-slate-900">{item.jenis_buku}</p>
            <p className="mt-1 text-xs text-slate-500">ID: {item.id}</p>
          </div>
        ),
      },
      {
        header: "Deskripsi",
        cell: (item) => (
          <p className="max-w-xl text-sm leading-6 text-slate-700">
            {item.deskripsi}
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
                setEditingCategory(item);
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
              onClick={() => setDeletingCategory(item)}
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
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = async (values: CategorySchema) => {
    if (editingCategory) {
      await updateMutation.mutateAsync({
        id: editingCategory.id,
        payload: values,
      });
    } else {
      await createMutation.mutateAsync(values);
    }

    closeForm();
  };

  const handleDelete = async () => {
    if (!deletingCategory) {
      return;
    }

    await deleteMutation.mutateAsync(deletingCategory.id);
    setDeletingCategory(null);
  };

  const isBusy = createMutation.isPending || updateMutation.isPending;

  return (
    <section className="space-y-6">
      <header className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Kelola Kategori Buku
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
              Tambah, edit, atau hapus kategori buku untuk mengorganisir koleksi
              perpustakaan.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <SearchInput
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari kategori..."
            />
            <Button type="button" onClick={openCreateForm}>
              <Plus className="h-4 w-4" />
              Tambah kategori
            </Button>
          </div>
        </div>
      </header>

      {categoriesQuery.isError ? (
        <ErrorState
          title="Gagal memuat kategori"
          description={
            categoriesQuery.error instanceof Error
              ? categoriesQuery.error.message
              : "Silakan coba lagi."
          }
        />
      ) : categoriesQuery.isLoading ? (
        <div className="space-y-4 rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-glow backdrop-blur-xl">
          <SkeletonLoader className="h-12 w-full rounded-2xl" />
          <SkeletonLoader className="h-64 w-full rounded-2xl" />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <article className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-glow backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Total kategori
              </p>
              <p className="mt-3 text-3xl font-semibold text-black">
                {categories.length}
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
            data={categories}
            columns={columns}
            getRowKey={(item) => item.id}
            emptyTitle="Belum ada kategori"
            emptyDescription="Tambahkan kategori baru untuk mulai mengelola jenis buku."
          />
        </div>
      )}

      <CategoryFormDialog
        open={isFormOpen}
        title={editingCategory ? "Edit kategori" : "Tambah kategori"}
        description={
          editingCategory
            ? "Ubah detail kategori yang dipilih."
            : "Tambahkan jenis buku baru ke sistem."
        }
        defaultValues={
          editingCategory
            ? {
                jenis_buku: editingCategory.jenis_buku,
                deskripsi: editingCategory.deskripsi,
              }
            : emptyForm
        }
        submitLabel={editingCategory ? "Simpan perubahan" : "Simpan kategori"}
        isSubmitting={isBusy}
        onSubmit={handleSubmit}
        onClose={closeForm}
      />

      <ConfirmDialog
        open={Boolean(deletingCategory)}
        title="Hapus kategori"
        description={`Hapus kategori ${deletingCategory?.jenis_buku ?? ""} dari sistem?`}
        confirmLabel="Hapus"
        cancelLabel="Batal"
        danger
        isLoading={deleteMutation.isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeletingCategory(null)}
      >
        <EmptyState
          title="Tindakan ini tidak bisa dibatalkan"
          description="Semua data kategori akan dihapus dari daftar."
        />
      </ConfirmDialog>
    </section>
  );
}
