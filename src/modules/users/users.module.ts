import { Module } from '@nestjs/common';

import { usersProviders } from './providers';
import { UsersService } from './services';

@Module({
  providers: [UsersService, ...usersProviders],
  exports: [UsersService],
})
export class UsersModule {}
