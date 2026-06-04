type DashboardStatCardProps = {
  label: string
  value: number
  hint: string
}

export function DashboardStatCard({ label, value, hint }: DashboardStatCardProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-600">{label}</p>
      <div className="mt-4 flex items-end justify-between gap-3">
        <span className="text-4xl font-semibold tracking-tight text-slate-900">{value}</span>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600">
          {hint}
        </span>
      </div>
    </article>
  )
}
