import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import TaskStatus from '../@enums/task-status.enum';
import User from '../../auth/entities/user.entity';
import { Exclude } from 'class-transformer';

@Entity('task')
export default class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TaskStatus;

  @ManyToOne(() => User, user => user.tasks, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: User;
}
