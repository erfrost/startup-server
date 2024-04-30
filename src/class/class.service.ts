import { ClassTaskFile } from './../entities/class_task_file.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Class } from 'src/entities/class.entity';
import { User } from 'src/entities/user.entity';
import { In, Repository } from 'typeorm';
import { CreateClassDto } from './dto/create-class.dto';
import generateClassLink from 'src/utils/generateClassLink';
import { JoinToClassDto } from './dto/join-to-class.dto';
import * as dotenv from 'dotenv';
import { ClassUser } from 'src/entities/class_user.entity';
import { ScheduleUpdateDto } from './dto/schedule-update.dto';
import { Schedule } from 'src/entities/schedule.entity';
import { Lesson } from 'src/entities/lesson.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { ClassTask } from 'src/entities/class_task.entity';
dotenv.config();

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(ClassUser)
    private readonly classUserRepository: Repository<ClassUser>,
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    @InjectRepository(ClassTask)
    private readonly classTask: Repository<ClassTask>,
    @InjectRepository(ClassTaskFile)
    private readonly classTaskFile: Repository<ClassTaskFile>,
  ) {}

  async getClasses(teacher_id: string) {
    if (!teacher_id) {
      throw new HttpException(
        'Неверные параметры запроса',
        HttpStatus.BAD_REQUEST,
      );
    }

    const currentTeacher: User = await this.userRepository.findOne({
      where: {
        user_id: teacher_id,
      },
    });
    if (!currentTeacher) {
      throw new HttpException('Пользователь не найден', HttpStatus.BAD_REQUEST);
    }

    const classes: Class[] = await this.classRepository.find({
      where: {
        teacher_id,
      },
    });

    return classes;
  }

  async getStudents(class_id: string) {
    if (!class_id) {
      throw new HttpException(
        'Неверные параметры запроса',
        HttpStatus.BAD_REQUEST,
      );
    }

    const currentClass: Class = await this.classRepository.findOne({
      where: {
        class_id,
      },
    });
    if (!currentClass) {
      throw new HttpException('Класс не найден', HttpStatus.BAD_REQUEST);
    }

    const studentsIds: ClassUser[] = await this.classUserRepository.find({
      where: {
        class_id,
      },
      select: ['user_id'],
    });
    const studentsIdsArray: string[] = studentsIds.map(
      (student) => student.user_id,
    );

    const users: User[] = await this.userRepository.find({
      where: {
        user_id: In(studentsIdsArray),
      },
    });

    const formatUsers: User[] = users.map((user: User) => {
      delete user.password;
      return user;
    });

    return formatUsers;
  }

  async createClass(teacher_id: string, dto: CreateClassDto) {
    const { className: class_name } = dto;
    if (!teacher_id || !class_name) {
      throw new HttpException(
        'Неверные параметры запроса',
        HttpStatus.BAD_REQUEST,
      );
    }

    const currentTeacher: User = await this.userRepository.findOne({
      where: {
        user_id: teacher_id,
      },
    });
    if (!currentTeacher) {
      throw new HttpException('Пользователь не найден', HttpStatus.BAD_REQUEST);
    }
    if (currentTeacher.role !== 'teacher') {
      throw new HttpException(
        'Ваша роль не позволяет совершить это действие',
        HttpStatus.BAD_REQUEST,
      );
    }

    const joinLink: string = generateClassLink();

    const model: Class = this.classRepository.create({
      teacher_id,
      class_name,
      join_link: joinLink,
    });

    return await this.classRepository.save(model);
  }

  async joinToClass(user_id: string, dto: JoinToClassDto) {
    const { joinLink: join_link } = dto;
    if (!user_id || !join_link) {
      throw new HttpException(
        'Неверные параметры запроса',
        HttpStatus.BAD_REQUEST,
      );
    }

    const currentUser: User = await this.userRepository.findOne({
      where: {
        user_id,
      },
    });
    if (!currentUser) {
      throw new HttpException('Пользователь не найден', HttpStatus.BAD_REQUEST);
    }
    if (currentUser.role !== 'student') {
      throw new HttpException(
        'Ваша роль не позволяет совершить это действие',
        HttpStatus.BAD_REQUEST,
      );
    }

    const currentClass: Class = await this.classRepository.findOne({
      where: {
        join_link,
      },
    });
    if (!currentClass) {
      throw new HttpException('Класс не найден', HttpStatus.BAD_REQUEST);
    }

    currentUser.class_id = currentClass.class_id;
    await this.userRepository.save(currentUser);

    const classUserModel: ClassUser = this.classUserRepository.create({
      user_id,
      class_id: currentClass.class_id,
    });

    await this.classUserRepository.save(classUserModel);
  }

  async getLink(class_id: string) {
    if (!class_id) {
      throw new HttpException(
        'Неверные параметры запроса',
        HttpStatus.BAD_REQUEST,
      );
    }

    const currentClass: Class = await this.classRepository.findOne({
      where: {
        class_id,
      },
    });

    if (!currentClass) {
      throw new HttpException('Класс не найден', HttpStatus.BAD_REQUEST);
    }

    return currentClass.join_link;
  }

  async exitFromClass(class_id: string, user_id: string) {
    if (!class_id || !user_id) {
      throw new HttpException(
        'Неверные параметры запроса',
        HttpStatus.BAD_REQUEST,
      );
    }

    const currentClass: Class = await this.classRepository.findOne({
      where: {
        class_id,
      },
    });
    if (!currentClass) {
      throw new HttpException('Класс не найден', HttpStatus.BAD_REQUEST);
    }

    const currentUser: ClassUser = await this.classUserRepository.findOne({
      where: {
        user_id,
      },
    });
    if (!currentUser) {
      throw new HttpException('Пользователь не найден', HttpStatus.BAD_REQUEST);
    }

    await this.classUserRepository.delete(currentUser);
  }

  async getSchedule(class_id: string, date: string) {
    if (!class_id || !date) {
      throw new HttpException(
        'Неверне параметры запроса',
        HttpStatus.BAD_REQUEST,
      );
    }

    const currentSchedule: Schedule = await this.scheduleRepository.findOne({
      where: {
        class_id,
        date,
      },
    });
    if (!currentSchedule) {
      throw new HttpException('Расписание не найдено', HttpStatus.BAD_REQUEST);
    }

    const lessons: Lesson[] = await this.lessonRepository.find({
      where: {
        schedule_id: currentSchedule.schedule_id,
      },
    });

    return lessons.sort((a, b) => {
      const timeA = a.time;
      const timeB = b.time;

      if (timeA < timeB) return -1;
      if (timeA > timeB) return 1;

      return 0;
    });
  }

  async scheduleUpdate(class_id: string, dto: ScheduleUpdateDto) {
    const { schedule, date } = dto;
    if (!class_id || !schedule || !date) {
      throw new HttpException(
        'Неверные параметры запроса',
        HttpStatus.BAD_REQUEST,
      );
    }

    const currentSchedule: Schedule = await this.scheduleRepository.findOne({
      where: {
        class_id,
        date,
      },
    });
    if (currentSchedule) {
      schedule.map(async (item) => {
        const currentLesson: Lesson = await this.lessonRepository.findOne({
          where: {
            lesson_id: item.lesson_id,
          },
        });

        if (currentLesson) {
          currentLesson.name = item.name;
          await this.lessonRepository.save(currentLesson);
        } else {
          const model: Lesson = this.lessonRepository.create({
            schedule_id: item.schedule_id,
            time: item.time,
            name: item.name,
          });

          await this.lessonRepository.save(model);
        }
      });
    } else {
      const scheduleModel: Schedule = this.scheduleRepository.create({
        class_id,
        date,
      });

      const newSchedule: Schedule =
        await this.scheduleRepository.save(scheduleModel);

      schedule.map(async (item) => {
        const model: Lesson = this.lessonRepository.create({
          schedule_id: newSchedule.schedule_id,
          time: item.time,
          name: item.name,
        });

        await this.lessonRepository.save(model);
      });
    }
  }

  async getTasks(class_id: string, date: string) {
    if (!class_id || !date) {
      throw new HttpException(
        'Неверные параметры запроса',
        HttpStatus.BAD_REQUEST,
      );
    }

    const tasks: ClassTask[] = await this.classTask.find({
      where: {
        class_id,
        date,
      },
    });

    const taskPromises = tasks.map(async (task: ClassTask) => {
      const files: ClassTaskFile[] = await this.classTaskFile.find({
        where: {
          class_task_id: task.class_task_id,
        },
      });

      return {
        ...task,
        files: files.map((file: ClassTaskFile) => {
          return { url: file.url, type: file.type, name: file.name };
        }),
      };
    });

    return Promise.all(taskPromises);
  }

  async createTask(class_id: string, dto: CreateTaskDto) {
    const { title, description, date, files } = dto;

    if (!class_id || !title || !date || !description) {
      throw new HttpException(
        'Неверные параметры запроса',
        HttpStatus.BAD_REQUEST,
      );
    }

    const taskModel: ClassTask = this.classTask.create({
      class_id,
      title,
      description,
      date,
    });
    const newTask: ClassTask = await this.classTask.save(taskModel);

    files.map(async (file) => {
      const taskFileModel: ClassTaskFile = this.classTaskFile.create({
        class_task_id: newTask.class_task_id,
        url: file.url,
        type: file.type,
        name: file.name,
      });
      await this.classTaskFile.save(taskFileModel);
    });
  }

  async deleteTask(class_id: string, task_id: string) {
    if (!class_id || !task_id) {
      throw new HttpException(
        'Неверные параметры запроса',
        HttpStatus.BAD_REQUEST,
      );
    }

    const task: ClassTask = await this.classTask.findOne({
      where: {
        class_id,
        class_task_id: task_id,
      },
    });
    if (!task) {
      throw new HttpException('Задание не найдено', HttpStatus.BAD_REQUEST);
    }

    const files: ClassTaskFile[] = await this.classTaskFile.find({
      where: {
        class_task_id: task.class_task_id,
      },
    });

    files.map(async (file: ClassTaskFile) => {
      await this.classTaskFile.delete(file);
    });

    await this.classTask.delete(task);
  }
}
