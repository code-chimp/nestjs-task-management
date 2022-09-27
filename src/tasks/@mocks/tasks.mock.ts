import Task from '../entities/task.entity';
import UsersMock from '../../auth/@mocks/users.mock';
import TaskStatus from '../@enums/task-status.enum';

const TasksMock: Array<Task> = [
  {
    id: 'one',
    title: 'first task',
    description: 'first task desc',
    status: TaskStatus.OPEN,
    user: UsersMock[0],
  },
  {
    id: 'two',
    title: 'second task',
    description: 'second task desc',
    status: TaskStatus.DONE,
    user: UsersMock[0],
  },
  {
    id: 'three',
    title: 'third task',
    description: 'third task desc',
    status: TaskStatus.IN_PROGRESS,
    user: UsersMock[1],
  },
];

export default TasksMock;
