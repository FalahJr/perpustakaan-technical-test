import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { AppHeader } from '@/layouts/AppHeader'
import { AppSidebar } from '@/layouts/AppSidebar'

export function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    setIsSidebarOpen(false)
  }, [pathname])

  return (
    <div className="min-h-screen bg-white text-slate-900 md:flex">
      <AppSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="min-h-screen flex-1 md:flex md:flex-col">
        <AppHeader onMenuClick={() => setIsSidebarOpen((current) => !current)} />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}