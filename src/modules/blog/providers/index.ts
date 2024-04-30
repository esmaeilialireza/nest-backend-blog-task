import { BLOG_POST_COMMENT_REPOSITORY, BLOG_POST_REPOSITORY } from 'shared';

import { BlogPost, BlogPostComment } from '../entity';

export const blogPostProviders = [
  {
    provide: BLOG_POST_REPOSITORY,
    useValue: BlogPost,
  },
  {
    provide: BLOG_POST_COMMENT_REPOSITORY,
    useValue: BlogPostComment,
  },
];
