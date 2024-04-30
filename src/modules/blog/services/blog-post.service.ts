import { Injectable, Inject } from '@nestjs/common';

import { BLOG_POST_REPOSITORY } from 'shared';

import { CreateBlogPostDto } from '../dto';
import { BlogPost } from '../entity';

@Injectable()
export class BlogPostService {
  constructor(
    @Inject(BLOG_POST_REPOSITORY)
    private readonly blogPostRepository: typeof BlogPost,
  ) {}

  async create(blogPostDto: CreateBlogPostDto): Promise<BlogPost> {
    return await this.blogPostRepository.create<BlogPost>(blogPostDto);
  }
}
