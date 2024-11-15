import { Test, TestingModule } from '@nestjs/testing';
import { LogController } from './log.controller';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LogService } from './log.service';

describe('LogController', () => {
    let logController: LogController;

    const mockLogService = {
        getAllLogs: jest.fn(),
    };

    const mockJwtService = {
        signAsync: jest.fn(),
    };

    const mockUserService = {
        findAll: jest.fn(),
        createUser: jest.fn(),
        findByEmail: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [LogController],
            providers: [
                { provide: JwtService, useValue: mockJwtService },
                { provide: UserService, useValue: mockUserService },
                { provide: LogService, useValue: mockLogService },
            ]
        }).compile();

        logController = module.get<LogController>(LogController);
    });

    it('should be defined', () => {
        expect(logController).toBeDefined();
    });

    describe('getAllLogs', () => {
        it('should retrieve all logs successfully for admin users', async () => {
            const mockLogs = [
                { id: 1, action: 'User login', timestamp: '2024-11-01T12:00:00Z' },
                { id: 2, action: 'Data update', timestamp: '2024-11-02T12:00:00Z' },
            ];
    
            mockLogService.getAllLogs.mockResolvedValue(mockLogs);
    
            const result = await logController.getAllLogs();
    
            expect(mockLogService.getAllLogs).toHaveBeenCalled();
            expect(result).toEqual(mockLogs);
        });

        
    });
});
