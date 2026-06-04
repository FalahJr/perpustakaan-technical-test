import { useMemo, useState } from "react";
import { Edit3, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { DataTable, type TableColumn } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { SearchInput } from "@/components/ui/SearchInput";
import { SkeletonLoader } from "@/components/ui/SkeletonLoader";
import { FineFormDialog } from "@/features/fines/components/FineFormDialog";
import { useFineMutations } from "@/features/fines/hooks/useFineMutations";
import { useFinesQuery } from "@/features/fines/hooks/useFinesQuery";
import type { FineItem } from "@/features/fines/types";
import type { FineSchema } from "@/features/fines/schemas/fine-schema";

const emptyForm: FineSchema = {
  jumlah_denda: 0,
  tgl_pinjam: "",
  tgl_hrs_kembali: "",
  tgl_kembali: "",
  id_peminjaman: "",
  id_anggota: "",
};

const formatDate = (value: string | undefined) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const formatDateInput = (value: string) => value.split("T")[0];

export function FinesPage() {
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFine, setEditingFine] = useState<FineItem | null>(null);
  const [deletingFine, setDeletingFine] = useState<FineItem | null>(null);

  const finesQuery = useFinesQuery();
  const { createMutation, updateMutation, deleteMutation } = useFineMutations();

  const fines = finesQuery.data ?? [];
  const filteredFines = fines.filter((item) => {
    const query = search.toLowerCase();
    return (
      item.id_denda.toLowerCase().includes(query) ||
      item.id_peminjaman.toLowerCase().includes(query) ||
      item.id_anggota.toLowerCase().includes(query)
    );
  });

  const columns = useMemo<TableColumn<FineItem>[]>(
    () => [
      {
        header: "ID denda",
        cell: (item) => (
          <div>
            <p className="font-semibold text-slate-900">{item.id_denda}</p>
            <p className="mt-1 text-xs text-slate-500">
              Peminjaman: {item.id_peminjaman}
            </p>
          </div>
        ),
      },
      {
        header: "Jumlah denda",
        cell: (item) => (
          <p className="text-sm text-slate-700">
            Rp {item.jumlah_denda.toLocaleString("id-ID")}
          </p>
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
        header: "Tanggal kembali",
        cell: (item) => (
          <p className="text-sm text-slate-700">
            {formatDate(item.tgl_kembali)}
          </p>
        ),
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
                setEditingFine(item);
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
              onClick={() => setDeletingFine(item)}
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
    setEditingFine(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingFine(null);
  };

  const handleSubmit = async (values: FineSchema) => {
    if (editingFine) {
      await updateMutation.mutateAsync({
        id: editingFine.id_denda,
        payload: values,
      });
    } else {
      await createMutation.mutateAsync(values);
    }

    closeForm();
  };

  const handleDelete = async () => {
    if (!deletingFine) return;
    await deleteMutation.mutateAsync(deletingFine.id_denda);
    setDeletingFine(null);
  };

  const isBusy = createMutation.isPending || updateMutation.isPending;

  return (
    <section className="space-y-6">
      <header className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Kelola Denda
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
              Kelola denda keterlambatan pengembalian buku dari anggota
              perpustakaan.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <SearchInput
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari denda..."
            />
            <Button type="button" onClick={openCreateForm}>
              <Plus className="h-4 w-4" />
              Tambah denda
            </Button>
          </div>
        </div>
      </header>

      {finesQuery.isError ? (
        <ErrorState
          title="Gagal memuat denda"
          description={
            finesQuery.error instanceof Error
              ? finesQuery.error.message
              : "Silakan coba lagi."
          }
        />
      ) : finesQuery.isLoading ? (
        <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <SkeletonLoader className="h-12 w-full rounded-lg" />
          <SkeletonLoader className="h-64 w-full rounded-lg" />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <article className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-glow backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Total denda
              </p>
              <p className="mt-3 text-3xl font-semibold text-black">
                {fines.length}
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
            data={filteredFines}
            columns={columns}
            getRowKey={(item) => item.id_denda}
            emptyTitle="Belum ada denda"
            emptyDescription="Tambahkan denda baru untuk mengelola keterlambatan pengembalian buku."
          />
        </div>
      )}

      <FineFormDialog
        open={isFormOpen}
        title={editingFine ? "Edit denda" : "Tambah denda"}
        description={
          editingFine
            ? "Ubah detail denda keterlambatan."
            : "Tambahkan denda keterlambatan baru ke sistem."
        }
        defaultValues={
          editingFine
            ? {
                jumlah_denda: editingFine.jumlah_denda,
                tgl_pinjam: formatDateInput(editingFine.tgl_pinjam),
                tgl_hrs_kembali: formatDateInput(editingFine.tgl_hrs_kembali),
                tgl_kembali: formatDateInput(editingFine.tgl_kembali),
                id_peminjaman: editingFine.id_peminjaman,
                id_anggota: editingFine.id_anggota,
              }
            : emptyForm
        }
        submitLabel={editingFine ? "Simpan perubahan" : "Simpan denda"}
        isSubmitting={isBusy}
        onSubmit={handleSubmit}
        onClose={closeForm}
      />

      <ConfirmDialog
        open={Boolean(deletingFine)}
        title="Hapus denda"
        description={`Hapus denda ${deletingFine?.id_denda ?? ""} dari sistem?`}
        confirmLabel="Hapus"
        cancelLabel="Batal"
        danger
        isLoading={deleteMutation.isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeletingFine(null)}
      >
        <EmptyState
          title="Tindakan ini tidak bisa dibatalkan"
          description="Semua data denda akan dihapus dari daftar."
        />
      </ConfirmDialog>
    </section>
  );
}
