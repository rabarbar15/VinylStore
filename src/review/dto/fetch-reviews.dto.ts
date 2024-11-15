import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FetchReviewsDto {

  @ApiProperty({
      description: 'The page number for pagination, default is 1.',
      example: 1,
      required: false,
      minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
      page?: number = 1;

  @ApiProperty({
      description: 'The number of reviews per page for pagination, default is 10.',
      example: 10,
      required: false,
      minimum: 1,
      maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
      pageSize?: number = 10;
}
