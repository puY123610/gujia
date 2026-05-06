import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { AuthTokenMiddleware } from './auth-token.middleware'

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, AuthTokenMiddleware],
  exports: [AuthService, AuthTokenMiddleware],
})
export class AuthModule {}
