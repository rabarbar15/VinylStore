import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Review } from '../../review/model/review.model';

@Table
export class User extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
      id: number;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
      email: string;

  @Column({ type: DataType.STRING, allowNull: false })
      firstName: string;

  @Column({ type: DataType.STRING })
      lastName: string;

  @Column({ type: DataType.STRING })
      avatar: string;

  @Column({ allowNull: false, defaultValue: 'user' })
      role: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
      googleId: string;

  @HasMany(() => Review)
      reviews: Review[];
}
