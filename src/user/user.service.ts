import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileResponseDto } from './dto/profile-response.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Review } from '../review/model/review.model';

@Injectable()
export class UserService {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        @InjectModel(User)
        private userModel: typeof User
    ) {}

    async findById(id: number): Promise<User> {
        return this.userModel.findByPk(id);
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({ where: { email } });
    }

    async finByGoogleId(googleId: string): Promise<User | null> {
        return this.userModel.findOne({ where: { googleId } });
    }

    async createUser(data: Partial<User>): Promise<User> {
        try {
            const user = await this.userModel.create(data);
            this.logger.info(`User with email ${user.email} created`);
            return user;
        } catch (error) {
            this.logger.error(`Error creating user: ${error.message}`);
            throw error;
        }
    }

    async getUserProfile(id: number): Promise<ProfileResponseDto> {
        const user = await this.userModel.findOne({
            where: { id },
            attributes: ['firstName', 'lastName', 'avatar'],
            include: [
                {
                    model: Review,
                    as: 'reviews',
                    attributes: ['vinylId', 'score', 'comment'],
                    order: [['createdAt', 'DESC']],
                }
            ],
        });
        console.log(user);
        

        if (!user) {
            this.logger.error(`User with id ${id} not found`);
            throw new NotFoundException('User not found');
        }

        this.logger.info(`Fetching profile for user with id ${id}`);

        return {
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: user.avatar,
            reviews: user.reviews.map(review => ({
                vinylId: review.vinylId,
                comment: review.comment,
                score: review.score,
            })),
        };
    }

    async updateUser(id: number, data: UpdateProfileDto): Promise<UpdateProfileDto> {
        const user = await this.userModel.findByPk(id);

        if (!user) {
            this.logger.error(`User with id ${id} not found`);
            throw new NotFoundException('User not found');
        }

        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.avatar = data.avatar;

        await user.save();

        this.logger.info(`Profile updated for user with id ${id}`);

        return {firstName: user.firstName, lastName: user.lastName, avatar: user.avatar};   
    }

    async deleteUser(id: number): Promise<{message: string}> {
        const user = await this.userModel.findByPk(id);

        if (!user) {
            this.logger.error(`User with id ${id} not found`);
            throw new NotFoundException('User not found');
        }

        await user.destroy();

        this.logger.info(`User with id ${id} deleted`);

        return {message: `User with id ${id} deleted`};
    }
}

