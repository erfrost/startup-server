import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Lesson {
  @PrimaryGeneratedColumn()
  lesson_id: string;

  @Column()
  schedule_id: string;

  @Column()
  time: string;

  @Column()
  name: string;
}
