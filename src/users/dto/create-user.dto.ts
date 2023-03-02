import { IsEmail, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: "User's email.",
    example: 'dmitry.lyudovskikh@gmail.com',
  })
  @IsString()
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    description: "User's first name.",
    example: 'Dmitry',
  })
  @IsString()
  @Length(1, 100)
  readonly firstName: string;

  @ApiProperty({
    description: "User's last name.",
    example: 'Lyudovskikh',
  })
  @IsString()
  @Length(1, 100)
  readonly lastName: string;

  constructor(email: string, firstName: string, lastName: string) {
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
  }
}
