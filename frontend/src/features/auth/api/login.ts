import { apiClient } from '@/api/axios'
import type { LoginPayload, LoginResult } from '@/features/auth/types'

type LoginResponse = {
  error: boolean
  msg: string
  data: {
    username: string
    token: string
    refresh_token: string
  }
}

export async function login(payload: LoginPayload): Promise<LoginResult> {
  const response = await apiClient.post<LoginResponse>('/login', payload)

  return {
    username: response.data.data.username,
    token: response.data.data.token,
    refreshToken: response.data.data.refresh_token,
  }
}
