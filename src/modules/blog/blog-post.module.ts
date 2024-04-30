import { Module } from '@nestjs/common';

import { blogPostProviders } from './providers';
import { BlogPostService } from './services';
import { BlogPostController } from './controllers';

@Module({
  controllers: [BlogPostController],
  providers: [BlogPostService, ...blogPostProviders],
  exports: [BlogPostService],
})
export class BlogPostModule {}
