import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { environment } from '../environments/environment';
import { TodosModule } from '../todos/todos.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [MongooseModule.forRoot(environment.mongoUri), HealthModule, TodosModule],
})
export class AppModule {}
