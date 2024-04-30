import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Schedule {
  @PrimaryGeneratedColumn()
  schedule_id: string;

  @Column()
  class_id: string;

  @Column()
  date: string;
}
