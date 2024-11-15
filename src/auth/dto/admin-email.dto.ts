import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';


export class AdminEmailDto {
    @ApiProperty({
        description: 'The email address of the admin.',
        example: 'admin@example.com',
    })
    @IsEmail()
    @IsNotEmpty()
        email: string;
}