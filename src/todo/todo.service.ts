import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';
import { LoggerMiddleware } from 'src/common/middleware/logger.middleware';

@Injectable()
export class TodoService {
  private readonly logger = new Logger(TodoService.name);

  private todos: Todo[] = [];
  private id: number = 1;

  create(dto: CreateTodoDto): Todo {
    const newTodo: Todo = {
      id: this.id++,
      title: dto.title,
      description: dto.description,
      isDone: false,
    };
    this.todos.push(newTodo);
    this.logger.log(`Created new todo: ${newTodo.title}`);
    return newTodo;
  }

  findAll(): Todo[] {
    this.logger.log(`Barcha todolar so'raldi`);
    return this.todos;
  }

  findOne(id: number): Todo {
    const todo = this.todos.find((t) => t.id === id);
    if (!todo) {
      this.logger.warn(`Todo topilmadi: id=${id}`);
      throw new NotFoundException('Todo not found');
    }
    this.logger.log(`Todo topildi: ${todo.title}`);
    return todo;
  }

  update(id: number, dto: UpdateTodoDto): Todo {
    const todo = this.findOne(id);
    Object.assign(todo, dto);
    this.logger.log(`Todo yangilandi: id=${id}`);
    return todo;
  }

  remove(id: number): void {
    const index = this.todos.findIndex((t) => t.id === id);
    if (index === -1) {
      this.logger.warn(`O'chirishda xatolik: id=${id} topilmadi`);
      throw new NotFoundException('Not found id');
    }
    this.logger.log(`Todo o'chirildi: id=${id}`);
    this.todos.splice(index, 1);
  }
}
