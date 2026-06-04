import axios from 'axios'

import { clearAuthSession, readAuthSession } from '@/features/auth/auth-storage'
import { queryClient } from '@/api/query-client'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

if (!apiBaseUrl) {
  throw new Error('VITE_API_BASE_URL is not defined')
}

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})

let isInterceptorsRegistered = false

export function setupApiInterceptors() {
  if (isInterceptorsRegistered) {
    return
  }

  apiClient.interceptors.request.use((config) => {
    const session = readAuthSession()

    if (session?.token) {
      config.headers.Authorization = `Bearer ${session.token}`
    }

    return config
  })

  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error?.response?.status === 401) {
        clearAuthSession()
        queryClient.clear()

        if (window.location.pathname !== '/login') {
          window.location.replace('/login')
        }
      }

      return Promise.reject(error)
    },
  )

  isInterceptorsRegistered = true
}