import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { Public } from '../../common/decorators/public.decorator'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { ok } from '../../common/result/api-response'
import { AuthenticatedUser } from '../../common/types/authenticated-user'
import { AuthService } from './auth.service'
import { AdminLoginDto } from './dto/admin-login.dto'
import { LoginDto } from './dto/login.dto'

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('auth/login')
  async login(@Body() dto: LoginDto) {
    return ok(await this.authService.login(dto))
  }

  @Public()
  @Post('admin/auth/login')
  async adminLogin(@Body() dto: AdminLoginDto) {
    return ok(await this.authService.adminLogin(dto))
  }

  @Get('auth/me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: AuthenticatedUser) {
    return ok(user)
  }
}
