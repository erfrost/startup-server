import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ClassService } from './class.service';
import { CreateClassDto } from './dto/create-class.dto';
import { Class } from 'src/entities/class.entity';
import { JoinToClassDto } from './dto/join-to-class.dto';
import { ScheduleUpdateDto } from './dto/schedule-update.dto';
import { User } from 'src/entities/user.entity';
import { Lesson } from 'src/entities/lesson.entity';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Get('/:teacher_id')
  async getClasses(@Param('teacher_id') teacher_id: string): Promise<Class[]> {
    return this.classService.getClasses(teacher_id);
  }

  @Get('/students/:class_id')
  async getStudents(@Param('class_id') class_id: string): Promise<User[]> {
    return this.classService.getStudents(class_id);
  }

  @Post('/:teacher_id')
  async createClass(
    @Param('teacher_id') teacher_id: string,
    @Body() createClassDto: CreateClassDto,
  ): Promise<Class> {
    return this.classService.createClass(teacher_id, createClassDto);
  }

  @Post('/join/:user_id')
  async joinToClass(
    @Param('user_id') user_id: string,
    @Body() joinToClassDto: JoinToClassDto,
  ): Promise<void> {
    this.classService.joinToClass(user_id, joinToClassDto);
  }

  @Get('/link/:class_id')
  async getLink(@Param('class_id') class_id: string): Promise<string> {
    return this.classService.getLink(class_id);
  }

  @Post('/exit/:class_id')
  async exitFromClass(
    @Param('class_id') class_id: string,
    @Query('userId') user_id: string,
  ): Promise<void> {
    this.classService.exitFromClass(class_id, user_id);
  }

  @Get('/schedule/:class_id')
  async getSchedule(
    @Param('class_id') class_id: string,
    @Query('date') date: string,
  ): Promise<Lesson[]> {
    return this.classService.getSchedule(class_id, date);
  }

  @Post('/schedule/:class_id')
  async scheduleUpdate(
    @Param('class_id') class_id: string,
    @Body() scheduleUpdateDto: ScheduleUpdateDto,
  ): Promise<void> {
    this.classService.scheduleUpdate(class_id, scheduleUpdateDto);
  }

  @Get('/getTasks/:class_id')
  async getTasks(
    @Param('class_id') class_id: string,
    @Query('date') date: string,
  ): Promise<any> {
    return this.classService.getTasks(class_id, date);
  }

  @Post('/createTask/:class_id')
  async createTask(
    @Param('class_id') class_id: string,
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<void> {
    this.classService.createTask(class_id, createTaskDto);
  }

  @Post('/deleteTask/:class_id')
  async deleteTask(
    @Param('class_id') class_id: string,
    @Query('task_id') task_id: string,
  ): Promise<void> {
    this.classService.deleteTask(class_id, task_id);
  }
}
