import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from 'src/entities/event.entity';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { EventFile } from 'src/entities/event_files.entity';
import { EventParameter } from 'src/entities/event_parameter.entity';
import { Class } from 'src/entities/class.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, EventFile, EventParameter, Class]),
  ],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
