import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Chat } from 'src/entities/chat.entity';
import { CreateChatDto } from './dto/create-chat.dto';
import { LastMessage, MessageFormatted } from 'interfaces';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('/getChatInfo/:chat_id')
  async getChatInfo(@Param('chat_id') chat_id: string): Promise<Chat> {
    return this.chatService.getChatInfo(chat_id);
  }

  @Get('/getChats/:user_id')
  async getChats(@Param('user_id') user_id: string): Promise<Chat[]> {
    return this.chatService.getChats(user_id);
  }

  @Post('/createChat')
  async createChat(@Body() createChatDto: CreateChatDto): Promise<Chat> {
    return this.chatService.createChat(createChatDto);
  }

  @Get('/getMessages/:chat_id')
  async getMessages(
    @Param('chat_id') chat_id: string,
  ): Promise<MessageFormatted[]> {
    return this.chatService.getMessages(chat_id);
  }

  @Get('/getLastMessage/:chat_id')
  async getLastMessage(
    @Param('chat_id') chat_id: string,
  ): Promise<LastMessage> {
    return this.chatService.getLastMessage(chat_id);
  }

  @Get('/getCountUnreadMessages/:chat_id')
  async getCountUnreadMessages(
    @Param('chat_id') chat_id: string,
  ): Promise<number> {
    return this.chatService.getCountUnreadMessages(chat_id);
  }
}
