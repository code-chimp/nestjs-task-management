import TaskStatus from '../task-status.enum';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export default class GetTasksFilterDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsString()
  search?: string;
}
