import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from './config.service';
import { ConfigService as NestConfigService } from '@nestjs/config';

describe('ConfigService', () => {
    let configService: ConfigService;

    beforeEach(async () => {
        const mockNestConfigService = {
            get: jest.fn().mockImplementation((key: string) => {
                const configMap = {
                    JWT_SECRET: 'mock-jwt-secret',
                    DATABASE_USERNAME: 'mock-db-username',
                    DATABASE_PASSWORD: 'mock-db-password',
                    DATABASE_NAME: 'mock-db-name',
                    GOOGLE_CLIENT_ID: 'mock-google-client-id',
                    GOOGLE_CLIENT_SECRET: 'mock-google-client-secret',
                    GOOGLE_REDIRECT_URI: 'mock-google-redirect-uri',
                    DISCOGS_API_KEY: 'mock-discogs-api-key',
                    DISCOGS_API_SECRET: 'mock-discogs-api-secret',
                    STRIPE_API_KEY: 'mock-stripe-api-key',
                    EMAIL_USER: 'mock-email-user',
                    EMAIL_PASS: 'mock-email-pass',
                    SENDGRID_API_KEY: 'mock-sendgrid-api-key',
                };
                return configMap[key];
            }),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ConfigService,
                { provide: NestConfigService, useValue: mockNestConfigService },
            ],
        }).compile();

        configService = module.get<ConfigService>(ConfigService);
    });

    it('should be defined', () => {
        expect(configService).toBeDefined();
    });

    it('should return JWT_SECRET value from config', () => {
        expect(configService.jwtSecret).toBe('mock-jwt-secret');
    });

    it('should return DATABASE_USERNAME value from config', () => {
        expect(configService.databaseUsername).toBe('mock-db-username');
    });

    it('should return DATABASE_PASSWORD value from config', () => {
        expect(configService.databasePassword).toBe('mock-db-password');
    });

    it('should return DATABASE_NAME value from config', () => {
        expect(configService.databaseName).toBe('mock-db-name');
    });

    it('should return GOOGLE_CLIENT_ID value from config', () => {
        expect(configService.googleClientId).toBe('mock-google-client-id');
    });

    it('should return GOOGLE_CLIENT_SECRET value from config', () => {
        expect(configService.googleClientSecret).toBe('mock-google-client-secret');
    });

    it('should return GOOGLE_REDIRECT_URI value from config', () => {
        expect(configService.googleRedirectUri).toBe('mock-google-redirect-uri');
    });

    it('should return DISCOGS_API_KEY value from config', () => {
        expect(configService.discogsApiKey).toBe('mock-discogs-api-key');
    });

    it('should return DISCOGS_API_SECRET value from config', () => {
        expect(configService.discogsApiSecret).toBe('mock-discogs-api-secret');
    });

    it('should return STRIPE_API_KEY value from config', () => {
        expect(configService.stripeApiKey).toBe('mock-stripe-api-key');
    });

    it('should return EMAIL_USER value from config', () => {
        expect(configService.emailUser).toBe('mock-email-user');
    });

    it('should return EMAIL_PASS value from config', () => {
        expect(configService.emailPass).toBe('mock-email-pass');
    });

    it('should return SENDGRID_API_KEY value from config', () => {
        expect(configService.sendgridApiKey).toBe('mock-sendgrid-api-key');
    });
});
