import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import GetUser from '../auth/get-user.decorator';
import User from '../auth/entities/user.entity';
import TaskStatus from './@enums/task-status.enum';
import CreateTaskDto from './dto/create-task.dto';
import UpdateTaskDto from './dto/update-task.dto';
import GetTasksFilterDto from './dto/get-tasks-filter.dto';
import Task from './entities/task.entity';
import TasksService from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export default class TasksController {
  private logger = new Logger('TasksController');

  constructor(private _tasksService: TasksService) {}

  @Post()
  async create(@Body() dto: CreateTaskDto, @GetUser() user: User): Promise<Task> {
    return await this._tasksService.create(dto, user);
  }

  @Put('/:id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return await this._tasksService.modify(id, dto, user);
  }

  @Patch('/:id/status')
  async patchStatus(
    @Param('id') id: string,
    @Body('status') status: TaskStatus,
    @GetUser() user: User,
  ): Promise<Task> {
    return await this._tasksService.patchStatus(id, status, user);
  }

  @Get()
  async getTasks(
    @Query() dto: GetTasksFilterDto,
    @GetUser() user: User,
  ): Promise<Array<Task>> {
    this.logger.verbose(
      `retrieving tasks for ${user.username} - status: ${dto.status} search: ${dto.search}`,
    );
    return await this._tasksService.getMany(dto, user);
  }

  @Get('/:id')
  async get(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
    return await this._tasksService.get(id, user);
  }

  @Delete('/:id')
  async delete(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    return await this._tasksService.remove(id, user);
  }
}
