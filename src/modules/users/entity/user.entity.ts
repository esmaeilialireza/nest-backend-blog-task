import { BlogPost } from 'modules/blog/entity';
import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';

@Table
export class User extends Model<User> {
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  username: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @HasMany(() => BlogPost)
  posts: BlogPost[];
}
