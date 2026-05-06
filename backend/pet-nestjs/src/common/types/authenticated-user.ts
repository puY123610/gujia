export type AuthRole = 'user' | 'admin'

export interface AuthenticatedUser {
  id: string
  nickname: string
  role: AuthRole
  roles: AuthRole[]
}

export interface RequestWithUser {
  user?: AuthenticatedUser
  headers: {
    authorization?: string
  }
}
