import { Outlet } from 'react-router-dom'

export function PublicLayout() {
  return (
    <main className="min-h-screen bg-white px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-7xl items-center justify-center">
        <Outlet />
      </div>
    </main>
  )
}