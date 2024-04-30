import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from 'src/entities/event.entity';
import { Repository } from 'typeorm';
import { CreateEventDto, Parameter } from './dto/create-event.dto';
import { UploadedFile } from 'interfaces';
import { EventFile } from 'src/entities/event_files.entity';
import { EventParameter } from 'src/entities/event_parameter.entity';
import { Class } from 'src/entities/class.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(EventFile)
    private readonly eventFileRepository: Repository<EventFile>,
    @InjectRepository(EventParameter)
    private readonly eventParameterRepository: Repository<EventParameter>,
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
  ) {}

  async getEvents(classId: string) {
    if (!classId) {
      throw new HttpException(
        'Неверные параметры запроса',
        HttpStatus.BAD_REQUEST,
      );
    }

    const currentClass: Class = await this.classRepository.findOne({
      where: {
        class_id: classId,
      },
    });
    if (!currentClass) {
      throw new HttpException('Класс не найден', HttpStatus.BAD_REQUEST);
    }

    const events: Event[] = await this.eventRepository.find({
      where: {
        class_id: classId,
      },
    });

    const result: any = await Promise.all(
      events.map(async (event: Event) => {
        const files: EventFile[] = await this.eventFileRepository.find({
          where: {
            event_id: event.event_id,
          },
        });
        const parameters: EventParameter[] =
          await this.eventParameterRepository.find({
            where: {
              event_id: event.event_id,
            },
          });

        return {
          ...event,
          files,
          parameters,
        };
      }),
    );

    return result;
  }

  async createEvent(dto: CreateEventDto, classId: string) {
    const { title, description, files, cover, parameters } = dto;
    if (!classId || !title) {
      throw new HttpException(
        'Неверные параметры запроса',
        HttpStatus.BAD_REQUEST,
      );
    }

    const eventModel: Event = this.eventRepository.create({
      class_id: classId,
      title,
      description,
      cover,
    });
    const newEvent: Event = await this.eventRepository.save(eventModel);

    const newFiles: EventFile[] = await Promise.all(
      files.map(async (file: UploadedFile) => {
        const fileModel: EventFile = this.eventFileRepository.create({
          event_id: newEvent.event_id,
          ...file,
        });
        return await this.eventFileRepository.save(fileModel);
      }),
    );

    const newParameters: EventParameter[] = await Promise.all(
      parameters.map(async (param: Parameter) => {
        const paramModel: EventParameter = this.eventParameterRepository.create(
          {
            event_id: newEvent.event_id,
            ...param,
          },
        );

        return await this.eventParameterRepository.save(paramModel);
      }),
    );

    return {
      event_id: newEvent.event_id,
      title: newEvent.title,
      description: newEvent.description,
      files: newFiles,
      cover: newEvent.cover,
      parameters: newParameters,
    };
  }

  async deleteEvent(event_id: string) {
    if (!event_id) {
      throw new HttpException(
        'Неверные параметры запроса',
        HttpStatus.BAD_REQUEST,
      );
    }

    const event: Event = await this.eventRepository.findOne({
      where: {
        event_id,
      },
    });
    if (!event) {
      throw new HttpException('Мероприятие не найдено', HttpStatus.BAD_REQUEST);
    }

    await this.eventRepository.delete(event.event_id);
  }
}
