import { Test, TestingModule } from '@nestjs/testing';
import { VinylController } from './vinyl.controller';
import { JwtService } from '@nestjs/jwt';
import { VinylService } from './vinyl.service';
import { AdminGuard } from '../auth/admin.guard';
import { UserService } from '../user/user.service';
import { CreateVinylDto } from './dto/create-vinyl.dto/create-vinyl.dto';
import { VinylResponseDto } from './dto/vinyl-response.dto';
import { UpdateVinylDto } from './dto/update-vinyl.dto';
import { NotFoundException } from '@nestjs/common';

describe('VinylController', () => {
    let vinylController: VinylController;
    let vinylService: VinylService;

    const mockVinylService = {
        getAllVinyls: jest.fn(),
        createVinyl: jest.fn(),
        updateVinyl: jest.fn(),
        searchVinyls: jest.fn(),
    };

    const mockJwtService = {
        signAsync: jest.fn(),
    };

    const mockUserService = {
        findOne: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                { provide: JwtService, useValue: mockJwtService },
                { provide: VinylService, useValue: mockVinylService },
                {
                    provide: AdminGuard,
                    useValue: {
                        canActivate: jest.fn(() => true),
                    },
                },
                { provide: UserService, useValue: mockUserService },
            ],
            controllers: [VinylController],
        }).compile();

        vinylController = module.get<VinylController>(VinylController);
        vinylService = module.get<VinylService>(VinylService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(vinylController).toBeDefined();
    });

    describe('createVinyl', () => {
        it('should create and return a vinyl record', async () => {
            const createVinylDto: CreateVinylDto = {
                title: 'Nevermind',
                author: 'Nirvana',
                price: 4900.00,
                description: 'Rock, Released in 2021. A classic rock album.',
            };
        
            const createdVinyl = {
                id: 1,
                ...createVinylDto,
                createdAt: '2024-11-12T00:37:55.676Z',
                updatedAt: '2024-11-12T00:37:55.676Z',
            };
        
            mockVinylService.createVinyl.mockResolvedValue(createdVinyl);
        
            const result = await vinylController.createVinyl(createVinylDto);
            expect(result).toEqual(createdVinyl);
            expect(vinylService.createVinyl).toHaveBeenCalledWith(createVinylDto);
        });
    });

    describe('getVinylList', () => {
        it('should return an array of vinyl records', async () => {
            const mockVinylResponse: VinylResponseDto[] = [
                {
                    title: 'Nevermind',
                    author: 'Nirvana',
                    price: 4900.00,
                    description: 'Rock, Released in 2021. A classic rock album.',
                    averageScore: 4.5,
                    firstReview: 'Comment: Great album, Score: 5',
                },
            ];
    
            mockVinylService.getAllVinyls.mockResolvedValue(mockVinylResponse);
    
            const result = await vinylController.getVinylList({ page: 1, pageSize: 10 });
            expect(result).toEqual(mockVinylResponse);
            expect(vinylService.getAllVinyls).toHaveBeenCalledWith({ page: 1, pageSize: 10 }, 1); // hardcoded user id
        });
    });

    describe('updateVinyl', () => {
        it('should update and return a vinyl record', async () => {
            const updateVinylDto: UpdateVinylDto = {
                title: 'In Utero',
                author: 'Nirvana',
                price: 4900.00,
                description: 'Alternative rock album, released in 1993.',
            };
    
            const updatedVinyl = {
                id: 1,
                ...updateVinylDto,
                createdAt: '2024-11-12T00:37:55.676Z',
                updatedAt: '2024-11-12T00:37:55.676Z',
            };
    
            mockVinylService.updateVinyl.mockResolvedValue(updatedVinyl);
    
            const result = await vinylController.updateVinyl(1, updateVinylDto);
            expect(result).toEqual(updatedVinyl);
            expect(vinylService.updateVinyl).toHaveBeenCalledWith(1, updateVinylDto);
        });
    
        it('should throw NotFoundException if vinyl is not found', async () => {
            const updateVinylDto: UpdateVinylDto = {
                title: 'In Utero',
                author: 'Nirvana',
                price: 4900.00,
                description: 'Alternative rock album, released in 1993.',
            };
    
            mockVinylService.updateVinyl.mockRejectedValue(new NotFoundException('Vinyl not found'));
    
            await expect(vinylController.updateVinyl(999, updateVinylDto)).rejects.toThrow(NotFoundException);
        });
    });

    describe('searchVinyls', () => {
        it('should return a list of vinyls based on search criteria', async () => {
            const mockSearchResponse: VinylResponseDto[] = [
                {
                    title: 'Nevermind',
                    author: 'Nirvana',
                    price: 4900.00,
                    description: 'Rock, Released in 2021. A classic rock album.',
                    averageScore: 4.5,
                    firstReview: 'Comment: Great album, Score: 5',
                },
            ];
    
            mockVinylService.searchVinyls.mockResolvedValue(mockSearchResponse);
    
            const result = await vinylController.searchVinyls('Nevermind', 'Nirvana', 'title', 'ASC');
            expect(result).toEqual(mockSearchResponse);
            expect(vinylService.searchVinyls).toHaveBeenCalledWith('Nevermind', 'Nirvana', 'title', 'ASC');
        });
    
        it('should return empty array if no vinyls found based on search criteria', async () => {
            mockVinylService.searchVinyls.mockResolvedValue([]);
    
            const result = await vinylController.searchVinyls('Nonexistent Album', 'Unknown', 'price', 'DESC');
            expect(result).toEqual([]);
            expect(vinylService.searchVinyls).toHaveBeenCalledWith('Nonexistent Album', 'Unknown', 'price', 'DESC');
        });
    });
});
