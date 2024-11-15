import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VinylResponseDto {
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

    @ApiProperty({
        description: 'Average score of the vinyl from reviews. Optional.',
        example: 8.5,
        required: false,
    })
    @IsNumber()
    @IsOptional()
        averageScore?: number;

    @ApiProperty({
        description: 'First review comment for the vinyl. Optional.',
        example: 'An amazing album with great tracks.',
        required: false,
    })
    @IsString()
    @IsOptional()
        firstReview?: string;
}
