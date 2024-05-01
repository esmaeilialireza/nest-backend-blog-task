import { USER_REPOSITORY } from '@app/shared';

import { User } from '../entity';

export const usersProviders = [
  {
    provide: USER_REPOSITORY,
    useValue: User,
  },
];
