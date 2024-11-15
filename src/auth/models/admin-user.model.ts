
import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'Admin_users' })
export class Admin extends Model<Admin> {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
        id: number;

    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false,
    })
        email: string;
}