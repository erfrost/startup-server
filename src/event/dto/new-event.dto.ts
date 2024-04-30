import { EventFile } from 'src/entities/event_files.entity';
import { EventParameter } from 'src/entities/event_parameter.entity';

export class NewEventDto {
  event_id: string;
  title: string;
  description: string;
  files: EventFile[];
  cover: string;
  parameters: EventParameter[];
}
