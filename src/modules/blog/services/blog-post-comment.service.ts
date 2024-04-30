import { Injectable, Inject, BadRequestException } from '@nestjs/common';

import { BLOG_POST_COMMENT_REPOSITORY } from 'shared';

import { CreateBlogPostCommentDto } from '../dto';
import { BlogPostComment } from '../entity';
import { User } from 'modules/users';

@Injectable()
export class BlogPostCommentService {
  constructor(
    @Inject(BLOG_POST_COMMENT_REPOSITORY)
    private readonly blogPostCommentRepository: typeof BlogPostComment,
  ) {}

  async createPostComment({
    createBlogPostCommentDto,
    user,
    postId,
  }: {
    user: User;
    postId: number;
    createBlogPostCommentDto: CreateBlogPostCommentDto;
  }): Promise<BlogPostComment> {
    try {
      return await this.blogPostCommentRepository.create<BlogPostComment>({
        ...createBlogPostCommentDto,
        postId,
        userId: user.id,
      });
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
