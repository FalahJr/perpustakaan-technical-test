import { ErrorState } from '@/components/ui/ErrorState'
import { SkeletonLoader } from '@/components/ui/SkeletonLoader'
import { DashboardStatCard } from '@/features/dashboard/components/DashboardStatCard'
import { RecentRecords } from '@/features/dashboard/components/RecentRecords'
import { useDashboardData } from '@/features/dashboard/hooks/useDashboardData'

const highlights = [
  {
    title: 'Admin Dashboard',
    description: 'Kelola perpustakaan dengan interface yang intuitif dan responsif.',
  },
  {
    title: 'Real-time Data',
    description: 'Setiap statistik diambil langsung dari database backend.',
  },
  {
    title: 'Akses Cepat',
    description: 'Menu sidebar memudahkan navigasi ke semua modul utama.',
  },
]

export function DashboardHomePage() {
  const { metrics, recentRecords, isLoading, isError, error } = useDashboardData()

  if (isError) {
    return (
      <div className="space-y-6">
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
          <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="inline-flex rounded-lg bg-indigo-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-indigo-700">
              Dashboard
            </p>

            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Ringkasan Perpustakaan
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
              Dashboard mengambil data dari sistem backend untuk menampilkan statistik perpustakaan terkini.
            </p>

            <div className="mt-8">
              <ErrorState
                title="Gagal memuat dashboard"
                description={error instanceof Error ? error.message : 'Tidak bisa mengambil data dashboard saat ini.'}
              />
            </div>
          </article>

          <aside className="rounded-lg border border-slate-200 bg-slate-50 p-6 shadow-sm sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-600">
              Info
            </p>
            <h2 className="mt-4 text-xl font-semibold text-slate-900">Periksa koneksi backend</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Pastikan backend server sedang berjalan di port 8001 agar data dapat dimuat.
            </p>
          </aside>
        </section>
      </div>
    )
  }

  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {isLoading
          ? Array.from({ length: 5 }).map((_, index) => (
              <SkeletonLoader key={index} className="h-32 rounded-lg" />
            ))
          : metrics.map((metric) => (
              <DashboardStatCard key={metric.label} {...metric} />
            ))}
      </div>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)]">
        <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="inline-flex rounded-lg bg-indigo-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-indigo-700">
            Dashboard
          </p>

          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Ringkasan Perpustakaan
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
            Dashboard menampilkan ringkasan data penting perpustakaan termasuk kategori, penulis, penerbit,
            peminjaman, dan denda keterlambatan.
          </p>

          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {highlights.map((item) => (
              <li key={item.title} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <strong className="block text-sm font-semibold text-slate-900">{item.title}</strong>
                <span className="mt-2 block text-sm leading-6 text-slate-600">{item.description}</span>
              </li>
            ))}
          </ul>
        </article>

        <aside className="space-y-6">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 shadow-sm sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-600">
              Fitur
            </p>
            <h2 className="mt-4 text-lg font-semibold text-slate-900">Kelola Data</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Gunakan menu sidebar untuk mengakses semua modul pengelolaan: kategori, penulis, penerbit,
              peminjaman, dan denda.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Aktivitas Terbaru</h3>
            <p className="mt-2 text-sm text-slate-600">
              Lihat catatan terakhir dari semua modul dalam satu tempat.
            </p>
          </div>
        </aside>
      </section>

      <RecentRecords records={recentRecords} />
    </section>
  )
}