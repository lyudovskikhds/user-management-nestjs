import { IsOptional, IsString, Length } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: "User's first name.",
    example: 'Dmitry',
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  readonly firstName?: string;

  @ApiPropertyOptional({
    description: "User's last name.",
    example: 'Lyudovskikh',
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  readonly lastName?: string;

  constructor(firstName?: string, lastName?: string) {
    this.firstName = firstName;
    this.lastName = lastName;
  }
}
