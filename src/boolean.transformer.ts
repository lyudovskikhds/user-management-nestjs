import { BadRequestException } from '@nestjs/common';

export function parseBoolean(key: string, value: string): boolean {
  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  throw new BadRequestException(`${key} must be a boolean value`);
}
