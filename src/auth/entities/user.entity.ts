import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import Task from '../../tasks/entities/task.entity';

@Entity('user')
export default class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @OneToMany(() => Task, task => task.user, { eager: true })
  tasks: Array<Task>;
}
