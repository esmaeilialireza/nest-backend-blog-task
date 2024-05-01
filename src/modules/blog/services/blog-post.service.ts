import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

import { BLOG_POST_REPOSITORY } from '@app/shared';

import { CreateBlogPostDto, UpdateBlogPostDto } from '../dto';
import { BlogPost } from '../entity';
import { User } from '@app/modules/users';
import { ValidationError } from 'sequelize';

@Injectable()
export class BlogPostService {
  constructor(
    @Inject(BLOG_POST_REPOSITORY)
    private readonly blogPostRepository: typeof BlogPost,
  ) {}

  async createPost({
    createBlogPostDto,
    currentUser,
  }: {
    currentUser: User;
    createBlogPostDto: CreateBlogPostDto;
  }): Promise<BlogPost> {
    try {
      return await this.blogPostRepository.create<BlogPost>({
        ...createBlogPostDto,
        viewCount: 0,
        authorId: currentUser.id,
      });
    } catch (error) {
      throw new BadRequestException(
        error.errors.map((err) => ({ message: err.message })),
      );
    }
  }

  async getPosts({ limit = 10, page = 1 }: { page: number; limit: number }) {
    const offset = (page - 1) * limit;
    const result = await this.blogPostRepository.findAndCountAll({
      offset,
      limit,
      include: [{ model: User, attributes: { exclude: ['password'] } }],
    });

    return {
      results: result.rows,
      count: result.count,
    };
  }

  async updatePost({
    postId,
    updateBlogPostDto,
    currentUser,
  }: {
    postId: number;
    currentUser: User;
    updateBlogPostDto: UpdateBlogPostDto;
  }) {
    try {
      const [count, updatedPosts] = await this.blogPostRepository.update(
        {
          ...updateBlogPostDto,
          updatedAt: new Date(),
        },
        { where: { id: postId, authorId: currentUser.id }, returning: true },
      );
      if (count === 0) {
        throw new NotFoundException(`Post with id ${postId} not found`);
      }
      return updatedPosts;
    } catch (error) {
      if (error instanceof ValidationError) {
        // Handle validation errors
        const validationErrors = error.errors.map((err) => ({
          field: err.path,
          message: err.message,
        }));
        throw new BadRequestException({
          message: 'Validation error occurred',
          errors: validationErrors,
        });
      } else {
        // Handle other types of errors
        console.error('Unexpected error:', error);
        throw new InternalServerErrorException('An unexpected error occurred');
      }
    }
  }

  async deletePost({
    postId,
    currentUser,
  }: {
    postId: number;
    currentUser: User;
  }) {
    try {
      const deletedRows = await this.blogPostRepository.destroy({
        where: { id: postId, authorId: currentUser.id },
      });
      if (deletedRows === 0) {
        throw new NotFoundException(`Post with id ${postId} not found`);
      }
    } catch (error) {
      throw new BadRequestException(error.response);
    }
  }

  async getPost({ postId }: { postId: number }) {
    try {
      const post = await this.blogPostRepository.findByPk(postId);
      if (post) {
        post.viewCount += 1;
        await post.save();
        return post;
      }
    } catch (error) {
      throw new BadRequestException(error.response);
    }
  }
}
