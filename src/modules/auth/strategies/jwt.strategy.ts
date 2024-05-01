import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthService } from '../services/auth.service';

import { JwtTokenPayload } from '../interfaces';

import { User } from '@app/modules/users/entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JTW_SECRET'),
    });
  }

  async validate({ id }: JwtTokenPayload): Promise<User> {
    const admin = await this.authService.getUser(id);

    if (!admin) {
      throw new UnauthorizedException();
    }

    return admin;
  }
}
