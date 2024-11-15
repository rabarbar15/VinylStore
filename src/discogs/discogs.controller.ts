import { Controller, Get, Query } from '@nestjs/common';
import { DiscogsService } from './discogs.service';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('discogs')
export class DiscogsController {
    constructor(
        private readonly discogsService: DiscogsService,
    ) {}

    @Get('search')
    @ApiOperation({ summary: 'Search for vinyl records by artist on Discogs' })
    @ApiQuery({
        name: 'artist',
        required: true,
        type: String,
    })
    @ApiQuery({
        name: 'perPage',
        required: true,
        type: String,
        description: 'The number of records to return per page.',
    })
    @ApiResponse({
        status: 200,
        description: 'Returns the list of vinyl records matching the search query.',
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - Invalid query parameters.',
    })
    async searchDiscogs(
        @Query('artist') artist: string,
        @Query('perPage') perPage: string,  
    ) {
        return this.discogsService.searchDiscogs(artist, Number(perPage));
    }

    @Get('migrate')
    @ApiOperation({ summary: 'Migrate vinyl records based on a Discogs query' })
    @ApiResponse({
        status: 200,
        description: 'Returns a success message when vinyls are migrated.',
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - Invalid parameters for migration.',
    })
    async migrateVinyls() {
        return this.discogsService.migrateVinyls('artist=u2');
    }
}
