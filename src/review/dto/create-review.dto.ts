import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {

  @ApiProperty({
      description: 'The ID of the vinyl being reviewed.',
      example: 1,
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
      vinylId: number;

  @ApiProperty({
      description: 'The comment or review text for the vinyl.',
      example: 'Great sound quality and packaging!',
  })
  @IsString()
  @IsNotEmpty()
      comment: string;

  @ApiProperty({
      description: 'The score given to the vinyl, between 0 and 10.',
      example: 8,
      minimum: 0,
      maximum: 10,
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(10)
      score: number;
}
