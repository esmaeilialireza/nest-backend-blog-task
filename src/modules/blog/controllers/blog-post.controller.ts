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
    @CurrentUser() user: User,
  ) {
    return this.blogPostService.createPost(user, createBlogPostDto);
  }

  @Get()
  getPosts(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @CurrentUser() user: User,
  ) {
    return this.blogPostService.getPosts({ user, page, limit });
  }

  @Put(':id')
  updatePost(
    @Param('id') id: number,
    @Body() updateBlogPostDto: UpdateBlogPostDto,
    @CurrentUser() user: User,
  ) {
    return this.blogPostService.updatePost({
      user,
      id: Number(id),
      updateBlogPostDto,
    });
  }

  @Delete(':id')
  deletePost(@Param('id') id: number, @CurrentUser() user: User) {
    return this.blogPostService.deletePost({
      user,
      id: Number(id),
    });
  }
}
