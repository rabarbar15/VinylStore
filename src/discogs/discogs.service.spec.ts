import { Test, TestingModule } from '@nestjs/testing';
import { DiscogsService } from './discogs.service';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { VinylService } from '../vinyl/vinyl.service';
import axios from 'axios';

jest.mock('axios');

describe('DiscogsService', () => {
    let discogsService: DiscogsService;

    const mockConfigService = {
        get: jest.fn(),
    };

    const mockLogger = {
        info: jest.fn(),
        error: jest.fn(),
    };

    const mockVinylService = {
        createVinyl: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DiscogsService,
                { provide: ConfigService, useValue: mockConfigService },
                { provide: WINSTON_MODULE_PROVIDER, useValue: mockLogger },
                { provide: VinylService, useValue: mockVinylService },
            ],
        }).compile();

        discogsService = module.get<DiscogsService>(DiscogsService);
    });

    it('should be defined', () => {
        expect(discogsService).toBeDefined();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
    
    describe('searchDiscogs', () => {
        it('should successfully search Discogs', async () => {
            const mockResponse = {
                data: {
                    results: [
                        {
                            title: 'Artist - Album',
                            year: 2020,
                            genre: ['Rock'],
                            cover_image: 'image_url',
                        },
                    ],
                },
            };
    
            (axios.get as jest.Mock).mockResolvedValue(mockResponse);
    
            const result = await discogsService.searchDiscogs('Artist', 20);
    
            expect(axios.get).toHaveBeenCalledWith('https://api.discogs.com/database/search', {
                params: {
                    q: 'Artist',
                    per_page: 20,
                },
                headers: {
                    Authorization: 'Discogs key=undefined, secret=undefined', // Should match your mockConfigService return value
                },
            });
    
            expect(result).toEqual(mockResponse.data);
        });
    });

    
});
