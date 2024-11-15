import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/models/user.model';
import { UserService } from '../user/user.service';
import { UserDetails } from 'src/types/types';
import { InjectModel } from '@nestjs/sequelize';
import { Admin } from './models/admin-user.model';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { AdminEmailDto } from './dto/admin-email.dto';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        @InjectModel(Admin) private adminModel: typeof Admin,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) {}

    createJwtToken(user: User): string {
        const payload = { sub: user.id, email: user.email };
        return this.jwtService.sign(payload);
    }

    async validateUser(details: UserDetails) {
        let user = await this.userService.findByEmail(details.email);
        if (user) {
            return user;
        }
        user = await this.userService.createUser({
            email: details.email,
            firstName: details.firstName,
            lastName: details.lastName,
            avatar: details.avatar,
            googleId: details.googleId,
        });

        const admin = await this.adminModel.findOne({ where: { email: details.email } });
        if (admin) {
            user.role = 'admin';
        } else {
            user.role = 'user';
        }

        await user.save();
        return user;
    }

    async addAdminEmail(adminEmailDto: AdminEmailDto): Promise<Admin> {
        console.log(adminEmailDto.email);
        
        const admin = await this.adminModel.create(adminEmailDto);
        const user = await this.userService.findByEmail(adminEmailDto.email);
        if (user) {
            user.role = 'admin';
            await user.save();
        }

        this.logger.info(`Admin with email ${adminEmailDto.email} created`);
        return admin;
    }
}