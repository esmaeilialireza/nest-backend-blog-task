import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class BlogPost extends Model<BlogPost> {
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
}
