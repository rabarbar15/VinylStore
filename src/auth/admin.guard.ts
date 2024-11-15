import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(
        private readonly userService: UserService,
    ) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const userId = request.user.sub;

        const user = await this.userService.findById(userId);

        if (!user) {
            throw new UnauthorizedException('User not authenticated');
        }

        if (user.role !== 'admin') {
            throw new UnauthorizedException('Access denied. Admins only.');
        }

        return true;
    }
}
