import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  message_id: string;

  @Column()
  chat_id: string;

  @Column()
  user_id: string;

  @Column()
  date: Date;

  @Column()
  text: string;

  @Column()
  isRead: boolean;
}
