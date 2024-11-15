import { IsString, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GoogleUserDto {
  @ApiProperty({
      description: 'The email address of the user.',
      example: 'user@example.com',
  })
  @IsEmail()
      email: string;

  @ApiProperty({
      description: 'The first name of the user.',
      example: 'John',
  })
  @IsString()
      firstName: string;

  @ApiProperty({
      description: 'The last name of the user.',
      example: 'Doe',
      required: false,
  })
  @IsOptional()
  @IsString()
      lastName?: string;

  @ApiProperty({
      description: 'The avatar URL of the user.',
      example: 'https://example.com/avatar.jpg',
      required: false,
  })
  @IsOptional()
  @IsString()
      avatar?: string;

  @ApiProperty({
      description: 'The unique Google ID of the user.',
      example: 'googleId123',
  })
  @IsString()
      googleId: string;
}
