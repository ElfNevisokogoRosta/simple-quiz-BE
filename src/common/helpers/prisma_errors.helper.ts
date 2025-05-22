import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

function prismaErrorHandling(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        throw new ConflictException('Duplicate key error (unique constraint)');
      case 'P2025':
        throw new NotFoundException('Record not found');
      case 'P2003':
        throw new BadRequestException('Foreign key constraint failed');
      default:
        throw new BadRequestException(error.message);
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    throw new BadRequestException('Validation error: ' + error.message);
  }

  throw new InternalServerErrorException(
    error instanceof Error ? error.message : 'Unexpected database error',
  );
}

export { prismaErrorHandling };
