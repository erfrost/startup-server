import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id: string;

  @Column()
  nickname: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  role: string;
}
