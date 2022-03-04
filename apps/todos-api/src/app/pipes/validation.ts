import { BadRequestException, Provider, ValidationError, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';

export const VALIDATION_PIPE_PROVIDER: Provider = {
  provide: APP_PIPE,
  useValue: new ValidationPipe({
    transform: true,
    exceptionFactory(validationErrors: ValidationError[] = []) {
      return new BadRequestException(validationErrors);
    },
    forbidUnknownValues: true,
    forbidNonWhitelisted: true,
    whitelist: true,
  }),
};
