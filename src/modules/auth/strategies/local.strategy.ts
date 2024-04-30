import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { JwtTokenPayload } from '../interfaces';
import { AuthService } from '../services/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({});
  }

  async validate(validateUserDto: JwtTokenPayload) {
    try {
      return await this.authService.getUser(validateUserDto.id);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
