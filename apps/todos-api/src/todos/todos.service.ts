import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodosService {
  constructor(@InjectModel(Todo.name) private todos: Model<Todo>) {}

  async create({ title }: CreateTodoDto) {
    return await this.todos.create({
      title,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async findAll(): Promise<Todo[]> {
    return await this.todos.find();
  }

  async findOne(id: string): Promise<Todo> {
    const todo = await this.todos.findById(id);
    if (!todo) {
      throw new NotFoundException();
    }
    return todo;
  }

  async update(id: string, updateTodoDto: UpdateTodoDto) {
    const updated = await this.todos.findByIdAndUpdate(
      id,
      { $set: { ...updateTodoDto, updatedAt: new Date() } },
      { upsert: false, returnOriginal: false },
    );

    if (!updated) {
      throw new NotFoundException();
    }

    return updated;
  }

  async remove(id: string) {
    await this.todos.findByIdAndRemove(id);
  }
}
