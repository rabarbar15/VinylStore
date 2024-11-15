import { Body, Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { AdminEmailDto } from './dto/admin-email.dto';
import { AdminGuard } from './admin.guard';
import { AuthGuard as AuthGuardPassport} from '@nestjs/passport';
import { AuthGuard } from './auth.guard';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';


@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private userService: UserService,
    ) {}

    @Get('google')
    @UseGuards(AuthGuardPassport('google'))
    @ApiOperation({ summary: 'Google OAuth authentication' })
    @ApiResponse({ status: 200, description: 'Redirect to Google OAuth login' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async googleAuth() {}

    @Get('google/redirect')
    @UseGuards(AuthGuardPassport('google'))
    @ApiOperation({ summary: 'Google OAuth redirect after successful authentication' })
    @ApiResponse({ status: 200, description: 'User authenticated and JWT token generated' })
    @ApiResponse({ status: 404, description: 'User not found and created' })
    async googleAuthRedirect(@Req() req) {
        const { email, firstName, lastName, avatar, googleId} = req.user;
        
        let user = await this.userService.finByGoogleId(googleId);
        if (!user) {
            user = await this.userService.createUser({
                email,
                firstName,
                lastName,
                avatar,
                googleId,
            });
        } else {
            await this.userService.updateUser(user.id, {
                firstName,
                lastName,
                avatar,
            });
        }
        
        const token = this.authService.createJwtToken(user);
        return {token, user};
    }

    @UseGuards(AuthGuard, AdminGuard)
    @Get('create-admin')
    @ApiOperation({ summary: 'Create a new admin user' })
    @ApiBody({ type: AdminEmailDto })
    @ApiResponse({ status: 200, description: 'Admin user created successfully' })
    @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
    async createAdmin(@Body() emailDto: AdminEmailDto) {
        return this.authService.addAdminEmail(emailDto);
    }
}
