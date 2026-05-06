import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { RequestWithUser } from '../types/authenticated-user'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>()

    if (request.user) {
      return true
    }

    throw new UnauthorizedException('UserAuth requires a verified user token')
  }
}
