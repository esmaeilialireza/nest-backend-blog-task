import { USER_REPOSITORY } from 'shared';

import { User } from '../entity';

export const usersProviders = [
  {
    provide: USER_REPOSITORY,
    useValue: User,
  },
];
