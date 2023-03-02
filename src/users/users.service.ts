import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { FilterDto } from './dto/filter.dto';
import { UserDao } from './dao/user.dao';
import { FindOptionsOrder, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SortOrder } from './enums/sort.order';
import { SortByField } from './enums/sort.by.field';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserDao)
    private usersRepository: Repository<UserDao>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    const user = await this.usersRepository.save({
      email: createUserDto.email,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
    });
    return this.map(user);
  }

  async findAll(filter: FilterDto): Promise<UserDto[]> {
    const users = await this.usersRepository.find({
      take: filter.limit,
      skip: filter.offset,
      order: this.order(filter.sort, filter.order),
      withDeleted: filter.showDeleted,
    });

    return users.map((user) => this.map(user));
  }

  async findById(id: number): Promise<UserDto | null> {
    const user = await this.usersRepository.findOne({
      where: { id },
      withDeleted: true,
    });
    return this.mapOrNull(user);
  }

  async findByEmail(email: string): Promise<UserDto | null> {
    const user = await this.usersRepository.findOne({
      where: { email },
      withDeleted: true,
    });
    return this.mapOrNull(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserDto> {
    await this.usersRepository.save({
      id: id,
      firstName: updateUserDto.firstName,
      lastName: updateUserDto.lastName,
    });
    const user = await this.findById(id);
    return user!;
  }

  async remove(id: number): Promise<UserDto> {
    await this.usersRepository.softRemove({ id: id });
    const user = await this.findById(id);
    return user!;
  }

  private map(user: UserDao): UserDto {
    return new UserDto(
      user.id,
      user.email,
      user.firstName,
      user.lastName,
      user.createdAt,
      user.deletedAt,
    );
  }

  private mapOrNull(user: UserDao | null): UserDto | null {
    if (!user) {
      return null;
    }
    return this.map(user);
  }

  private order(
    field: SortByField,
    order: SortOrder,
  ): FindOptionsOrder<UserDao> {
    switch (field) {
      case SortByField.ID:
        return { id: order };
      case SortByField.EMAIL:
        return { email: order };
      case SortByField.FIRST_NAME:
        return { firstName: order };
      case SortByField.LAST_NAME:
        return { lastName: order };
      case SortByField.CREATED_AT:
        return { createdAt: order };
      case SortByField.DELETED_AT:
        return { deletedAt: order };
    }
  }
}
