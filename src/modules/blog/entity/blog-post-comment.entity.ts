import { User } from 'modules/users';
import { BlogPost } from 'modules/blog/entity';
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';

@Table
export class BlogPostComment extends Model<BlogPostComment> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  text: string;

  @Column({
    type: DataType.DATE(),
    allowNull: false,
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE(),
    allowNull: true,
  })
  updatedAt: Date;

  @ForeignKey(() => BlogPost)
  @Column({
    allowNull: false,
  })
  postId: number;

  @BelongsTo(() => BlogPost)
  post: BlogPost;

  @ForeignKey(() => User)
  @Column({
    allowNull: false,
  })
  commenterId: number;

  @BelongsTo(() => User)
  commenter: User;
}
