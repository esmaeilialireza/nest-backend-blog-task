import { Module } from '@nestjs/common';

import { blogPostProviders } from './providers';
import { BlogPostCommentService, BlogPostService } from './services';
import { BlogPostCommentController, BlogPostController } from './controllers';

@Module({
  controllers: [BlogPostController, BlogPostCommentController],
  providers: [...blogPostProviders, BlogPostService, BlogPostCommentService],
  exports: [BlogPostService, BlogPostCommentService],
})
export class BlogPostModule {}
