import { Injectable, Inject } from '@nestjs/common';

import { USER_REPOSITORY } from 'shared';

import { UserDto } from '../dto';
import { User } from '../entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
  ) {}

  async create(userDto: UserDto): Promise<User> {
    return await this.userRepository.create<User>(userDto);
  }

  async findOneByUsername(username: string): Promise<User> {
    return await this.userRepository.findOne<User>({
      where: { username },
    });
  }

  async findOneById(id: number): Promise<User> {
    return await this.userRepository.findOne<User>({ where: { id } });
  }
}
