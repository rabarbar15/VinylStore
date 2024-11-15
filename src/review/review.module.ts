import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Review } from './model/review.model';
import { User } from '../user/models/user.model';
import { Vinyl } from '../vinyl/models/vinyl.model/vinyl.model';
import { AuthModule } from '../auth/auth.module';
import { UserService } from '../user/user.service';

@Module({
    imports: [AuthModule, SequelizeModule.forFeature([Review, User, Vinyl])],
    providers: [ReviewService, UserService],
    controllers: [ReviewController],
    exports: [SequelizeModule]
})
export class ReviewModule {}
