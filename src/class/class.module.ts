import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Class } from 'src/entities/class.entity';
import { User } from 'src/entities/user.entity';
import { ClassController } from './class.controller';
import { ClassService } from './class.service';
import { ClassUser } from 'src/entities/class_user.entity';
import { Schedule } from 'src/entities/schedule.entity';
import { Lesson } from 'src/entities/lesson.entity';
import { ClassTask } from 'src/entities/class_task.entity';
import { ClassTaskFile } from 'src/entities/class_task_file.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Class,
      ClassUser,
      Schedule,
      Lesson,
      ClassTask,
      ClassTaskFile,
    ]),
  ],
  controllers: [ClassController],
  providers: [ClassService],
})
export class ClassModule {}
