import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import Task from './task.model';
import CreateTaskDto from './dto/create-task.dto';
import UpdateTaskDto from './dto/update-task.dto';
import TaskStatus from './enums/task-status.enum';
import GetTasksFilterDto from './dto/get-tasks-filter.dto';

@Controller('tasks')
export class TasksController {
  constructor(private _tasksService: TasksService) {}

  @Post()
  async create(@Body() dto: CreateTaskDto): Promise<Task> {
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
    return Object.keys(dto).length
      ? await this._tasksService.getFiltered(dto)
      : await this._tasksService.getAll();
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
