import { Clock3 } from 'lucide-react'

import { EmptyState } from '@/components/ui/EmptyState'
import type { DashboardRecord } from '@/features/dashboard/types'

type RecentRecordsProps = {
  records: DashboardRecord[]
}

export function RecentRecords({ records }: RecentRecordsProps) {
  if (records.length === 0) {
    return (
      <EmptyState
        title="Belum ada data terbaru"
        description="Dashboard akan menampilkan catatan terbaru setelah backend mengembalikan data."
        icon={<Clock3 className="h-6 w-6" />}
      />
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-5">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-600">
          Aktivitas
        </p>
        <h3 className="mt-2 text-xl font-semibold text-slate-900">Aktivitas Terbaru</h3>
      </div>

      <ul className="divide-y divide-slate-200">
        {records.map((record) => (
          <li key={record.id} className="flex flex-col gap-1 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">{record.title}</p>
              <p className="mt-1 text-sm text-slate-600">{record.subtitle}</p>
            </div>

            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-600">
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-slate-700">
                {record.type}
              </span>
              {record.createdAt ? <span>{new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(record.createdAt))}</span> : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
