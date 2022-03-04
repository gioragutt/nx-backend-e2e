import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodosService {
  constructor(@InjectModel(Todo.name) private todo: Model<Todo>) {}

  async create({ title }: CreateTodoDto) {
    await this.todo.create({
      title,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async findAll(): Promise<Todo[]> {
    return await this.todo.find();
  }

  async findOne(id: string): Promise<Todo> {
    const todo = await this.todo.findById(id);
    if (!todo) {
      throw new NotFoundException();
    }
    return todo;
  }

  async update(id: string, updateTodoDto: UpdateTodoDto) {
    const updated = await this.todo.findByIdAndUpdate(
      id,
      { $set: { ...updateTodoDto, updatedAt: new Date() } },
      { upsert: false },
    );

    if (!updated) {
      throw new NotFoundException();
    }
  }

  remove(id: number) {
    return `This action removes a #${id} todo`;
  }
}
