import { Module } from '@nestjs/common';
import { DiscogsService } from './discogs.service';
import { DiscogsController } from './discogs.controller';
import { VinylModule } from '../vinyl/vinyl.module';

@Module({
    imports: [VinylModule],
    providers: [DiscogsService],
    controllers: [DiscogsController]
})
export class DiscogsModule {}
