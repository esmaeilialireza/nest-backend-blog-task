import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from 'modules/auth';
import { User } from 'modules/users';
import { CurrentUser } from 'shared';

import { CreateBlogPostCommentDto } from '../dto';
import { BlogPostCommentService } from '../services';

@ApiTags('Blog Post')
@Controller('blog/comment')
@UseGuards(JwtAuthGuard)
export class BlogPostCommentController {
  constructor(private blogPostService: BlogPostCommentService) {}

  @Post(':postId')
  createComment(
    @Param('postId') postId: number,
    @Body() createBlogPostCommentDto: CreateBlogPostCommentDto,
    @CurrentUser() user: User,
  ) {
    return this.blogPostService.createPostComment({
      user,
      postId: postId,
      createBlogPostCommentDto,
    });
  }

  @Get(':postId')
  getPostComments(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Param('postId') postId: number,
  ) {
    return this.blogPostService.getPostComments({
      postId: postId,
      limit: limit,
      page: page,
    });
  }
}
