import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'

interface RequestUser {
  role?: string
  roles?: string[]
}

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ user?: RequestUser }>()
    const user = request.user
    const isAdmin = user?.role === 'admin' || user?.roles?.includes('admin')

    if (isAdmin) {
      return true
    }

    throw new ForbiddenException('AdminAuth requires administrator permission')
  }
}
