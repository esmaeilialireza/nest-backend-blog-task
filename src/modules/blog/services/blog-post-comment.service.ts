import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

import {
  BLOG_POST_COMMENT_REPOSITORY,
  BLOG_POST_REPOSITORY,
  MAIL_JOB,
  MAIL_QUEUE,
} from 'shared';

import { CreateBlogPostCommentDto } from '../dto';
import { BlogPost, BlogPostComment } from '../entity';
import { User } from 'modules/users';

@Injectable()
export class BlogPostCommentService {
  constructor(
    @Inject(BLOG_POST_COMMENT_REPOSITORY)
    private readonly blogPostCommentRepository: typeof BlogPostComment,
    @Inject(BLOG_POST_REPOSITORY)
    private readonly blogPostRepository: typeof BlogPost,
    @InjectQueue(MAIL_QUEUE) private mailQueue: Queue,
  ) {}

  async createPostComment({
    createBlogPostCommentDto,
    currentUser,
    postId,
  }: {
    currentUser: User;
    postId: number;
    createBlogPostCommentDto: CreateBlogPostCommentDto;
  }): Promise<BlogPostComment> {
    try {
      const comment =
        await this.blogPostCommentRepository.create<BlogPostComment>({
          ...createBlogPostCommentDto,
          postId,
          commenterId: currentUser.id,
        });

      const authorId = (await this.blogPostRepository.findByPk(postId))
        .dataValues.authorId;

      await this.mailQueue.add(MAIL_JOB, {
        authorId,
      });

      return comment;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getPostComments({
    postId,
    limit = 10,
    page = 1,
  }: {
    postId: number;
    page: number;
    limit: number;
  }) {
    try {
      const offset = (page - 1) * limit;

      const result =
        await this.blogPostCommentRepository.findAndCountAll<BlogPostComment>({
          where: { postId },
          offset,
          limit,
          include: [
            {
              model: User,
              attributes: { exclude: ['password'] },
            },
          ],
        });

      return {
        results: result.rows,
        count: result.count,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
