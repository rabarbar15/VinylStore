import { Module } from '@nestjs/common';
import { LogService } from './log.service';
import { LogController } from './log.controller';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';

@Module({
    imports: [AuthModule, UserModule],
    providers: [LogService],
    controllers: [LogController]
})
export class LogModule {}
