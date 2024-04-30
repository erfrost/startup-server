import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ClassTaskFile {
  @PrimaryGeneratedColumn()
  class_task_file_id: string;

  @Column()
  class_task_id: string;

  @Column()
  url: string;

  @Column()
  type: string;

  @Column()
  name: string;
}
