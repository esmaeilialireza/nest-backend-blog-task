import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { CurrentUser } from 'shared';
import { JwtAuthGuard } from 'modules/auth';

import { BlogPostService } from '../services';
import { CreateBlogPostDto } from '../dto';
import { User } from 'modules/users';

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
    // return this.blogPostService.create(createBlogPostDto);
    return '';
  }
}
