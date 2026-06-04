import { createContext, useContext, useEffect, useMemo, useState } from 'react'

import { queryClient } from '@/api/query-client'
import { clearAuthSession, readAuthSession, writeAuthSession } from '@/features/auth/auth-storage'
import type { AuthSession } from '@/features/auth/types'

type AuthContextValue = {
  session: AuthSession | null
  isAuthenticated: boolean
  login: (session: AuthSession) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(() => readAuthSession())

  useEffect(() => {
    const handleStorageChange = () => {
      setSession(readAuthSession())
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const login = (nextSession: AuthSession) => {
    writeAuthSession(nextSession)
    setSession(nextSession)
  }

  const logout = () => {
    clearAuthSession()
    queryClient.clear()
    setSession(null)
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isAuthenticated: Boolean(session?.token),
      login,
      logout,
    }),
    [session],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
