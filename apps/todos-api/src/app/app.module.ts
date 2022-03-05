import { HealthModule, VALIDATION_PIPE_PROVIDER } from '@backend-e2e/api-utils';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { environment } from '../environments/environment';
import { TodosModule } from '../todos/todos.module';

@Module({
  imports: [MongooseModule.forRoot(environment.mongoUri), HealthModule, TodosModule],
  providers: [VALIDATION_PIPE_PROVIDER],
})
export class AppModule {}
