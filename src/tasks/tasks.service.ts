import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import User from '../auth/entities/user.entity';
import CreateTaskDto from './dto/create-task.dto';
import UpdateTaskDto from './dto/update-task.dto';
import GetTasksFilterDto from './dto/get-tasks-filter.dto';
import Task from './entities/task.entity';
import TaskStatus from './@enums/task-status.enum';

@Injectable()
export default class TasksService {
  private logger = new Logger('TasksService', { timestamp: true });

  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async get(id: string, user: User): Promise<Task> {
    const task = await this.tasksRepository.findOne({ where: { id, user } });

    if (!task) {
      this.logger.error(`task for user ${user.username} with id ${id} not found`);
      throw new NotFoundException(`task with id ${id} not found`);
    }

    return task;
  }

  async getMany({ search, status }: GetTasksFilterDto, user: User): Promise<Array<Task>> {
    const query = this.tasksRepository.createQueryBuilder('task');
    query.where({ user });

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

    try {
      return await query.getMany();
    } catch (e) {
      this.logger.error(`failed to get tasks - status: ${status} search: ${search}`, e.stack);
      throw new InternalServerErrorException();
    }
  }

  async create(dto: CreateTaskDto, user: User): Promise<Task> {
    const task = this.tasksRepository.create({
      ...dto,
      user,
      status: TaskStatus.OPEN,
    });

    return await this.tasksRepository.save(task);
  }

  async modify(
    id: string,
    { title, description, status }: UpdateTaskDto,
    user: User,
  ): Promise<Task> {
    const task = await this.get(id, user);

    task.title = title;
    task.description = description;
    task.status = status;

    return await this.tasksRepository.save(task);
  }

  async patchStatus(id: string, status: TaskStatus, user: User): Promise<Task> {
    const task = await this.get(id, user);

    task.status = status;

    return await this.tasksRepository.save(task);
  }

  async remove(id: string, user: User): Promise<void> {
    try {
      const result = await this.tasksRepository.delete({ id, user });

      if (!result.affected) {
        this.logger.warn(`task for user ${user.username} with id ${id} not deleted`);
        throw new NotFoundException(`task with id ${id} not found`);
      }

      return;
    } catch (e) {
      this.logger.error(`task for user ${user.username} with id ${id} not deleted`, e.stack);
      throw e;
    }
  }
}
