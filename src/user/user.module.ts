import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [SequelizeModule.forFeature([User]), forwardRef(() => AuthModule)],
    providers: [UserService],
    controllers: [UserController],
    exports: [UserService, SequelizeModule]
})
export class UserModule {}
