import { UploadedFile } from 'interfaces';

export interface Parameter {
  title: string;
  value: string;
}

export class CreateEventDto {
  title: string;
  description: string;
  files: UploadedFile[];
  cover: string;
  parameters: Parameter[];
}
