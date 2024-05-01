import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

import { blogPostProviders } from './providers';
import {
  BlogPostCommentService,
  BlogPostService,
  MailerService,
} from './services';
import { BlogPostCommentController, BlogPostController } from './controllers';
import { MAIL_QUEUE } from '@app/shared';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    }),
    BullModule.registerQueue({
      name: MAIL_QUEUE,
    }),
  ],
  controllers: [BlogPostController, BlogPostCommentController],
  providers: [
    ...blogPostProviders,
    BlogPostService,
    BlogPostCommentService,
    MailerService,
  ],
  exports: [BlogPostService, BlogPostCommentService],
})
export class BlogPostModule {}
