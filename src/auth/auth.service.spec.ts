import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/models/user.model';
import { UserService } from '../user/user.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

describe('AuthService', () => {
    let authService: AuthService;
    let userService: UserService;

    const mockJwtService = {
        sign: jest.fn(() => 'mock-jwt-token'),
    };

    const mockUser = {
        id: 1,
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        avatar: 'avatar.png',
        googleId: 'google-id-123',
        role: 'user',
        save: jest.fn(),
    } as unknown as User;

    const mockUserService = {
        findByEmail: jest.fn(),
        createUser: jest.fn(() => mockUser),
    };

    const mockAdminRepository = {
        findOne: jest.fn(),
        create: jest.fn(),
    };

    const mockLogger = {
        info: jest.fn(),
    };

    const mockAdmin = {
        email: 'admin@example.com',
        save: jest.fn(),
    };

    const mockAdminModel = {
        findOne: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue(mockAdmin),
    };
      
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {provide: JwtService, useValue: mockJwtService},
                {provide: UserService, useValue: mockUserService},
                {provide: 'AdminRepository', useValue: mockAdminRepository},
                {provide: WINSTON_MODULE_PROVIDER, useValue: mockLogger},
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        userService = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(authService).toBeDefined();
    });


    describe('validateUser', () => {
        it('should return existing user if found', async () => {
            const details = { email: 'user@example.com', firstName: 'John', lastName: 'Doe', avatar: 'avatar.png', googleId: 'google-id-123' };
            const user = await authService.validateUser(details);
            expect(user).toEqual(mockUser);
            expect(userService.findByEmail).toHaveBeenCalledWith(details.email);
        });
    
        it('should create a new user if not found', async () => {
            mockUserService.findByEmail.mockResolvedValueOnce(null); // Simulate user not found
            const details = { email: 'newuser@example.com', firstName: 'John', lastName: 'Doe', avatar: 'avatar.png', googleId: 'google-id-123' };
            const user = await authService.validateUser(details);
            expect(userService.createUser).toHaveBeenCalledWith(details);
            expect(user.role).toBe('user');
        });
    
        it('should assign admin role if admin exists', async () => {
            const details = {
                email: 'admin@example.com',
                firstName: 'John',
                lastName: 'Doe',
                avatar: 'avatar.png',
                googleId: 'google-id-123',
            };
    
            const mockAdmin = { email: 'admin@example.com' }; 
            const mockUser = {
                id: 1,
                email: 'admin@example.com',
                role: 'admin', 
            };
    
            userService.findByEmail = jest.fn().mockResolvedValue(mockUser); 
            mockAdminModel.findOne = jest.fn().mockResolvedValue(mockAdmin); 
            
            userService.createUser = jest.fn().mockResolvedValue(mockUser); 
    
            const user = await authService.validateUser(details);
    
            expect(user.role).toBe('admin'); 
        });
    });
});
