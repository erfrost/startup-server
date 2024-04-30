interface FileItem {
  url: string;
  type: string;
  name: string;
}

export class CreateTaskDto {
  readonly title: string;
  readonly description: string;
  readonly files: FileItem[];
  readonly date: string;
}
