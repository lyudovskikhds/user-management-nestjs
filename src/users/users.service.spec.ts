import { UsersService } from './users.service';
import { createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';
import { UserDao } from './dao/user.dao';
import { UserDto } from './dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterDto } from './dto/filter.dto';
import { SortByField } from './enums/sort.by.field';
import { SortOrder } from './enums/sort.order';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersService', () => {
  const repository = createMock<Repository<UserDao>>();
  const service = new UsersService(repository);

  const userDto = new UserDto(
    1,
    'dmitry@gmail.com',
    'Dmitry',
    'Lyu',
    new Date(),
    null,
  );

  const createUserDto = new CreateUserDto(
    userDto.email,
    userDto.firstName,
    userDto.lastName,
  );

  const userDao = new UserDao(
    userDto.id,
    userDto.email,
    userDto.firstName,
    userDto.lastName,
    userDto.createdAt,
    userDto.deletedAt,
  );

  it('creates user successfully', async () => {
    repository.save.mockResolvedValue(userDao);

    const actual = await service.create(createUserDto);

    expect(actual).toStrictEqual(userDto);
    expect(repository.save).toBeCalledWith({
      email: createUserDto.email,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
    });
  });

  it('list all users successfully', async () => {
    repository.find.mockResolvedValue([userDao]);

    const filter = new FilterDto(
      7,
      777,
      SortByField.EMAIL,
      SortOrder.DESC,
      true,
    );
    const actual = await service.findAll(filter);

    expect(actual).toStrictEqual([userDto]);
    expect(repository.find).toBeCalledWith({
      take: filter.limit,
      skip: filter.offset,
      order: { email: 'DESC' },
      withDeleted: filter.showDeleted,
    });
  });

  it('find user by id successfully', async () => {
    repository.findOne.mockResolvedValue(userDao);

    const actual = await service.findById(1);

    expect(actual).toStrictEqual(userDto);
    expect(repository.findOne).toBeCalledWith({
      where: { id: 1 },
      withDeleted: true,
    });
  });

  it('find user by id returns null', async () => {
    repository.findOne.mockResolvedValue(null);

    const actual = await service.findById(1);

    expect(actual).toStrictEqual(null);
    expect(repository.findOne).toBeCalledWith({
      where: { id: 1 },
      withDeleted: true,
    });
  });

  it('find user by email successfully', async () => {
    repository.findOne.mockResolvedValue(userDao);

    const actual = await service.findByEmail(userDto.email);

    expect(actual).toStrictEqual(userDto);
    expect(repository.findOne).toBeCalledWith({
      where: { email: userDto.email },
      withDeleted: true,
    });
  });

  it('find user by email returns null', async () => {
    repository.findOne.mockResolvedValue(null);

    const actual = await service.findByEmail(userDto.email);

    expect(actual).toStrictEqual(null);
    expect(repository.findOne).toBeCalledWith({
      where: { email: userDto.email },
      withDeleted: true,
    });
  });

  it('update user successfully', async () => {
    const updateUserDto = new UpdateUserDto('D', 'L');
    const updatedUserDto = new UserDto(
      userDto.id,
      userDto.email,
      updateUserDto.firstName!,
      updateUserDto.lastName!,
      userDto.createdAt,
      userDto.deletedAt,
    );

    const updatedUserDao = new UserDao(
      updatedUserDto.id,
      updatedUserDto.email,
      updatedUserDto.firstName,
      updatedUserDto.lastName,
      updatedUserDto.createdAt,
      updatedUserDto.deletedAt,
    );

    repository.findOne.mockResolvedValue(updatedUserDao);

    const actual = await service.update(userDto.id, updateUserDto);

    expect(actual).toStrictEqual(updatedUserDto);
    expect(repository.save).toBeCalledWith({
      id: userDto.id,
      firstName: updateUserDto.firstName,
      lastName: updateUserDto.lastName,
    });
  });

  it('remove user successfully', async () => {
    const deletedUserDto = new UserDto(
      userDto.id,
      userDto.email,
      userDto.firstName,
      userDto.lastName,
      userDto.createdAt,
      new Date(),
    );

    const deletedUserDao = new UserDao(
      deletedUserDto.id,
      deletedUserDto.email,
      deletedUserDto.firstName,
      deletedUserDto.lastName,
      deletedUserDto.createdAt,
      deletedUserDto.deletedAt,
    );

    repository.findOne.mockResolvedValue(deletedUserDao);

    const actual = await service.remove(userDto.id);

    expect(actual).toStrictEqual(deletedUserDto);
    expect(repository.softRemove).toBeCalledWith({
      id: userDto.id,
    });
  });
});
