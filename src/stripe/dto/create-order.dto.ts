import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {

  @ApiProperty({
      description: 'The ID of the vinyl being ordered.',
      example: 1,
  })
  @IsNumber()
      vinylId: number;

}
