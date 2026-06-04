import { TriangleAlert } from 'lucide-react'

import { Button } from '@/components/ui/Button'

type ErrorStateProps = {
  title: string
  description: string
  onRetry?: () => void
}

export function ErrorState({ title, description, onRetry }: ErrorStateProps) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
      <div className="mb-4 flex justify-center text-red-600">
        <TriangleAlert className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-semibold text-red-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-red-700">{description}</p>
      {onRetry ? (
        <Button className="mt-6" variant="secondary" onClick={onRetry}>
          Coba lagi
        </Button>
      ) : null}
    </div>
  )
}
