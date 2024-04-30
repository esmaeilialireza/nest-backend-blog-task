import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateBlogPostCommentDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  readonly text: string;
}
