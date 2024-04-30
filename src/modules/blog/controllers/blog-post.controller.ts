import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

import { CurrentUser } from 'shared';
import { JwtAuthGuard } from 'modules/auth';
import { User } from 'modules/users';

import { BlogPostService } from '../services';
import { CreateBlogPostDto, UpdateBlogPostDto } from '../dto';

@ApiTags('Blog Post')
@Controller('blog')
@UseGuards(JwtAuthGuard)
export class BlogPostController {
  constructor(private blogPostService: BlogPostService) {}

  @Post()
  createPost(
    @Body() createBlogPostDto: CreateBlogPostDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.blogPostService.createPost({ currentUser, createBlogPostDto });
  }

  @Get()
  getPosts(@Query('page') page: number, @Query('limit') limit: number) {
    return this.blogPostService.getPosts({
      page: page,
      limit: limit,
    });
  }

  @Put(':postId')
  updatePost(
    @Param('postId') postId: number,
    @Body() updateBlogPostDto: UpdateBlogPostDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.blogPostService.updatePost({
      currentUser,
      postId: postId,
      updateBlogPostDto,
    });
  }

  @Delete(':postId')
  deletePost(@Param('postId') postId: number, @CurrentUser() user: User) {
    return this.blogPostService.deletePost({
      currentUser: user,
      postId: postId,
    });
  }

  @Get(':postId')
  getPost(@Param('postId') postId: number) {
    return this.blogPostService.getPost({
      postId: postId,
    });
  }
}
