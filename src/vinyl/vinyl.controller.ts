import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { Vinyl } from './models/vinyl.model/vinyl.model';
import { VinylService } from './vinyl.service';
import { CreateVinylDto } from './dto/create-vinyl.dto/create-vinyl.dto';
import { VinylPaginationDto } from './dto/fetch-vinyls.dto';
import { VinylResponseDto } from './dto/vinyl-response.dto';
import { AdminGuard } from '../auth/admin.guard';
import { AuthGuard } from '../auth/auth.guard';
import { UpdateVinylDto } from './dto/update-vinyl.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('vinyl')
export class VinylController {
    constructor(
        private readonly vinylService: VinylService,
    ) {}

    // I was confused about this one, because it shouldn't require authentication,
    // excluding current user's reviews at the same time, so I hardcoded an user's id.
    @Get()
    @ApiOperation({ summary: 'Get a list of vinyl records' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Limit of items per page' })
    @ApiResponse({ status: 200, description: 'Successfully fetched vinyl records', type: [VinylResponseDto] })
    @ApiResponse({ status: 404, description: 'No vinyl records found' })
    async getVinylList(@Query() vinylPaginationDto: VinylPaginationDto): Promise<VinylResponseDto[]> {
        return this.vinylService.getAllVinyls(vinylPaginationDto, 1 /* hardcoded user's id */);
    }

    @UseGuards(AuthGuard, AdminGuard)
    @Post()
    @ApiOperation({ summary: 'Create a new vinyl record' })
    @ApiBearerAuth()
    @ApiBody({ type: CreateVinylDto })
    @ApiResponse({ status: 201, description: 'Vinyl record created successfully', type: Vinyl })
    @ApiResponse({ status: 400, description: 'Invalid data provided' })
    @ApiResponse({ status: 401, description: 'Unauthorized access' })
    async createVinyl(@Body() createVinylDto: CreateVinylDto): Promise<Vinyl> {
        return this.vinylService.createVinyl(createVinylDto);
    }

    @UseGuards(AuthGuard, AdminGuard)
    @Patch(':id')
    @ApiOperation({ summary: 'Update a vinyl record' })
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Vinyl record updated successfully', type: Vinyl })
    @ApiResponse({ status: 400, description: 'Invalid data or vinyl not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized access' })
    async updateVinyl(@Param('id') id: number, @Body() updateVinylDto: UpdateVinylDto): Promise<Vinyl> {
        return this.vinylService.updateVinyl(id, updateVinylDto);
    }

    @UseGuards(AuthGuard)
    @Get('search')
    @ApiOperation({ summary: 'Search vinyl records by title, author, and sort options' })
    @ApiQuery({ name: 'title', required: false, type: String, description: 'Title of the vinyl' })
    @ApiQuery({ name: 'author', required: false, type: String, description: 'Author of the vinyl' })
    @ApiQuery({ name: 'sortBy', required: false, type: String, description: 'Field to sort by (e.g., title, price)' })
    @ApiQuery({ name: 'order', required: false, type: String, description: 'Sort order (ASC or DESC)', default: 'ASC' })
    @ApiResponse({ status: 200, description: 'Successfully fetched vinyl records', type: [VinylResponseDto] })
    @ApiResponse({ status: 404, description: 'No vinyls found matching search criteria' })
    async searchVinyls(
        @Query('title') title: string,
        @Query('author') author: string,
        @Query('sortBy') sortBy: string,
        @Query('order') order: string = 'ASC',
    ): Promise<VinylResponseDto[]> {
        return this.vinylService.searchVinyls(title, author, sortBy, order);
    }
}
