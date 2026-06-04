import type { ReactNode } from 'react'

import { EmptyState } from '@/components/ui/EmptyState'

export type TableColumn<T> = {
  header: ReactNode
  cell: (item: T) => ReactNode
  className?: string
}

type DataTableProps<T> = {
  data: T[]
  columns: TableColumn<T>[]
  getRowKey: (item: T, index: number) => string
  emptyTitle: string
  emptyDescription: string
}

export function DataTable<T>({ data, columns, getRowKey, emptyTitle, emptyDescription }: DataTableProps<T>) {
  if (data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left">
          <thead className="bg-slate-50 text-xs uppercase tracking-[0.2em] text-slate-600">
            <tr>
              {columns.map((column, index) => (
                <th key={index} className="px-6 py-4 font-semibold first:pl-6 last:pr-6">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {data.map((item, index) => (
              <tr key={getRowKey(item, index)} className="transition hover:bg-slate-50">
                {columns.map((column, columnIndex) => (
                  <td
                    key={columnIndex}
                    className={`px-6 py-4 align-top text-sm text-slate-700 first:pl-6 last:pr-6 ${column.className ?? ''}`}
                  >
                    {column.cell(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
