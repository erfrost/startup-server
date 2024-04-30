import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EventFile {
  @PrimaryGeneratedColumn()
  event_file_id: string;

  @Column()
  event_id: string;

  @Column()
  url: string;

  @Column()
  type: string;

  @Column()
  name: string;
}
