import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';

import { LoginDto, SignupDto } from '../dto';
import { UsersService } from '@app/modules/users';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login({ password, username }: LoginDto) {
    const foundUser = await this.userService.findOneByUsername(username);

    if (!foundUser)
      throw new BadRequestException('There is no account with this username');

    const isPasswordCorrect = await bcrypt.compare(
      password,
      foundUser.password,
    );

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Credentials are not valid.');
    }

    const token = this.jwtService.sign(
      { id: foundUser.id },
      { secret: this.configService.get('JTW_SECRET') },
    );

    return {
      access_token: token,
    };
  }

  async signup({ password, username }: SignupDto) {
    try {
      const hashedPassword = await bcrypt.hash(password, 12);

      const createdUser = await this.userService.create({
        username,
        password: hashedPassword,
      });

      const token = this.jwtService.sign(
        { id: createdUser.id },
        { secret: this.configService.get('JTW_SECRET') },
      );

      return {
        access_token: token,
      };
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new BadRequestException('Username already taken');
      } else {
        throw new BadRequestException(error.errors[0].message);
      }
    }
  }

  async getUser(id: number) {
    return await this.userService.findOneById(id);
  }
}
