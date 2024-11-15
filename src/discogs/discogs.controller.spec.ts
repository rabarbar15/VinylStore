import { Test, TestingModule } from '@nestjs/testing';
import { DiscogsController } from './discogs.controller';
import { DiscogsService } from './discogs.service';

describe('DiscogsController', () => {
    let controller: DiscogsController;
    let service: DiscogsService;

    const mockDiscogsService = {
        search: jest.fn(),
        getRelease: jest.fn(),
        searchDiscogs: jest.fn(),
        migrateVinyls: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [DiscogsController],
            providers: [
                { provide: DiscogsService, useValue: mockDiscogsService },
            ]
        }).compile();

        controller = module.get<DiscogsController>(DiscogsController);
        service = module.get<DiscogsService>(DiscogsService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('searchDiscogs', () => {
        it('should call DiscogsService.searchDiscogs and return vinyl records', async () => {
            const artist = 'U2';
            const perPage = 10;
            const mockResult = [{ title: 'The Joshua Tree', artist: 'U2' }];

            jest.spyOn(service, 'searchDiscogs').mockResolvedValue(mockResult);

            const result = await controller.searchDiscogs(artist, perPage.toString());

            expect(service.searchDiscogs).toHaveBeenCalledWith(artist, perPage);
            expect(result).toEqual(mockResult);
        });
    });

    describe('migrateVinyls', () => {
        it('should call DiscogsService.migrateVinyls and return success message', async () => {
            const mockMigrationResult = { message: 'Vinyls migrated successfully' };

            jest.spyOn(service, 'migrateVinyls').mockResolvedValue(mockMigrationResult);

            const result = await controller.migrateVinyls();

            expect(service.migrateVinyls).toHaveBeenCalledWith('artist=u2');
            expect(result).toEqual(mockMigrationResult);
        });
    });
});
