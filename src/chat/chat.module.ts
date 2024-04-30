import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { Chat } from 'src/entities/chat.entity';
import { ChatGateway } from './chat.gateway';
import { Message } from 'src/entities/message.entity';
import { MessageFiles } from 'src/entities/message_files.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Chat, Message, MessageFiles])],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
})
export class ChatModule {}
