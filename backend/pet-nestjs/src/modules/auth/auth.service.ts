import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { AuthenticatedUser, AuthRole } from '../../common/types/authenticated-user'
import { AdminLoginDto } from './dto/admin-login.dto'
import { LoginDto } from './dto/login.dto'

interface TokenPayload {
  sub: string
  nickname: string
  role: AuthRole
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(dto: LoginDto) {
    const user: AuthenticatedUser = {
      id: `dev-user-${dto.phone}`,
      nickname: `用户${dto.phone.slice(-4)}`,
      role: 'user',
      roles: ['user'],
    }

    return this.issueToken(user)
  }

  async adminLogin(dto: AdminLoginDto) {
    const user: AuthenticatedUser = {
      id: `dev-admin-${dto.username}`,
      nickname: dto.username,
      role: 'admin',
      roles: ['admin'],
    }

    return this.issueToken(user)
  }

  async verifyToken(token: string): Promise<AuthenticatedUser> {
    try {
      const payload = await this.jwtService.verifyAsync<TokenPayload>(token, {
        secret: this.jwtSecret,
      })

      return {
        id: payload.sub,
        nickname: payload.nickname,
        role: payload.role,
        roles: [payload.role],
      }
    } catch {
      throw new UnauthorizedException('Token is invalid or expired')
    }
  }

  private async issueToken(user: AuthenticatedUser) {
    const payload: TokenPayload = {
      sub: user.id,
      nickname: user.nickname,
      role: user.role,
    }
    const token = await this.jwtService.signAsync(payload, {
      secret: this.jwtSecret,
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN') || '7d',
    })

    return {
      token,
      user,
    }
  }

  private get jwtSecret() {
    return this.configService.get<string>('JWT_SECRET') || 'dev_only_replace_before_production'
  }
}
