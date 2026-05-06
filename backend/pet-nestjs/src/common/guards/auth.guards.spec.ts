import { ExecutionContext } from '@nestjs/common'
import { AdminGuard } from './admin.guard'
import { JwtAuthGuard } from './jwt-auth.guard'
import { AuthenticatedUser, RequestWithUser } from '../types/authenticated-user'

function contextWithUser(user?: AuthenticatedUser): ExecutionContext {
  const request: RequestWithUser = {
    user,
    headers: {},
  }

  return {
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  } as ExecutionContext
}

describe('auth guards', () => {
  it('rejects UserAuth requests without a token-derived user', () => {
    const guard = new JwtAuthGuard()

    expect(() => guard.canActivate(contextWithUser())).toThrow('UserAuth requires a verified user token')
  })

  it('allows UserAuth requests with a token-derived user', () => {
    const guard = new JwtAuthGuard()

    expect(
      guard.canActivate(
        contextWithUser({
          id: 'user-1',
          nickname: '测试用户',
          role: 'user',
          roles: ['user'],
        }),
      ),
    ).toBe(true)
  })

  it('rejects AdminAuth requests from non-admin users', () => {
    const guard = new AdminGuard()

    expect(() =>
      guard.canActivate(
        contextWithUser({
          id: 'user-1',
          nickname: '测试用户',
          role: 'user',
          roles: ['user'],
        }),
      ),
    ).toThrow('AdminAuth requires administrator permission')
  })

  it('allows AdminAuth requests from admin users', () => {
    const guard = new AdminGuard()

    expect(
      guard.canActivate(
        contextWithUser({
          id: 'admin-1',
          nickname: '管理员',
          role: 'admin',
          roles: ['admin'],
        }),
      ),
    ).toBe(true)
  })
})
