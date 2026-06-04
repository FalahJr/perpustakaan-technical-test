import { Menu } from 'lucide-react'
import { useLocation } from 'react-router-dom'

import { useAuth } from '@/features/auth/auth-context'
import { navigationItems } from '@/layouts/layoutConfig'

type AppHeaderProps = {
  onMenuClick: () => void
}

function getPageMeta(pathname: string) {
  if (pathname === '/') {
    return {
      title: 'Dashboard',
      description: 'Overview aplikasi dan akses cepat ke seluruh modul.',
    }
  }

  const matchedItem = navigationItems.find((item) => item.href === pathname)

  return {
    title: matchedItem?.label ?? 'Library Admin',
    description: matchedItem?.description ?? 'Admin dashboard untuk fase berikutnya.',
  }
}

export function AppHeader({ onMenuClick }: AppHeaderProps) {
  const { pathname } = useLocation()
  const { session, logout } = useAuth()
  const pageMeta = getPageMeta(pathname)

  return (
    <header className="flex flex-col gap-4 border-b border-slate-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3 md:hidden">
        <button
          type="button"
          onClick={onMenuClick}
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-slate-300 bg-slate-100 text-slate-700 transition hover:bg-slate-200"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-600">
            Perpus
          </p>
          <h2 className="text-lg font-semibold text-slate-900">{pageMeta.title}</h2>
        </div>
      </div>

      <div className="hidden items-center justify-between gap-4 md:flex">
        <div>
          <p className="text-sm font-medium text-slate-600">{pageMeta.description}</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
            {pageMeta.title}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {session ? (
            <div className="hidden text-right lg:block">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Signed in</p>
              <p className="mt-1 text-sm font-medium text-slate-900">{session.username}</p>
            </div>
          ) : null}

          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200 hover:text-slate-900"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}