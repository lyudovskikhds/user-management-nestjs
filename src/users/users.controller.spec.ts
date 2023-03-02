import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createMock } from '@golevelup/ts-jest';
import { UserDto } from './dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { configure } from '../main';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterDto } from './dto/filter.dto';
import { SortByField } from './enums/sort.by.field';
import { SortOrder } from './enums/sort.order';
import clearAllMocks = jest.clearAllMocks;

describe('UsersController', () => {
  let app: INestApplication;
  const usersService = createMock<UsersService>();

  const user = new UserDto(
    1,
    'dmitry@gmail.com',
    'Dmitry',
    'Lyu',
    new Date(),
    null,
  );

  const asResponse = (user: UserDto): object => {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt.toJSON(),
      deletedAt: user.deletedAt?.toJSON() ?? null,
    };
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: usersService,
        },
      ],
    }).compile();

    app = configure(module.createNestApplication());
    await app.init();
  });

  afterEach(async () => {
    clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it(`create user successfully`, async () => {
    usersService.findByEmail.mockResolvedValue(null);
    usersService.create.mockResolvedValue(user);

    const createUserRequest = new CreateUserDto(
      user.email,
      user.firstName,
      user.lastName,
    );

    await request(app.getHttpServer())
      .post('/users')
      .send(createUserRequest)
      .expect(201)
      .expect(asResponse(user));

    expect(usersService.findByEmail).toBeCalledWith(user.email);
    expect(usersService.create).toBeCalledWith(createUserRequest);
  });

  it(`create user returns 409 if user with this email exists`, async () => {
    const existingUser = new UserDto(
      777,
      user.email,
      'D',
      'L',
      new Date(),
      null,
    );
    usersService.findByEmail.mockResolvedValue(existingUser);

    const createUserRequest = new CreateUserDto(
      user.email,
      user.firstName,
      user.lastName,
    );

    await request(app.getHttpServer())
      .post('/users')
      .send(createUserRequest)
      .expect(409);

    expect(usersService.findByEmail).toBeCalledWith(user.email);
    expect(usersService.create).toBeCalledTimes(0);
  });

  it(`create user returns 400 if email field is not email`, async () => {
    const createUserRequest = new CreateUserDto(
      'INVALID_EMAIL',
      user.firstName,
      user.lastName,
    );

    await request(app.getHttpServer())
      .post('/users')
      .send(createUserRequest)
      .expect(400);

    expect(usersService.findByEmail).toBeCalledTimes(0);
    expect(usersService.create).toBeCalledTimes(0);
  });

  it(`create user returns 400 if first name is empty`, async () => {
    const createUserRequest = new CreateUserDto(user.email, '', user.lastName);

    await request(app.getHttpServer())
      .post('/users')
      .send(createUserRequest)
      .expect(400);

    expect(usersService.findByEmail).toBeCalledTimes(0);
    expect(usersService.create).toBeCalledTimes(0);
  });

  it(`create user returns 400 if first name is too long`, async () => {
    const createUserRequest = new CreateUserDto(
      user.email,
      'D'.repeat(101),
      user.lastName,
    );

    await request(app.getHttpServer())
      .post('/users')
      .send(createUserRequest)
      .expect(400);

    expect(usersService.findByEmail).toBeCalledTimes(0);
    expect(usersService.create).toBeCalledTimes(0);
  });

  it(`create user returns 400 if last name is empty`, async () => {
    const createUserRequest = new CreateUserDto(user.email, user.firstName, '');

    await request(app.getHttpServer())
      .post('/users')
      .send(createUserRequest)
      .expect(400);

    expect(usersService.findByEmail).toBeCalledTimes(0);
    expect(usersService.create).toBeCalledTimes(0);
  });

  it(`create user returns 400 if last name is too long`, async () => {
    const createUserRequest = new CreateUserDto(
      user.email,
      '',
      'D'.repeat(101),
    );

    await request(app.getHttpServer())
      .post('/users')
      .send(createUserRequest)
      .expect(400);

    expect(usersService.findByEmail).toBeCalledTimes(0);
    expect(usersService.create).toBeCalledTimes(0);
  });

  it(`create user returns 400 if email field is missed`, async () => {
    await request(app.getHttpServer())
      .post('/users')
      .send({
        firstName: user.firstName,
        lastName: user.lastName,
      })
      .expect(400);

    expect(usersService.findByEmail).toBeCalledTimes(0);
    expect(usersService.create).toBeCalledTimes(0);
  });

  it(`create user returns 400 if first name field is missed`, async () => {
    await request(app.getHttpServer())
      .post('/users')
      .send({
        email: user.email,
        lastName: user.lastName,
      })
      .expect(400);

    expect(usersService.findByEmail).toBeCalledTimes(0);
    expect(usersService.create).toBeCalledTimes(0);
  });

  it(`create user returns 400 if last name field is missed`, async () => {
    await request(app.getHttpServer())
      .post('/users')
      .send({
        email: user.email,
        firstName: user.firstName,
      })
      .expect(400);

    expect(usersService.findByEmail).toBeCalledTimes(0);
    expect(usersService.create).toBeCalledTimes(0);
  });

  it(`create user returns 400 if extra field is added to request`, async () => {
    await request(app.getHttpServer())
      .post('/users')
      .send({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        extraField: 'extra-field',
      })
      .expect(400);

    expect(usersService.findByEmail).toBeCalledTimes(0);
    expect(usersService.create).toBeCalledTimes(0);
  });

  it(`get user by id returns 200 and the user`, async () => {
    usersService.findById.mockResolvedValue(user);

    await request(app.getHttpServer())
      .get('/users/1')
      .expect(200)
      .expect(asResponse(user));

    expect(usersService.findById).toBeCalledWith(1);
  });

  it(`get user by id returns 400 if invalid user's identifier is used`, async () => {
    await request(app.getHttpServer()).get('/users/NAN').expect(400);

    expect(usersService.findById).toBeCalledTimes(0);
  });

  it(`get user by id returns 404 if user doesn't exist`, async () => {
    usersService.findById.mockResolvedValue(null);

    await request(app.getHttpServer()).get('/users/1').expect(404);

    expect(usersService.findById).toBeCalledWith(1);
  });

  it(`update first name and last name successfully`, async () => {
    const newFirstName = 'new-first-name';
    const newLastName = 'new-last-name';
    const updateUserRequest = new UpdateUserDto(newFirstName, newLastName);
    const updatedUser = new UserDto(
      user.id,
      user.email,
      newFirstName,
      newLastName,
      user.createdAt,
      user.deletedAt,
    );

    usersService.findById.mockResolvedValue(user);
    usersService.update.mockResolvedValue(updatedUser);

    await request(app.getHttpServer())
      .put('/users/1')
      .send(updateUserRequest)
      .expect(200)
      .expect(asResponse(updatedUser));

    expect(usersService.findById).toBeCalledWith(1);
    expect(usersService.update).toBeCalledWith(1, updateUserRequest);
  });

  it(`update only first name successfully`, async () => {
    const newFirstName = 'new-first-name';
    const updatedUser = new UserDto(
      user.id,
      user.email,
      newFirstName,
      user.lastName,
      user.createdAt,
      user.deletedAt,
    );

    usersService.findById.mockResolvedValue(user);
    usersService.update.mockResolvedValue(updatedUser);

    await request(app.getHttpServer())
      .put('/users/1')
      .send({
        firstName: newFirstName,
      })
      .expect(200)
      .expect(asResponse(updatedUser));

    expect(usersService.findById).toBeCalledWith(1);
    expect(usersService.update).toBeCalledWith(
      1,
      new UpdateUserDto(newFirstName, undefined),
    );
  });

  it(`update only last name successfully`, async () => {
    const newLastName = 'new-last-name';
    const updatedUser = new UserDto(
      user.id,
      user.email,
      user.firstName,
      newLastName,
      user.createdAt,
      user.deletedAt,
    );

    usersService.findById.mockResolvedValue(user);
    usersService.update.mockResolvedValue(updatedUser);

    await request(app.getHttpServer())
      .put('/users/1')
      .send({
        lastName: newLastName,
      })
      .expect(200)
      .expect(asResponse(updatedUser));

    expect(usersService.findById).toBeCalledWith(1);
    expect(usersService.update).toBeCalledWith(
      1,
      new UpdateUserDto(undefined, newLastName),
    );
  });

  it(`update returns 400 if invalid user's identifier is used`, async () => {
    const updateUserRequest = new UpdateUserDto('newFirstname', 'newLastname');

    await request(app.getHttpServer())
      .put('/users/NAN')
      .send(updateUserRequest)
      .expect(400);

    expect(usersService.findById).toBeCalledTimes(0);
    expect(usersService.update).toBeCalledTimes(0);
  });

  it(`update returns 404 if user doesn't exist`, async () => {
    usersService.findById.mockResolvedValue(null);

    const updateUserRequest = new UpdateUserDto('newFirstname', 'newLastname');

    await request(app.getHttpServer())
      .put('/users/1')
      .send(updateUserRequest)
      .expect(404);

    expect(usersService.findById).toBeCalledWith(1);
    expect(usersService.update).toBeCalledTimes(0);
  });

  it(`update returns 404 if user has been deleted`, async () => {
    const deletedUser = new UserDto(
      user.id,
      user.email,
      user.firstName,
      user.lastName,
      user.createdAt,
      new Date(),
    );
    usersService.findById.mockResolvedValue(deletedUser);

    const updateUserRequest = new UpdateUserDto('newFirstname', 'newLastname');

    await request(app.getHttpServer())
      .put('/users/1')
      .send(updateUserRequest)
      .expect(404);

    expect(usersService.findById).toBeCalledWith(1);
    expect(usersService.update).toBeCalledTimes(0);
  });

  it(`update returns 400 if there is extra field in request`, async () => {
    await request(app.getHttpServer())
      .put('/users/1')
      .send({
        firstName: 'D',
        lastName: 'L',
        extraField: 'extra',
      })
      .expect(400);

    expect(usersService.findById).toBeCalledTimes(0);
    expect(usersService.update).toBeCalledTimes(0);
  });

  it(`update returns 400 if first name is empty`, async () => {
    await request(app.getHttpServer())
      .put('/users/1')
      .send({
        firstName: '',
      })
      .expect(400);

    expect(usersService.findById).toBeCalledTimes(0);
    expect(usersService.update).toBeCalledTimes(0);
  });

  it(`update returns 400 if last name is empty`, async () => {
    await request(app.getHttpServer())
      .put('/users/1')
      .send({
        lastName: '',
      })
      .expect(400);

    expect(usersService.findById).toBeCalledTimes(0);
    expect(usersService.update).toBeCalledTimes(0);
  });

  it(`update returns 400 if first name is too long`, async () => {
    await request(app.getHttpServer())
      .put('/users/1')
      .send({
        firstName: 'L'.repeat(101),
      })
      .expect(400);

    expect(usersService.findById).toBeCalledTimes(0);
    expect(usersService.update).toBeCalledTimes(0);
  });

  it(`update returns 400 if last name is too long`, async () => {
    await request(app.getHttpServer())
      .put('/users/1')
      .send({
        lastName: 'L'.repeat(101),
      })
      .expect(400);

    expect(usersService.findById).toBeCalledTimes(0);
    expect(usersService.update).toBeCalledTimes(0);
  });

  it(`delete user successfully`, async () => {
    const deletedUser = new UserDto(
      user.id,
      user.email,
      user.firstName,
      user.lastName,
      user.createdAt,
      new Date(),
    );

    usersService.findById.mockResolvedValue(user);
    usersService.remove.mockResolvedValue(deletedUser);

    await request(app.getHttpServer())
      .delete('/users/1')
      .expect(200)
      .expect(asResponse(deletedUser));

    expect(usersService.findById).toBeCalledWith(1);
    expect(usersService.remove).toBeCalledWith(1);
  });

  it(`delete user returns 400 if invalid user's identifier is used`, async () => {
    await request(app.getHttpServer()).delete('/users/NAN').expect(400);

    expect(usersService.findById).toBeCalledTimes(0);
    expect(usersService.remove).toBeCalledTimes(0);
  });

  it(`delete user returns 404 if user doesn't exist`, async () => {
    usersService.findById.mockResolvedValue(null);

    await request(app.getHttpServer()).delete('/users/1').expect(404);

    expect(usersService.findById).toBeCalledWith(1);
    expect(usersService.remove).toBeCalledTimes(0);
  });

  it(`delete user returns 404 if user has been deleted`, async () => {
    const deletedUser = new UserDto(
      user.id,
      user.email,
      user.firstName,
      user.lastName,
      user.createdAt,
      new Date(),
    );
    usersService.findById.mockResolvedValue(deletedUser);

    await request(app.getHttpServer()).delete('/users/1').expect(404);

    expect(usersService.findById).toBeCalledWith(1);
    expect(usersService.remove).toBeCalledTimes(0);
  });

  it(`list users without query params uses default values`, async () => {
    usersService.findAll.mockResolvedValue([user]);

    await request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect([asResponse(user)]);

    expect(usersService.findAll).toBeCalledWith(new FilterDto());
  });

  it(`list users passes query params to the service properly`, async () => {
    usersService.findAll.mockResolvedValue([]);

    await request(app.getHttpServer())
      .get('/users')
      .query({ limit: 7 })
      .query({ offset: 777 })
      .query({ sort: 'email' })
      .query({ order: 'DESC' })
      .query({ showDeleted: true })
      .expect(200)
      .expect([]);

    const filter = new FilterDto(
      7,
      777,
      SortByField.EMAIL,
      SortOrder.DESC,
      true,
    );
    expect(usersService.findAll).toBeCalledWith(filter);
  });

  it(`list users returns 400 if limit is zero`, async () => {
    await request(app.getHttpServer())
      .get('/users')
      .query({ limit: 0 })
      .expect(400);

    expect(usersService.findAll).toBeCalledTimes(0);
  });

  it(`list users returns 400 if limit is too big`, async () => {
    await request(app.getHttpServer())
      .get('/users')
      .query({ limit: 123 })
      .expect(400);

    expect(usersService.findAll).toBeCalledTimes(0);
  });

  it(`list users returns 400 if offset is negative`, async () => {
    await request(app.getHttpServer())
      .get('/users')
      .query({ offset: -1 })
      .expect(400);

    expect(usersService.findAll).toBeCalledTimes(0);
  });

  it(`list users returns 400 if sort field is invalid`, async () => {
    await request(app.getHttpServer())
      .get('/users')
      .query({ sort: 'invalid' })
      .expect(400);

    expect(usersService.findAll).toBeCalledTimes(0);
  });

  it(`list users returns 400 if order field is invalid`, async () => {
    await request(app.getHttpServer())
      .get('/users')
      .query({ order: 'invalid' })
      .expect(400);

    expect(usersService.findAll).toBeCalledTimes(0);
  });

  it(`list users returns 400 if show deleted field is not boolean`, async () => {
    await request(app.getHttpServer())
      .get('/users')
      .query({ showDeleted: 'IS_NOT_A_BOOLEAN' })
      .expect(400);

    expect(usersService.findAll).toBeCalledTimes(0);
  });
});
