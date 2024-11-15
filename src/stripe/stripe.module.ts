import { DynamicModule, Module } from '@nestjs/common';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Order } from './models/order.model';
import { AuthModule } from '../auth/auth.module';
import { VinylService } from '../vinyl/vinyl.service';
import { VinylModule } from '../vinyl/vinyl.module';
import { EmailService } from '../email/email.service';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';

@Module({})
export class StripeModule {

    static forRootAsync(): DynamicModule {
        return {
            module: StripeModule,
            controllers: [StripeController],
            imports: [ConfigModule.forRoot(), SequelizeModule.forFeature([Order]), AuthModule, VinylModule, UserModule],
            providers: [
                StripeService,
                VinylService,
                EmailService,
                UserService,
            ],
        };
    }
}