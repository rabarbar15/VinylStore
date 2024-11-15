import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVinylDto {
    @ApiProperty({
        description: 'Title of the vinyl.',
        example: 'Nevermind',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
        title: string;

    @ApiProperty({
        description: 'Author/Artist of the vinyl.',
        example: 'Nirvana',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
        author: string;

    @ApiProperty({
        description: 'Description of the vinyl. Optional.',
        example: 'A classic rock album.',
        required: false,
    })
    @IsString()
    @IsOptional()
        description?: string;

    @ApiProperty({
        description: 'Price of the vinyl.',
        example: 19.99,
        required: true,
    })
    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
        price: number;

    @ApiProperty({
        description: 'Image URL of the vinyl. Optional.',
        example: 'https://example.com/vinyl-image.jpg',
        required: false,
    })
    @IsUrl()
    @IsOptional()
        imageUrl?: string;
}
