import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EventParameter {
  @PrimaryGeneratedColumn()
  event_parameter_id: string;

  @Column()
  event_id: string;

  @Column()
  title: string;

  @Column()
  value: string;
}
