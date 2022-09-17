import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import Task from './task.model';
import TaskStatus from './enums/task-status.enum';
import CreateTaskDto from './dto/create-task.dto';
import UpdateTaskDto from './dto/update-task.dto';
import GetTasksFilterDto from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private _tasks: Array<Task> = [];

  async create({ title, description }: CreateTaskDto): Promise<Task> {
    return new Promise(resolve => {
      const newTask: Task = {
        id: uuid(),
        title,
        description,
        status: TaskStatus.OPEN,
      };

      this._tasks.push(newTask);

      resolve(newTask);
    });
  }

  async modify(id: string, { title, description, status }: UpdateTaskDto): Promise<Task> {
    let task = await this.get(id);

    return new Promise(resolve => {
      task = {
        ...task,
        title,
        description,
        status,
      };

      this._tasks = [...this._tasks.filter(t => t.id !== id), task];

      resolve(task);
    });
  }

  async patchStatus(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.get(id);

    return new Promise(resolve => {
      task.status = status;
      resolve(task);
    });
  }

  async get(id: string): Promise<Task> {
    return new Promise((resolve, reject) => {
      const task = this._tasks.find(t => t.id === id);

      if (!task) {
        reject(new NotFoundException(`task with id ${id} not found`));
      } else {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        resolve(task!);
      }
    });
  }

  async getAll(): Promise<Array<Task>> {
    return new Promise(resolve => {
      resolve(this._tasks);
    });
  }

  async getFiltered({ status, search }: GetTasksFilterDto): Promise<Array<Task>> {
    let tasks: Array<Task> = [...this._tasks];

    return new Promise(resolve => {
      if (status) {
        tasks = tasks.filter(t => t.status === status);
      }

      if (search) {
        tasks = tasks.filter(t => t.title.includes(search) || t.description.includes(search));
      }

      resolve(tasks);
    });
  }

  async remove(id: string): Promise<void> {
    return new Promise(resolve => {
      this._tasks = this._tasks.filter(t => t.id !== id);

      resolve();
    });
  }
}
