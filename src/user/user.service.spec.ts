import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Review } from '../review/model/review.model';
import { NotFoundException } from '@nestjs/common';

describe('UserService', () => {
    let userService: UserService;

    const mockUserData = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        avatar: 'avatar_url',
    };
    
    const mockUserModel = {
        findByPk: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        destroy: jest.fn(),
    };

    const mockLogger = {
        info: jest.fn(),
        error: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                { provide: WINSTON_MODULE_PROVIDER, useValue: mockLogger },
                { provide: 'UserRepository', useValue: mockUserModel },
            ],
        }).compile();

        userService = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(userService).toBeDefined();
    });

    describe('getUserProfile', () => {
        it('should return the user profile if user exists', async () => {
            const mockProfile = {
                firstName: 'John',
                lastName: 'Doe',
                avatar: 'avatar_url',
                reviews: [{ vinylId: 1, score: 5, comment: 'Great album!' }],
            };
    
            mockUserModel.findOne.mockResolvedValue(mockProfile);
    
            const result = await userService.getUserProfile(1);
    
            expect(result).toEqual(mockProfile);
            expect(mockUserModel.findOne).toHaveBeenCalledWith({
                where: { id: 1 },
                attributes: ['firstName', 'lastName', 'avatar'],
                include: [
                    {
                        model: Review,
                        as: 'reviews',
                        attributes: ['vinylId', 'score', 'comment'],
                        order: [['createdAt', 'DESC']],
                    },
                ],
            });
        });
    
        it('should throw NotFoundException if user is not found', async () => {
            mockUserModel.findOne.mockResolvedValue(null);
    
            await expect(userService.getUserProfile(1)).rejects.toThrow(NotFoundException);
        });
    });

    describe('updateUser', () => {
        it('should update and return the updated user profile', async () => {
            const updateProfileDto = { firstName: 'Jane', lastName: 'Doe', avatar: 'new_avatar_url' };
            const updatedUser = { ...mockUserData, ...updateProfileDto, save: jest.fn() };
            mockUserModel.findByPk.mockResolvedValue(updatedUser);
    
            const result = await userService.updateUser(1, updateProfileDto);
    
            expect(result).toEqual(updateProfileDto);
        });
    
        it('should throw NotFoundException if user is not found', async () => {
            mockUserModel.findByPk.mockResolvedValue(null);
    
            await expect(userService.updateUser(1, { firstName: 'Jane', lastName: 'sd', avatar: 'av.jpg' })).rejects.toThrow(NotFoundException);
        });
    });

    describe('deleteUser', () => {
        it('should delete the user and return a success message', async () => {
            const deletedUser = { id: 1, destroy: jest.fn() }; 
            mockUserModel.findByPk.mockResolvedValue(deletedUser); 
        
            const result = await userService.deleteUser(1);
        
            expect(result).toEqual({ message: 'User with id 1 deleted' });
        
            expect(deletedUser.destroy).toHaveBeenCalledTimes(1);
        });
    
        it('should throw NotFoundException if user is not found', async () => {
            mockUserModel.findByPk.mockResolvedValue(null);
    
            await expect(userService.deleteUser(1)).rejects.toThrow(NotFoundException);
        });
    });
    
});
