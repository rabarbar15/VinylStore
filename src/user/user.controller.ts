import { Body, Controller, Delete, Get, Put, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileResponseDto } from './dto/profile-response.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('user')
export class UserController {
    constructor(
        private userService: UserService
    ) {}

    @UseGuards(AuthGuard)
    @Get('profile')
    @ApiOperation({ summary: 'Get user profile details' })
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'User profile retrieved successfully.', type: ProfileResponseDto })
    @ApiResponse({ status: 401, description: 'Unauthorized access' })
    getProfile(@Req() req): Promise<ProfileResponseDto> {
        return this.userService.getUserProfile(req.user.sub);
    }

    @UseGuards(AuthGuard)
    @Put('profile')
    @ApiOperation({ summary: 'Update user profile' })
    @ApiBearerAuth()
    @ApiBody({ type: UpdateProfileDto })
    @ApiResponse({ status: 200, description: 'User profile updated successfully.' })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    @ApiResponse({ status: 401, description: 'Unauthorized access' })
    updateProfile(
      @Req() req,
      @Body() profile: UpdateProfileDto,
    ): Promise<UpdateProfileDto> {
        return this.userService.updateUser(req.user.sub, profile);
    }

    @UseGuards(AuthGuard)
    @Delete('profile')
    @Delete('profile')
    @ApiOperation({ summary: 'Delete user profile' })
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'User profile deleted successfully.' })
    @ApiResponse({ status: 401, description: 'Unauthorized access' })
    deleteProfile(@Req() req): Promise<{message: string}> {
        return this.userService.deleteUser(req.user.sub);
    }
}
