import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Class {
  @PrimaryGeneratedColumn()
  class_id: string;

  @Column()
  teacher_id: string;

  @Column()
  class_name: string;

  @Column()
  join_link: string;
}
