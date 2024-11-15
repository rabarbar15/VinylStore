import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategyService } from './google-strategy/google-strategy.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { Admin } from './models/admin-user.model';

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '10h' },
            }),
        }),
        SequelizeModule.forFeature([Admin]),
        PassportModule, 
        ConfigModule, 
        forwardRef(() => UserModule),
    ],
    controllers: [AuthController],
    providers: [AuthService, GoogleStrategyService],
    exports: [JwtModule]
})
export class AuthModule {}
