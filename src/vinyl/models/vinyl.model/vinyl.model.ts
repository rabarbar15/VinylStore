import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Review } from '../../../review/model/review.model';

@Table({ tableName: 'Vinyl_records' })
export class Vinyl extends Model<Vinyl> {
  @Column({
      type: DataType.INTEGER,
      autoIncrement: true,
      primaryKey: true,
  })
      id: number;

  @Column({
      type: DataType.STRING,
      allowNull: false,
  })
      title: string;

  @Column({
      type: DataType.STRING,
      allowNull: false,
  })
      author: string;

  @Column({
      type: DataType.TEXT,
  })
      description: string;

  @Column({
      type: DataType.DECIMAL(10, 2),
      allowNull: false,
  })
      price: number;

  @Column({
      type: DataType.STRING,
  })
      imageUrl: string;

  @HasMany(() => Review, {as : 'reviews'})
      reviews: Review[];
}
