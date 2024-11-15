import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
    constructor(private configService: NestConfigService) {}

    get jwtSecret(): string {
        return this.configService.get<string>('JWT_SECRET');
    }

    get databaseUsername(): string {
        return this.configService.get<string>('DATABASE_USERNAME');
    }

    get databasePassword(): string {
        return this.configService.get<string>('DATABASE_PASSWORD');
    }

    get databaseName(): string {
        return this.configService.get<string>('DATABASE_NAME');
    }

    get googleClientId(): string {
        return this.configService.get<string>('GOOGLE_CLIENT_ID');
    }

    get googleClientSecret(): string {
        return this.configService.get<string>('GOOGLE_CLIENT_SECRET');
    }

    get googleRedirectUri(): string {
        return this.configService.get<string>('GOOGLE_REDIRECT_URI');
    }

    get discogsApiKey(): string {
        return this.configService.get<string>('DISCOGS_API_KEY');
    }

    get discogsApiSecret(): string {
        return this.configService.get<string>('DISCOGS_API_SECRET');
    }

    get stripeApiKey(): string {
        return this.configService.get<string>('STRIPE_API_KEY');
    }

    get emailUser(): string {
        return this.configService.get<string>('EMAIL_USER');
    }

    get emailPass(): string {
        return this.configService.get<string>('EMAIL_PASS');
    }

    get sendgridApiKey(): string {
        return this.configService.get<string>('SENDGRID_API_KEY');
    }
}
