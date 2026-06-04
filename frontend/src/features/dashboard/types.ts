export type DashboardRecordType = 'Categories' | 'Authors' | 'Publishers' | 'Borrowings' | 'Fines'

export type DashboardRecord = {
  id: string
  type: DashboardRecordType
  title: string
  subtitle: string
  createdAt?: string
}

export type DashboardMetric = {
  label: string
  value: number
  hint: string
}
