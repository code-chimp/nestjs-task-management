import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CreateTaskDto from './dto/create-task.dto';
import UpdateTaskDto from './dto/update-task.dto';
import GetTasksFilterDto from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import TaskStatus from './task-status.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async get(id: string): Promise<Task> {
    try {
      return await this.tasksRepository.findOneOrFail(id);
    } catch (e) {
      console.error(e);
      throw new NotFoundException(`task with id ${id} not found`);
    }
  }

  async getMany({ search, status }: GetTasksFilterDto): Promise<Array<Task>> {
    const query = this.tasksRepository.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        {
          search: `%${search}%`,
        },
      );
    }

    return await query.getMany();
  }

  async create(dto: CreateTaskDto): Promise<Task> {
    const task = this.tasksRepository.create({
      ...dto,
      status: TaskStatus.OPEN,
    });

    return await this.tasksRepository.save(task);
  }

  async modify(id: string, { title, description, status }: UpdateTaskDto): Promise<Task> {
    const task = await this.get(id);

    task.title = title;
    task.description = description;
    task.status = status;

    return await this.tasksRepository.save(task);
  }

  async patchStatus(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.get(id);

    task.status = status;

    return await this.tasksRepository.save(task);
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.tasksRepository.delete(id);

      if (!result.affected) {
        throw new NotFoundException(`task with id ${id} not found`);
      }

      return;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}
