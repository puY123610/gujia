import { Injectable, NestMiddleware } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RequestWithUser } from '../../common/types/authenticated-user'

@Injectable()
export class AuthTokenMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: RequestWithUser, _res: unknown, next: () => void) {
    const token = this.readBearerToken(req.headers.authorization)

    if (token) {
      try {
        req.user = await this.authService.verifyToken(token)
      } catch {
        req.user = undefined
      }
    }

    next()
  }

  private readBearerToken(authorization?: string) {
    if (!authorization) return undefined

    const [scheme, token] = authorization.split(' ')
    if (scheme !== 'Bearer' || !token) return undefined

    return token
  }
}
