import { Test, TestingModule } from '@nestjs/testing';
import { VinylService } from './vinyl.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { NotFoundException } from '@nestjs/common';
import { CreateVinylDto } from './dto/create-vinyl.dto/create-vinyl.dto';
import { Op } from 'sequelize';

describe('VinylService', () => {
    let vinylService: VinylService;

    const mockLogger = {
        error: jest.fn(),
        info: jest.fn(),
    };

    const mockVinylModel = {
        findAll: jest.fn(),
        build: jest.fn(),
        save: jest.fn(),
        findOne: jest.fn(),
        findByPk: jest.fn(),
        destroy: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                VinylService,
                { provide: WINSTON_MODULE_PROVIDER, useValue: mockLogger },
                { provide: 'VinylRepository', useValue: mockVinylModel },
            ],
        }).compile();
        
        vinylService = module.get<VinylService>(VinylService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(vinylService).toBeDefined();
    });

    describe('createVinyl', () => {
        it('should create and return a new vinyl', async () => {
            const createVinylDto: CreateVinylDto = { 
                title: 'New Album', 
                author: 'New Artist', 
                price: 15, 
                description: 'New Description' 
            };
            const newVinyl = { id: 1, ...createVinylDto, createdAt: expect.any(String), updatedAt: expect.any(String), save: jest.fn().mockResolvedValue(undefined)  };


            mockVinylModel.build.mockReturnValue(newVinyl);

            const result = await vinylService.createVinyl(createVinylDto);

            expect(result).toEqual(newVinyl); 
            expect(mockLogger.info).toHaveBeenCalledWith('Creating vinyl with title New Album');
        });
    });


    describe('getVinylById', () => {
        it('should return a vinyl if it exists', async () => {
            const vinylMock = { id: 1, title: 'Album 1', author: 'Artist 1' };
            mockVinylModel.findByPk.mockResolvedValue(vinylMock);
  
            const vinyl = await vinylService.getVinylById(1);
  
            expect(vinyl).toEqual(vinylMock);
            expect(mockLogger.error).not.toHaveBeenCalled();
        });
  
        it('should throw a NotFoundException if vinyl does not exist', async () => {
            mockVinylModel.findByPk.mockResolvedValue(null);
  
            await expect(vinylService.getVinylById(999)).rejects.toThrow(NotFoundException);
            expect(mockLogger.error).toHaveBeenCalledWith('Vinyl with id 999 not found');
        });
    });

    describe('getAllVinyls', () => {
        it('should return a list of vinyls', async () => {
            const vinylsMock = [
                { id: 1, title: 'Album 1', author: 'Artist 1', price: 10, description: 'Description 1' },
                { id: 2, title: 'Album 2', author: 'Artist 2', price: 20, description: 'Description 2' },
            ];
            mockVinylModel.findAll.mockResolvedValue(vinylsMock);
      
            const query = { page: 1, pageSize: 10 };
            const result = await vinylService.getAllVinyls(query);
      
            expect(result).toEqual([
                { title: 'Album 1', author: 'Artist 1', price: 10, description: 'Description 1', averageScore: 0, firstReview: null },
                { title: 'Album 2', author: 'Artist 2', price: 20, description: 'Description 2', averageScore: 0, firstReview: null },
            ]);
        });
    });

    describe('deleteVinyl', () => {
        it('should delete the vinyl if it exists', async () => {
            const vinylMock = { id: 1, title: 'Album to delete', destroy: jest.fn() };
            mockVinylModel.findByPk.mockResolvedValue(vinylMock);
      
            const result = await vinylService.deleteVinyl(1);
      
            expect(result).toEqual({ message: 'Vinyl deleted successfully' });
            expect(vinylMock.destroy).toHaveBeenCalled();
        });
    
        it('should throw NotFoundException if vinyl does not exist', async () => {
            mockVinylModel.findByPk.mockResolvedValue(null);
      
            await expect(vinylService.deleteVinyl(999)).rejects.toThrow(NotFoundException);
            expect(mockLogger.error).toHaveBeenCalledWith('Vinyl with id 999 not found');
        });
    });

    describe('updateVinyl', () => {
        it('should update and return the vinyl if it exists', async () => {
            const vinylMock = { id: 1, title: 'Album 1', update: jest.fn() };
            const updateData = { title: 'Updated Album' };
            mockVinylModel.findByPk.mockResolvedValue(vinylMock);
      
            const result = await vinylService.updateVinyl(1, updateData);
      
            expect(result).toEqual(vinylMock);
            expect(vinylMock.update).toHaveBeenCalledWith(updateData);
            expect(mockLogger.info).toHaveBeenCalledWith('Updating vinyl with id 1');
        });
    
        it('should throw NotFoundException if vinyl does not exist', async () => {
            mockVinylModel.findByPk.mockResolvedValue(null);
      
            await expect(vinylService.updateVinyl(999, { title: 'Updated' })).rejects.toThrow(NotFoundException);
            expect(mockLogger.error).toHaveBeenCalledWith('Vinyl with id 999 not found');
        });
    });

    describe('searchVinyls', () => {
        it('should return a list of vinyls matching search criteria', async () => {
            const vinylsMock = [{ id: 1, title: 'Album 1', author: 'Artist 1', price: 10 }];
            mockVinylModel.findAll.mockResolvedValue(vinylsMock);
      
            const result = await vinylService.searchVinyls('Album', 'Artist 1', 'title', 'ASC');
      
            expect(result).toEqual(vinylsMock);
            expect(mockVinylModel.findAll).toHaveBeenCalledWith({
                where: { title: { [Op.like]: '%Album%' }, author: { [Op.like]: '%Artist 1%' } },
                order: [['title', 'ASC']],
            });
        });
    });
});
