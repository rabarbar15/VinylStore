import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VinylPaginationDto {
  
  @ApiProperty({
      description: 'The page number for pagination. Defaults to 1 if not provided.',
      example: 1,
      required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
      page?: number = 1;

  @ApiProperty({
      description: 'The number of vinyls to return per page. Defaults to 10, maximum 100.',
      example: 10,
      required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
      pageSize?: number = 10;
}
