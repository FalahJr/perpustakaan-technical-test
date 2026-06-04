import { Search } from 'lucide-react'

import { Input } from '@/components/ui/Input'

type SearchInputProps = React.InputHTMLAttributes<HTMLInputElement>

export function SearchInput(props: SearchInputProps) {
  return (
    <label className="relative block">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <Input {...props} className="pl-11" placeholder={props.placeholder ?? 'Cari data...'} />
    </label>
  )
}
