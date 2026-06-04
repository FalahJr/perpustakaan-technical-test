import { useMemo, useState } from "react";
import { Edit3, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { DataTable, type TableColumn } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { SearchInput } from "@/components/ui/SearchInput";
import { SkeletonLoader } from "@/components/ui/SkeletonLoader";
import { BorrowingFormDialog } from "@/features/borrowings/components/BorrowingFormDialog";
import { useBorrowingMutations } from "@/features/borrowings/hooks/useBorrowingMutations";
import { useBorrowingsQuery } from "@/features/borrowings/hooks/useBorrowingsQuery";
import type { BorrowingItem } from "@/features/borrowings/types";
import type { BorrowingSchema } from "@/features/borrowings/schemas/borrowing-schema";

const emptyForm: BorrowingSchema = {
  id_anggota: "",
  tgl_pinjam: "",
  tgl_hrs_kembali: "",
  jaminan: "",
};

const formatDate = (value: string | undefined) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const formatDateInput = (value: string) => value.split("T")[0];

export function BorrowingsPage() {
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBorrowing, setEditingBorrowing] =
    useState<BorrowingItem | null>(null);
  const [deletingBorrowing, setDeletingBorrowing] =
    useState<BorrowingItem | null>(null);

  const borrowingsQuery = useBorrowingsQuery();
  const { createMutation, updateMutation, deleteMutation } =
    useBorrowingMutations();

  const borrowings = borrowingsQuery.data ?? [];
  const filteredBorrowings = borrowings.filter((item) => {
    const query = search.toLowerCase();
    return (
      item.id.toLowerCase().includes(query) ||
      item.id_anggota.toLowerCase().includes(query) ||
      item.jaminan.toLowerCase().includes(query)
    );
  });

  const columns = useMemo<TableColumn<BorrowingItem>[]>(
    () => [
      {
        header: "ID peminjaman",
        cell: (item) => (
          <div>
            <p className="font-semibold text-slate-900">{item.id}</p>
            <p className="mt-1 text-xs text-slate-500">
              Anggota: {item.id_anggota}
            </p>
          </div>
        ),
      },
      {
        header: "Tanggal pinjam",
        cell: (item) => (
          <p className="text-sm text-slate-700">
            {formatDate(item.tgl_pinjam)}
          </p>
        ),
      },
      {
        header: "Harus kembali",
        cell: (item) => (
          <p className="text-sm text-slate-700">
            {formatDate(item.tgl_hrs_kembali)}
          </p>
        ),
      },
      {
        header: "Jaminan",
        cell: (item) => (
          <p className="max-w-xl text-sm leading-6 text-slate-700">
            {item.jaminan}
          </p>
        ),
      },
      {
        header: "Update",
        cell: (item) => (
          <span className="text-sm text-slate-600">
            {item.updated_at ? formatDate(item.updated_at) : "-"}
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
                setEditingBorrowing(item);
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
              onClick={() => setDeletingBorrowing(item)}
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
    setEditingBorrowing(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingBorrowing(null);
  };

  const handleSubmit = async (values: BorrowingSchema) => {
    if (editingBorrowing) {
      await updateMutation.mutateAsync({
        id: editingBorrowing.id,
        payload: values,
      });
    } else {
      await createMutation.mutateAsync(values);
    }

    closeForm();
  };

  const handleDelete = async () => {
    if (!deletingBorrowing) {
      return;
    }

    await deleteMutation.mutateAsync(deletingBorrowing.id);
    setDeletingBorrowing(null);
  };

  const isBusy = createMutation.isPending || updateMutation.isPending;

  return (
    <section className="space-y-6">
      <header className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Kelola Peminjaman
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
              Kelola transaksi peminjaman buku, termasuk anggota, tanggal
              pinjam, dan jaminan.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <SearchInput
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari peminjaman..."
            />
            <Button type="button" onClick={openCreateForm}>
              <Plus className="h-4 w-4" />
              Tambah peminjaman
            </Button>
          </div>
        </div>
      </header>

      {borrowingsQuery.isError ? (
        <ErrorState
          title="Gagal memuat peminjaman"
          description={
            borrowingsQuery.error instanceof Error
              ? borrowingsQuery.error.message
              : "Silakan coba lagi."
          }
        />
      ) : borrowingsQuery.isLoading ? (
        <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <SkeletonLoader className="h-12 w-full rounded-lg" />
          <SkeletonLoader className="h-64 w-full rounded-lg" />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <article className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-glow backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Total peminjaman
              </p>
              <p className="mt-3 text-3xl font-semibold text-black">
                {borrowings.length}
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
            data={filteredBorrowings}
            columns={columns}
            getRowKey={(item) => item.id}
            emptyTitle="Belum ada peminjaman"
            emptyDescription="Tambahkan peminjaman baru untuk mulai mengelola transaksi peminjaman."
          />
        </div>
      )}

      <BorrowingFormDialog
        open={isFormOpen}
        title={editingBorrowing ? "Edit peminjaman" : "Tambah peminjaman"}
        description={
          editingBorrowing
            ? "Ubah detail transaksi peminjaman."
            : "Tambahkan transaksi peminjaman baru ke sistem."
        }
        defaultValues={
          editingBorrowing
            ? {
                id_anggota: editingBorrowing.id_anggota,
                tgl_pinjam: formatDateInput(editingBorrowing.tgl_pinjam),
                tgl_hrs_kembali: formatDateInput(
                  editingBorrowing.tgl_hrs_kembali,
                ),
                jaminan: editingBorrowing.jaminan,
              }
            : emptyForm
        }
        submitLabel={
          editingBorrowing ? "Simpan perubahan" : "Simpan peminjaman"
        }
        isSubmitting={isBusy}
        onSubmit={handleSubmit}
        onClose={closeForm}
      />

      <ConfirmDialog
        open={Boolean(deletingBorrowing)}
        title="Hapus peminjaman"
        description={`Hapus peminjaman ${deletingBorrowing?.id ?? ""} dari sistem?`}
        confirmLabel="Hapus"
        cancelLabel="Batal"
        danger
        isLoading={deleteMutation.isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeletingBorrowing(null)}
      >
        <EmptyState
          title="Tindakan ini tidak bisa dibatalkan"
          description="Semua data peminjaman akan dihapus dari daftar."
        />
      </ConfirmDialog>
    </section>
  );
}
