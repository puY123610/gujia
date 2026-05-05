import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'

@Injectable()
export class OptionalAuthGuard implements CanActivate {
  canActivate(_context: ExecutionContext): boolean {
    // Public endpoints stay accessible. Token parsing can be added by the auth module later.
    return true
  }
}
