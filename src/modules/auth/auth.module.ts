import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { AuthService } from './services';
import { AuthController } from './controllers';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

import { UsersModule } from '@app/modules/users';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [
    ConfigService,
    JwtService,
    AuthService,
    JwtStrategy,
    LocalStrategy,
  ],
})
export class AuthModule {}
