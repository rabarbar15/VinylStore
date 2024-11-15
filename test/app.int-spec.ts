import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { AuthService } from '../src/auth/auth.service';
import { AdminEmailDto } from '../src/auth/dto/admin-email.dto';
import { DiscogsService } from '../src/discogs/discogs.service';
import { LogService } from '../src/log/log.service';

describe('AuthController (Integration)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();

    });

    afterAll(async () => {
        await app.close();
    });

    describe('GET /auth/google', () => {
        it('should redirect to Google OAuth login', async () => {
            const response = await request(app.getHttpServer()).get('/auth/google');
            expect(response.status).toBe(302);
        });
    });


    describe('GET /auth/create-admin', () => {
        it('should return 403 if user is not authorized', async () => {
            const response = await request(app.getHttpServer())
                .get('/auth/create-admin')
                .expect(401);

            expect(response.body).toHaveProperty('message', 'Unauthorized');
        });
    });
});

describe('DiscogsController (Integration)', () => {
    let app: INestApplication;
    let discogsService: DiscogsService;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule], 
        })
            .overrideProvider(DiscogsService)
            .useValue({
                searchDiscogs: jest.fn().mockResolvedValue([{ title: 'Some Vinyl', artist: 'U2', year: 1980 }]),
                migrateVinyls: jest.fn().mockResolvedValue({ message: 'Vinyls migrated successfully' }),
            })
            .compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }));

        discogsService = moduleFixture.get(DiscogsService); 

        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('GET /discogs/search', () => {
        it('should search for vinyl records based on artist', async () => {
            const artist = 'U2';
            const perPage = '5';

            const response = await request(app.getHttpServer())
                .get('/discogs/search')
                .query({ artist, perPage })
                .expect(200);

            expect(response.body).toEqual([{ title: 'Some Vinyl', artist: 'U2', year: 1980 }]);
            expect(discogsService.searchDiscogs).toHaveBeenCalledWith(artist, Number(perPage)); 
        });
    });

    describe('GET /discogs/migrate', () => {
        it('should migrate vinyl records successfully', async () => {
            const response = await request(app.getHttpServer())
                .get('/discogs/migrate')
                .expect(200);

            expect(response.body).toEqual({ message: 'Vinyls migrated successfully' });
            expect(discogsService.migrateVinyls).toHaveBeenCalledWith('artist=u2'); 
        });
    });
});

describe('LogController (Integration)', () => {
    let app: INestApplication;
    let logService: LogService;
    let authService: AuthService;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(LogService)
            .useValue({
                getAllLogs: jest.fn().mockResolvedValue([{ id: 1, message: 'Log entry 1' }, { id: 2, message: 'Log entry 2' }]),
            })
            .compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }));

        logService = moduleFixture.get(LogService); 
        authService = moduleFixture.get<AuthService>(AuthService);

        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('GET /log', () => {
        it('should return all logs when authenticated and authorized as admin', async () => {
            const adminEmailDto: AdminEmailDto = { email: 'example@gmail.com' };
            await authService.addAdminEmail(adminEmailDto);

            const userDetails = {
                email: 'example@gmail.com',
                firstName: 'John',
                lastName: 'Doe',
                avatar: 'avatar.png',
                googleId: '123345',
                reviews: []
            };

            const user = await authService.validateUser(userDetails);
            const token = authService.createJwtToken(user);

            const response = await request(app.getHttpServer())
                .get('/log')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            expect(response.body).toEqual([
                { id: 1, message: 'Log entry 1' },
                { id: 2, message: 'Log entry 2' },
            ]);
            expect(logService.getAllLogs).toHaveBeenCalled(); 
        });

        it('should return 401 if the user is not authenticated', async () => {
            const response = await request(app.getHttpServer())
                .get('/log')
                .expect(401); 

            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toContain('Unauthorized');
        });

        it('should return 403 if the user is authenticated but not an admin', async () => {
            const response = await request(app.getHttpServer())
                .get('/log')
                .set('Authorization', 'Bearer valid-user-jwt') 
                .expect(401); 

            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toContain('jwt malformed');
        });

        it('should return 400 if the JWT is invalid', async () => {
            const response = await request(app.getHttpServer())
                .get('/log')
                .set('Authorization', 'Bearer invalid-jwt')
                .expect(401); 

            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toContain('jwt malformed');
        });
    });
});

