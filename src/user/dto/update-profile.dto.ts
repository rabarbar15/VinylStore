import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
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
}
