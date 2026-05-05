import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ user?: unknown }>()

    if (request.user) {
      return true
    }

    throw new UnauthorizedException('UserAuth requires a verified user token')
  }
}
