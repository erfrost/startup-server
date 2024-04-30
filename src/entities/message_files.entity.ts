import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MessageFiles {
  @PrimaryGeneratedColumn()
  message_files_id: string;

  @Column()
  message_id: string;

  @Column()
  url: string;

  @Column()
  type: string;

  @Column()
  name: string;
}
