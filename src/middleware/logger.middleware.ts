import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) {}

    use(req: Request, res: Response, next: NextFunction) {
        const { method, url } = req;
        this.logger.info(`Request received: ${method} ${url}`);
        next();
    }
}
