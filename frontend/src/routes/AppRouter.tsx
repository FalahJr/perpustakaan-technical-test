import { Navigate, Route, Routes } from 'react-router-dom'

import { DashboardHomePage } from '@/features/dashboard/pages/DashboardHomePage'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { CategoriesPage } from '@/features/categories/pages/CategoriesPage'
import { AuthorsPage } from '@/features/authors/pages/AuthorsPage'
import { PublishersPage } from '@/features/publishers/pages/PublishersPage'
import { BorrowingsPage } from '@/features/borrowings/pages/BorrowingsPage'
import { FinesPage } from '@/features/fines/pages/FinesPage'
import { AppLayout } from '@/layouts/AppLayout'
import { PublicLayout } from '@/layouts/PublicLayout'
import { ProtectedRoute } from '@/routes/ProtectedRoute'

export function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardHomePage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/authors" element={<AuthorsPage />} />
          <Route path="/publishers" element={<PublishersPage />} />
          <Route path="/borrowings" element={<BorrowingsPage />} />
          <Route path="/fines" element={<FinesPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  )
}