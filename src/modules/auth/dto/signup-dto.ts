import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SignupDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  readonly password: string;
}
