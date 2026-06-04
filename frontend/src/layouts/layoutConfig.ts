import type { LucideIcon } from 'lucide-react'
import { BookOpen, Home, ReceiptText, ShieldUser, LibraryBig, ScrollText, Tags } from 'lucide-react'

export type NavigationItem = {
  label: string
  href: string
  icon: LucideIcon
  description: string
}

export const navigationItems: NavigationItem[] = [
  {
    label: 'Dashboard',
    href: '/',
    icon: Home,
    description: 'Ringkasan sistem dan statistik utama.',
  },
  {
    label: 'Categories',
    href: '/categories',
    icon: Tags,
    description: 'Kelola jenis buku.',
  },
  {
    label: 'Authors',
    href: '/authors',
    icon: ShieldUser,
    description: 'Kelola penulis buku.',
  },
  {
    label: 'Publishers',
    href: '/publishers',
    icon: LibraryBig,
    description: 'Kelola penerbit buku.',
  },
  {
    label: 'Borrowings',
    href: '/borrowings',
    icon: ScrollText,
    description: 'Kelola transaksi peminjaman.',
  },
  {
    label: 'Fines',
    href: '/fines',
    icon: ReceiptText,
    description: 'Kelola denda keterlambatan.',
  },
]

export const accountItems: NavigationItem[] = [
  {
    label: 'Public Books',
    href: '/login',
    icon: BookOpen,
    description: 'Akses area publik yang akan dilanjutkan di phase berikutnya.',
  },
]