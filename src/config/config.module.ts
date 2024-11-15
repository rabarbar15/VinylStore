import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { ConfigService } from './config.service';
// import { ConfigService as NestConfigService } from '@nestjs/config';

@Module({    
    imports: [
        NestConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env'
        }),
    ],
    providers: [ConfigService],
    exports: [ ConfigService],
})
export class ConfigModule {}
