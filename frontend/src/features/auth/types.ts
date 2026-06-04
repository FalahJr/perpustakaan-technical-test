export type AuthSession = {
  username: string
  token: string
  refreshToken: string
}

export type LoginPayload = {
  username: string
  password: string
}

export type LoginResult = {
  username: string
  token: string
  refreshToken: string
}
