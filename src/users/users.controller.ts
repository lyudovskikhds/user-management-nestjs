import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  ConflictException,
  NotFoundException,
  Put,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { FilterDto } from './dto/filter.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create a new user.' })
  @ApiCreatedResponse({
    description: 'The user has been successfully created.',
    type: UserDto,
  })
  @ApiConflictResponse({
    description: 'Failed to create user because of email conflict.',
  })
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    if (await this.usersService.findByEmail(createUserDto.email)) {
      throw new ConflictException(
        `The user with that email (${createUserDto.email}) already exists!`,
      );
    }

    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: 'List users.' })
  @ApiOkResponse({
    description: 'The list of users.',
    type: UserDto,
    isArray: true,
  })
  @Get()
  async findAll(@Query() filter: FilterDto) {
    return this.usersService.findAll(filter);
  }

  @ApiOperation({ summary: 'Find the user by the identifier.' })
  @ApiParam({
    name: 'id',
    description: 'The identifier of the user.',
    example: '1',
  })
  @ApiOkResponse({
    description: 'The user has been found.',
    type: UserDto,
  })
  @ApiNotFoundResponse({
    description: 'Failed to find the user.',
  })
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findById(id);

    if (!user) {
      throw new NotFoundException(
        `The user with that id (${id}) doesn't exist!`,
      );
    }

    return user;
  }

  @ApiOperation({ summary: 'Update the user.' })
  @ApiParam({
    name: 'id',
    description: 'The identifier of the user.',
    example: '1',
  })
  @ApiOkResponse({
    description: 'The user has been updated.',
    type: UserDto,
  })
  @ApiNotFoundResponse({
    description: 'The user has not been found or has already been deleted.',
  })
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.usersService.findById(id);

    if (!user) {
      throw new NotFoundException(
        `The user with that id (${id}) doesn't exist!`,
      );
    }

    if (user.deletedAt) {
      throw new NotFoundException(
        `The user with that id (${id}) has already been deleted!`,
      );
    }

    return this.usersService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Delete the user by the identifier.' })
  @ApiParam({
    name: 'id',
    description: 'The identifier of the user.',
    example: '1',
  })
  @ApiOkResponse({
    description: 'The user has been deleted.',
    type: UserDto,
  })
  @ApiNotFoundResponse({
    description: 'The user has not been found or has already been deleted.',
  })
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findById(id);

    if (!user) {
      throw new NotFoundException(
        `The user with that id (${id}) doesn't exist!`,
      );
    }

    if (user.deletedAt) {
      throw new NotFoundException(
        `The user with that id (${id}) has already been deleted!`,
      );
    }

    return this.usersService.remove(id);
  }
}
