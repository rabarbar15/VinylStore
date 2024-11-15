import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';

class ReviewDto {
    @ApiProperty()
    @IsNumber()
        vinylId: number;

    @ApiProperty()
    @IsString()
        comment: string;
  
    @ApiProperty()
    @IsString()
        score: number;
}
  
export class ProfileResponseDto {
    @ApiProperty({
        description: 'User\'s first name.',
        example: 'John',
    })
    @IsString()
        firstName: string;

    @ApiProperty({
        description: 'User\'s last name.',
        example: 'Doe',
    })
    @IsString()
        lastName: string;

    @ApiProperty({
        description: 'URL of the user\'s avatar image.',
        example: 'https://example.com/avatar.jpg',
    })
    @IsString()
        avatar: string;

    @ApiProperty({
        description: 'List of reviews written by the user.',
        type: [ReviewDto],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ReviewDto)
        reviews: ReviewDto[];
}
