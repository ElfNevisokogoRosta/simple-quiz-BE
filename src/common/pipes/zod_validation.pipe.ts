import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      const parsedValue = this.schema.parse(value);
      console.log(
        {
          value,
          parsedValue,
        },
        typeof value,
      );
      return parsedValue;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Validation failed');
    }
  }
}
