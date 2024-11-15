import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table
export class Order extends Model<Order> {
  @Column({
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
  })
      id: number;

  @Column({
      type: DataType.INTEGER,
      allowNull: false,
  })
      userId: number; 

  @Column({
      type: DataType.INTEGER,
      allowNull: false,
  })
      vinylId: number;

  @Column({
      type: DataType.DECIMAL(10, 2),
      allowNull: false,
  })
      price: number; 

  @Column({
      type: DataType.STRING,
      allowNull: false,
  })
      paymentIntentId: string;
}