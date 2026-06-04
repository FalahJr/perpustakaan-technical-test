import { cn } from '@/utils/cn'

type SkeletonLoaderProps = {
  className?: string
}

export function SkeletonLoader({ className }: SkeletonLoaderProps) {
  return <div className={cn('animate-pulse rounded-lg bg-slate-200', className)} />
}
