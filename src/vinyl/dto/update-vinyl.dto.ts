import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateVinylDto {
  
  @ApiProperty({
      description: 'Title of the vinyl. Optional field.',
      example: 'Nevermind',
      required: false,
  })
  @IsString()
  @IsOptional()
      title?: string;

  @ApiProperty({
      description: 'Author/Artist of the vinyl. Optional field.',
      example: 'Nirvana',
      required: false,
  })
  @IsString()
  @IsOptional()
      author?: string;

  @ApiProperty({
      description: 'Description of the vinyl. Optional field.',
      example: 'A classic rock album.',
      required: false,
  })
  @IsString()
  @IsOptional()
      description?: string;

  @ApiProperty({
      description: 'Price of the vinyl. Optional field.',
      example: 19.99,
      required: false,
  })
  @IsNumber()
  @IsOptional()
      price?: number;

  @ApiProperty({
      description: 'Image URL for the vinyl. Optional field.',
      example: 'https://example.com/vinyl-image.jpg',
      required: false,
  })
  @IsString()
  @IsOptional()
      imageUrl?: string;
}
