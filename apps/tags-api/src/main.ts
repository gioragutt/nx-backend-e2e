/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { setupSwagger } from '@backend-e2e/api-utils';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupSwagger(app, {
    document: new DocumentBuilder().setTitle('Tags API').setVersion('1.0'),
  });

  const port = process.env.PORT || 3334;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/swagger`);
}

bootstrap();
