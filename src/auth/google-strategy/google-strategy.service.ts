import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategyService extends PassportStrategy(Strategy, 'google') {
    constructor(
        private readonly configService: ConfigService,
    ) {
        super({
            clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
            clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
            callbackURL: configService.get<string>('GOOGLE_REDIRECT_URI'),
            scope: ['email', 'profile',],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        profile: any,
        done: VerifyCallback,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): Promise<any> {
        const { name, emails, photos, id } = profile;
        
        const user = {
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            avatar: photos[0].value,
            googleId: id,
        };
        
        done(null, user);
    }
}
