import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Vinyl } from '../vinyl/models/vinyl.model/vinyl.model';
import { VinylService } from '../vinyl/vinyl.service';
import { Logger } from 'winston';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DiscogsService {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        private readonly vinylService: VinylService,
        private readonly configService: ConfigService
    ) {}

    private readonly discogsBaseUrl = 'https://api.discogs.com';
    private readonly discogsApiKey = this.configService.get<string>('DISCOGS_API_KEY');
    private readonly discogsApiSecret = this.configService.get<string>('DISCOGS_API_SECRET');

    async searchDiscogs(query: string, per_page: number) {
        console.log(per_page);
        
        try {
            const response = await axios.get(`${this.discogsBaseUrl}/database/search`, {
                params: {
                    q: query,
                    per_page: per_page
                },
                headers: {
                    'Authorization': `Discogs key=${this.discogsApiKey}, secret=${this.discogsApiSecret}`,
                }
            });

            return response.data;
        } catch (error) {
            this.logger.error(`Error searching Discogs: ${error.message}`);
            throw error;
        }
    }

    async migrateVinyls(query: string): Promise<{message: string}> {
        const response = await this.searchDiscogs(query, 20);
        
        for (const item of response.results) {
            const vinyl = new Vinyl();
            vinyl.title = item.title.split(' - ')[1];
            vinyl.author = item.title.split(' - ')[0];
            vinyl.description = `Year: ${item.year}, Genre: ${item.genre[0]}`;
            vinyl.price = Math.floor(Math.random() * 70) + 1;
            vinyl.imageUrl = item.cover_image;
            this.logger.info(`Vinyl ${vinyl.title} created`);
            
            await this.vinylService.createVinyl(vinyl.dataValues);
        }

        return {message: 'Vinyls migrated successfully'};
    }
}
