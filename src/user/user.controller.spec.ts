import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { ProfileResponseDto } from './dto/profile-response.dto';
import { NotFoundException } from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';


describe('UserController', () => {
    let userController: UserController;
    let userService: UserService;

    const mockUserService = {
        getUserProfile: jest.fn(),
        updateUser: jest.fn(),
        deleteUser: jest.fn(),
    };

    const mockJwtService = {
        sign: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                {
                    provide: UserService,
                    useValue: mockUserService,
                },
                { provide: JwtService, useValue: mockJwtService },
            ],
        }).compile();

        userController = module.get<UserController>(UserController);
        userService = module.get<UserService>(UserService);
    });
    
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should be defined', () => {
        expect(userController).toBeDefined();
    });


    describe('getProfile', () => {
        it('should return the user profile', async () => {
            const mockProfile: ProfileResponseDto = {
                firstName: 'john_doe',
                lastName: 'john_doe',
                avatar: 'avatar.jpg',
                reviews: [],
            };
    
            mockUserService.getUserProfile.mockResolvedValue(mockProfile);
    
            const req = { user: { sub: 1 } }; 
            const result = await userController.getProfile(req);
    
            expect(result).toEqual(mockProfile);
            expect(userService.getUserProfile).toHaveBeenCalledWith(1);
        });
    
        it('should throw an error if user profile is not found', async () => {
            const req = { user: { sub: 1 } };
    
            mockUserService.getUserProfile.mockRejectedValue(new NotFoundException('User not found'));
    
            await expect(userController.getProfile(req)).rejects.toThrow(NotFoundException);
        });
    });

    describe('updateProfile', () => {
        it('should update and return the updated user profile', async () => {
            const updateProfileDto: UpdateProfileDto = {
                firstName: 'john_doe',
                lastName: 'john_doe',
                avatar: 'avatar.jpg',
            };
    
            const updatedProfile: ProfileResponseDto = {
                firstName: 'john_doe',
                lastName: 'john_doe',
                avatar: 'avatar.jpg',
                reviews: [],
            };
    
            mockUserService.updateUser.mockResolvedValue(updatedProfile);
    
            const req = { user: { sub: 1 } };
            const result = await userController.updateProfile(req, updateProfileDto);
    
            expect(result).toEqual(updatedProfile);
            expect(userService.updateUser).toHaveBeenCalledWith(1, updateProfileDto);
        });
    });

    describe('deleteProfile', () => {
        it('should delete the user profile and return a success message', async () => {
            const req = { user: { sub: 1 } };
        
            mockUserService.deleteUser.mockResolvedValue({ message: 'User profile deleted successfully' });
        
            const result = await userController.deleteProfile(req);
        
            expect(result).toEqual({ message: 'User profile deleted successfully' });
            expect(userService.deleteUser).toHaveBeenCalledWith(1);
        });
        
        it('should throw an error if the user profile cannot be deleted', async () => {
            const req = { user: { sub: 1 } };
        
            mockUserService.deleteUser.mockRejectedValue(new NotFoundException('User not found'));
        
            await expect(userController.deleteProfile(req)).rejects.toThrow(NotFoundException);
        });
    });
});
