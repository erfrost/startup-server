import { Lesson } from 'src/entities/lesson.entity';

export class ScheduleUpdateDto {
  readonly schedule: Lesson[];
  readonly date: string;
}
