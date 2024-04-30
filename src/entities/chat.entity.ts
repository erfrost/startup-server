import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  chat_id: string;

  @Column()
  user_id: string;

  @Column()
  recipient_id: string;
}
