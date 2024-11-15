import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from '../../user/models/user.model';
import { Vinyl } from '../../vinyl/models/vinyl.model/vinyl.model';


@Table({ tableName: 'Reviews' })
export class Review extends Model<Review> {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
        id: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
        authorId: number;
    
    @ForeignKey(() => Vinyl)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
        vinylId: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
        comment: string;

    @Column({type: DataType.INTEGER, allowNull: false})
        score: number;

    @BelongsTo(() => User)
        user: User;

    @BelongsTo(() => Vinyl)
        vinyl: Vinyl;
}