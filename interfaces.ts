import { MessageFiles } from 'src/entities/message_files.entity';

export interface AuthReturn {
  user_id: string;
  access_token: string;
  refresh_token: string;
}

export interface Client {
  socket_id: string;
  user_id: string;
}

export interface MessageFormatted {
  message_id: string;
  chat_id: string;
  user_id: string;
  date: Date;
  time: string;
  text?: string;
  content: {
    text: string;
    files: Partial<MessageFiles>[];
    audio: Partial<MessageFiles> | null;
  };
}

export interface LastMessage {
  avatar_url: string;
  time: string;
  content: {
    text: string;
    files: Partial<MessageFiles>[];
    audio: Partial<MessageFiles> | null;
  };
}

export interface UploadedFile {
  url: string;
  type: string;
  name: string;
}
