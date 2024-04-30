import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { NewEventDto } from './dto/new-event.dto';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get('/getEvents/:class_id')
  async getEvents(@Param('class_id') class_id: string): Promise<any> {
    return this.eventService.getEvents(class_id);
  }

  @Post('/createEvent/:class_id')
  async createEvent(
    @Body() createEventDto: CreateEventDto,
    @Param('class_id') class_id: string,
  ): Promise<NewEventDto> {
    return this.eventService.createEvent(createEventDto, class_id);
  }

  @Delete('/deleteEvent/:event_id')
  async deleteEvent(@Param('event_id') event_id: string): Promise<void> {
    return this.eventService.deleteEvent(event_id);
  }
}
