import TaskStatus from './enums/task-status.enum';

interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
}

export default Task;
