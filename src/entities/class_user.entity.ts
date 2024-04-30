import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ClassUser {
  @PrimaryGeneratedColumn()
  user_id: string;

  @Column()
  class_id: string;
}
