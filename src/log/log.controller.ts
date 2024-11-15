import { Controller, Get, UseGuards } from '@nestjs/common';
import { LogService } from './log.service';
import { AuthGuard } from '../auth/auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('log')
export class LogController {
    constructor(private readonly logService: LogService) {}

    @UseGuards(AuthGuard, AdminGuard)
    @Get() 
    @ApiOperation({ summary: 'Retrieve all system logs' })
    @ApiBearerAuth()
    @ApiResponse({
        status: 200,
        description: 'Successfully retrieved all logs.',
    })
    @ApiResponse({
        status: 403,
        description: 'Forbidden - User does not have the required permissions.',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - User is not authenticated.',
    })
    async getAllLogs() {
        return this.logService.getAllLogs();
    }
}
