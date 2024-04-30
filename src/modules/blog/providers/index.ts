import { BLOG_POST_REPOSITORY } from 'shared';

import { BlogPost } from '../entity';

export const blogPostProviders = [
  {
    provide: BLOG_POST_REPOSITORY,
    useValue: BlogPost,
  },
];
