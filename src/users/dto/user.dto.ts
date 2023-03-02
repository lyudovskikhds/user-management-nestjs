import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    description: "User's identifier.",
    example: '1',
  })
  readonly id: number;

  @ApiProperty({
    description: "User's email.",
    example: 'dmitry.lyudovskikh@gmail.com',
  })
  readonly email: string;

  @ApiProperty({
    description: "User's first name.",
    example: 'Dmitry',
  })
  readonly firstName: string;

  @ApiProperty({
    description: "User's last name.",
    example: 'Lyudovskikh',
  })
  readonly lastName: string;

  @ApiProperty({
    description: 'The timestamp of user creation.',
    example: '2021-01-01T12:30:45.123Z',
  })
  readonly createdAt: Date;

  @ApiProperty({
    description: 'The timestamp of user deletion.',
    example: '2022-01-01T12:30:45.123Z',
    nullable: true,
  })
  readonly deletedAt: Date | null;

  constructor(
    id: number,
    email: string,
    firstName: string,
    lastName: string,
    createdAt: Date,
    deletedAt: Date | null,
  ) {
    this.id = id;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.createdAt = createdAt;
    this.deletedAt = deletedAt;
  }
}
