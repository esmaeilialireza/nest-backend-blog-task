import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

import { BLOG_POST_REPOSITORY } from 'shared';

import { CreateBlogPostDto, UpdateBlogPostDto } from '../dto';
import { BlogPost } from '../entity';
import { User } from 'modules/users';
import { ValidationError } from 'sequelize';

@Injectable()
export class BlogPostService {
  constructor(
    @Inject(BLOG_POST_REPOSITORY)
    private readonly blogPostRepository: typeof BlogPost,
  ) {}

  async createPost(
    user: User,
    createBlogPostDto: CreateBlogPostDto,
  ): Promise<BlogPost> {
    return await this.blogPostRepository.create<BlogPost>({
      ...createBlogPostDto,
      userId: user.dataValues.id,
    });
  }

  async getPosts({
    limit = 10,
    page = 1,
    user,
  }: {
    user: User;
    page: number;
    limit: number;
  }) {
    console.log({ xx: user.dataValues.id });

    const offset = (page - 1) * limit;
    const result = await this.blogPostRepository.findAndCountAll({
      offset,
      limit,
      where: {
        userId: user.dataValues.id,
      },
    });

    return {
      results: result.rows,
      count: result.count,
    };
  }

  async updatePost({
    id,
    updateBlogPostDto,
    user,
  }: {
    id: number;
    user: User;
    updateBlogPostDto: UpdateBlogPostDto;
  }) {
    try {
      const [count, updatedPosts] = await this.blogPostRepository.update(
        {
          ...updateBlogPostDto,
          updatedAt: new Date(),
        },
        { where: { id, userId: user.dataValues.id }, returning: true },
      );
      if (count === 0) {
        throw new NotFoundException(`Post with id ${id} not found`);
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

  async deletePost({ id, user }: { id: number; user: User }) {
    try {
      const deletedRows = await this.blogPostRepository.destroy({
        where: { id, userId: user.dataValues.id },
      });
      if (deletedRows === 0) {
        throw new NotFoundException(`Post with id ${id} not found`);
      }
    } catch (error) {
      throw new BadRequestException(error.response);
    }
  }
}
