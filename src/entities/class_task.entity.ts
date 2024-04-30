import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ClassTask {
  @PrimaryGeneratedColumn()
  class_task_id: string;

  @Column()
  class_id: string;

  @Column()
  date: string;

  @Column()
  title: string;

  @Column()
  description: string;
}
