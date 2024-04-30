import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Files {
  @PrimaryGeneratedColumn()
  files_id: string;

  @Column()
  url: string;

  @Column()
  type: string;

  @Column()
  name: string;
}
