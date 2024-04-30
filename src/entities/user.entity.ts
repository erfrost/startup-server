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

  @Column()
  confirmed: boolean;

  @Column()
  confirmationCode: string;

  @Column({ nullable: true })
  avatar_url?: string;

  @Column({ nullable: true })
  birth_date?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  discord?: string;

  @Column({ nullable: true })
  class_id?: string;

  @Column()
  online_status: boolean;

  @Column({ nullable: true })
  last_online_date: Date;
}
