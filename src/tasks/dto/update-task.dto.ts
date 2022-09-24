import TaskStatus from '../task-status.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';

export default class UpdateTaskDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsEnum(TaskStatus)
  status: TaskStatus;
}
