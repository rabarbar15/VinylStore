import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LogService {
    constructor() {}

    async getAllLogs() {
        const logFilePath = path.join(__dirname, '../../app.log');
        return fs.readFileSync(logFilePath, 'utf8');
    }
}
