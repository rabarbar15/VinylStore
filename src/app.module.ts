import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VinylModule } from './vinyl/vinyl.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Vinyl } from './vinyl/models/vinyl.model/vinyl.model';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { DiscogsModule } from './discogs/discogs.module';
import { ReviewModule } from './review/review.module';
import { User } from './user/models/user.model';
import { Review } from './review/model/review.model';
import { Admin } from './auth/models/admin-user.model';
import { StripeModule } from './stripe/stripe.module';
import { Order } from './stripe/models/order.model';
import { LogModule } from './log/log.module';
import { EmailModule } from './email/email.module';
import { ConfigService } from './config/config.service';
import { ConfigModule } from './config/config.module';

@Module({
    imports: [
        ConfigModule,
        SequelizeModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                dialect: 'mysql',
                host: 'localhost',
                port: 3306,
                username: configService.databaseUsername, 
                password: configService.databasePassword,
                database: configService.databaseName,
                autoLoadModels: true,
                synchronize: true,
                models: [Vinyl, User, Review, Admin, Order],
            }),
            inject: [ConfigService],
        }),
        WinstonModule.forRoot({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp({
                    format: 'YYYY-MM-DD hh:mm:ss A',
                }),
                winston.format.printf(
                    (info) =>
                        `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`,
                ),
            ),
            transports: [
                new winston.transports.File({ filename: 'app.log' }),
                new winston.transports.Console(),
            ],
        }),
        VinylModule,
        AuthModule,
        UserModule,
        DiscogsModule,
        ReviewModule,
        StripeModule.forRootAsync(),
        LogModule,
        EmailModule,
        ConfigModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('');
    }
}
