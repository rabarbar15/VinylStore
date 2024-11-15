import { Module } from '@nestjs/common';
import { VinylController } from './vinyl.controller';
import { VinylService } from './vinyl.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Vinyl } from './models/vinyl.model/vinyl.model';
import { ReviewModule } from '../review/review.module';
import { AuthModule } from '../auth/auth.module';
import { UserService } from '../user/user.service';

@Module({
    imports: [AuthModule, SequelizeModule.forFeature([Vinyl]), ReviewModule],
    controllers: [VinylController],
    providers: [VinylService, UserService],
    exports: [VinylService, SequelizeModule]
})
export class VinylModule {}
