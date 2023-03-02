import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNumber, Max, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { parseBoolean } from '../../boolean.transformer';
import { SortByField } from '../enums/sort.by.field';
import { SortOrder } from '../enums/sort.order';

export class FilterDto {
  @ApiPropertyOptional({
    description: 'Maximum number of users in the response.',
    example: '100',
    default: 25,
    minimum: 1,
    maximum: 100,
  })
  @Min(1)
  @Max(100)
  @IsNumber()
  @Type(() => Number)
  readonly limit: number;

  @ApiPropertyOptional({
    description: 'Number of users to skip before putting in the response.',
    example: '0',
    default: 0,
    minimum: 0,
  })
  @Min(0)
  @IsNumber()
  @Type(() => Number)
  readonly offset: number;

  @ApiPropertyOptional({
    description: 'Sort the users by the given conditions, in order.',
    enum: SortByField,
    example: 'email',
    default: 'id',
  })
  @IsEnum(SortByField)
  readonly sort: SortByField;

  @ApiPropertyOptional({
    description: 'Direction in which the resulting list is sorted.',
    enum: SortOrder,
    example: 'DESC',
    default: 'ASC',
  })
  @IsEnum(SortOrder)
  readonly order: SortOrder;

  @ApiPropertyOptional({
    description: 'Whether or not to return deleted users with this request.',
    example: 'true',
    default: false,
  })
  @Transform(({ key, value }) => parseBoolean(key, value), {
    toClassOnly: true,
  })
  @IsBoolean()
  readonly showDeleted: boolean;

  constructor(
    limit = 25,
    offset = 0,
    sort = SortByField.ID,
    order = SortOrder.ASC,
    showDeleted = false,
  ) {
    this.limit = limit;
    this.offset = offset;
    this.sort = sort;
    this.order = order;
    this.showDeleted = showDeleted;
  }
}
