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
} from '@nestjs/common';
import TaskStatus from './@enums/task-status.enum';
import CreateTaskDto from './dto/create-task.dto';
import UpdateTaskDto from './dto/update-task.dto';
import GetTasksFilterDto from './dto/get-tasks-filter.dto';
import Task from './entities/task.entity';
import TasksService from './tasks.service';

@Controller('tasks')
export default class TasksController {
  private logger = new Logger('TasksController');

  constructor(private _tasksService: TasksService) {}

  @Post()
  async create(@Body() dto: CreateTaskDto): Promise<Task> {
    console.log('controller method');
    return await this._tasksService.create(dto);
  }

  @Put('/:id')
  async update(@Param('id') id: string, @Body() dto: UpdateTaskDto): Promise<Task> {
    return await this._tasksService.modify(id, dto);
  }

  @Patch('/:id/status')
  async patchStatus(
    @Param('id') id: string,
    @Body('status') status: TaskStatus,
  ): Promise<Task> {
    return await this._tasksService.patchStatus(id, status);
  }

  @Get()
  async getTasks(@Query() dto: GetTasksFilterDto): Promise<Array<Task>> {
    this.logger.verbose(`retrieving tasks - status: ${dto.status} search: ${dto.search}`);
    return await this._tasksService.getMany(dto);
  }

  @Get('/:id')
  async get(@Param('id') id: string): Promise<Task> {
    return await this._tasksService.get(id);
  }

  @Delete('/:id')
  async delete(@Param('id') id: string): Promise<void> {
    return await this._tasksService.remove(id);
  }
}
