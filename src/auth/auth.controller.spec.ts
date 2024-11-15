import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AdminEmailDto } from './dto/admin-email.dto';

describe('AuthController', () => {
    let authController: AuthController;
    let userService: UserService;
    let authService: AuthService;

    const mockJwtService = {
        sign: jest.fn(() => 'mock-jwt-token'),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: {
                        createJwtToken: jest.fn(),
                        addAdminEmail: jest.fn(),
                    },
                },
                {
                    provide: UserService,
                    useValue: {
                        finByGoogleId: jest.fn(),
                        createUser: jest.fn(),
                        updateUser: jest.fn(),
                    },
                },
                { provide: JwtService, useValue: mockJwtService },
            ],
        }).compile();

        authController = module.get<AuthController>(AuthController);
        userService = module.get<UserService>(UserService);
        authService = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(authController).toBeDefined();
    });
    describe('googleAuthRedirect', () => {
        it('should authenticate the user and return a JWT token', async () => {
            const mockUser = {
                email: 'test@example.com',
                firstName: 'John',
                lastName: 'Doe',
                avatar: 'avatar.png',
                googleId: 'google-id-123',
            };

            const mockToken = 'mock-jwt-token';
            const mockCreatedUser = { id: 1, ...mockUser, role: 'user' };

            userService.finByGoogleId = jest.fn().mockResolvedValue(null);
            userService.createUser = jest.fn().mockResolvedValue(mockCreatedUser);
            authService.createJwtToken = jest.fn().mockReturnValue(mockToken);

            const result = await authController.googleAuthRedirect({ user: mockUser });

            expect(result).toEqual({ token: mockToken, user: mockCreatedUser });
            expect(userService.createUser).toHaveBeenCalledWith(mockUser);
            expect(authService.createJwtToken).toHaveBeenCalledWith(mockCreatedUser);
        });

    });

    describe('createAdmin', () => {
        it('should create an admin user', async () => {
            const mockAdminEmailDto: AdminEmailDto = { email: 'admin@example.com' };
            const mockAdmin = { email: 'admin@example.com', id: 1 };

            authService.addAdminEmail = jest.fn().mockResolvedValue(mockAdmin);

            const result = await authController.createAdmin(mockAdminEmailDto);

            expect(result).toEqual(mockAdmin);
            expect(authService.addAdminEmail).toHaveBeenCalledWith(mockAdminEmailDto);
        });
    });
});

