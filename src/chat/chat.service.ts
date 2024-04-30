import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { In, Repository } from 'typeorm';
import * as dotenv from 'dotenv';
import { Chat } from 'src/entities/chat.entity';
import { CreateChatDto } from './dto/create-chat.dto';
import { Message } from 'src/entities/message.entity';
import { SendMessageDto } from './dto/send-message.dto';
import { Client, MessageFormatted } from 'interfaces';
import { ReadMessagesDto } from './dto/read-messages.dto';
import { MessageFiles } from 'src/entities/message_files.entity';
dotenv.config();

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Chat) private readonly chatRepository: Repository<Chat>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(MessageFiles)
    private readonly messageFilesRepository: Repository<MessageFiles>,
  ) {}

  #clients: Client[] = [];
  //
  getClient(socket_id: string) {
    return this.#clients.find(
      (client: Client) => client.socket_id === socket_id,
    );
  }
  getSocketId(user_id: string) {
    const client: Client | undefined = this.#clients.find(
      (client: Client) => client.user_id === user_id,
    );

    return client?.socket_id;
  }
  addClient(socket_id: string, user_id: string) {
    this.#clients.push({ socket_id, user_id });
  }
  removeClient(socket_id: string) {
    this.#clients = this.#clients.filter(
      (client: Client) => client.socket_id !== socket_id,
    );
  }
  getTime(date: Date) {
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  async sendMessage(dto: SendMessageDto) {
    const {
      chat_id,
      user_id,
      content: { text, files, audio },
    } = dto;

    if (
      !chat_id ||
      !user_id ||
      (!text && !files) ||
      (audio && text) ||
      (audio && files.length)
    ) {
      throw new HttpException(
        'Неверные параметры запроса',
        HttpStatus.BAD_REQUEST,
      );
    }

    const chat: Chat = await this.chatRepository.findOne({
      where: {
        chat_id,
      },
    });
    if (!chat) {
      throw new HttpException('Чат не найден', HttpStatus.BAD_REQUEST);
    }

    const messageModel: Message = this.messageRepository.create({
      chat_id,
      user_id,
      date: new Date(),
      text,
      isRead: false,
    });

    const newMessage: Message = await this.messageRepository.save(messageModel);

    const newFiles: MessageFiles[] = await Promise.all(
      files.map(async (file) => {
        const fileModel: MessageFiles = this.messageFilesRepository.create({
          message_id: newMessage.message_id,
          url: file.url,
          type: file.type,
          name: file.name,
        });

        return await this.messageFilesRepository.save(fileModel);
      }),
    );

    let newAudio: MessageFiles | null = null;
    if (audio) {
      const audioModel: MessageFiles = this.messageFilesRepository.create({
        message_id: newMessage.message_id,
        url: audio.url,
        type: audio.type,
        name: audio.name,
      });

      newAudio = await this.messageFilesRepository.save(audioModel);
      delete newAudio.message_files_id;
      delete newAudio.message_id;
    }

    const formattedMessage: MessageFormatted = {
      ...newMessage,
      time: this.getTime(newMessage.date),
      content: {
        text: newMessage.text,
        files: newFiles,
        audio: newAudio,
      },
    };
    delete formattedMessage.text;

    let recipientChat: Chat | null = await this.chatRepository.findOne({
      where: {
        user_id: chat.recipient_id,
        recipient_id: chat.user_id,
      },
    });

    if (!recipientChat) {
      const recipientChatModel: Chat = this.chatRepository.create({
        user_id: chat.recipient_id,
        recipient_id: chat.user_id,
      });

      recipientChat = await this.chatRepository.save(recipientChatModel);
    }

    const recipientMessageModel: Message = this.messageRepository.create({
      chat_id: recipientChat.chat_id,
      user_id,
      date: new Date(),
      text: text,
      isRead: false,
    });

    const newRecipientMessage: Message = await this.messageRepository.save(
      recipientMessageModel,
    );

    await Promise.all(
      files.map(async (file) => {
        const fileModel: MessageFiles = this.messageFilesRepository.create({
          message_id: newRecipientMessage.message_id,
          url: file.url,
          type: file.type,
          name: file.name,
        });

        return await this.messageFilesRepository.save(fileModel);
      }),
    );

    if (audio) {
      const audioModel: MessageFiles = this.messageFilesRepository.create({
        message_id: newRecipientMessage.message_id,
        url: audio.url,
        type: audio.type,
        name: audio.name,
      });

      await this.messageFilesRepository.save(audioModel);
    }

    return { ...formattedMessage, recipient_id: chat.recipient_id };
  }

  async getChatInfo(chat_id: string) {
    if (!chat_id) {
      throw new HttpException(
        'Неверные параметры запроса',
        HttpStatus.BAD_REQUEST,
      );
    }

    const chat: Chat = await this.chatRepository.findOne({
      where: {
        chat_id,
      },
    });
    if (!chat_id) {
      throw new HttpException('Чат не найден', HttpStatus.BAD_REQUEST);
    }

    return chat;
  }

  async getChats(user_id: string) {
    if (!user_id) {
      throw new HttpException(
        'Неверные параметры запроса',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user: User = await this.userRepository.findOne({
      where: {
        user_id,
      },
    });
    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.BAD_REQUEST);
    }

    const chats: Chat[] = await this.chatRepository.find({
      where: {
        user_id,
      },
    });

    return chats;
  }

  async createChat(dto: CreateChatDto) {
    const { user_id, recipient_id } = dto;
    if (!user_id || !recipient_id) {
      throw new HttpException(
        'Неверные параметры запроса',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user: User = await this.userRepository.findOne({
      where: {
        user_id,
      },
    });
    const recipient: User = await this.userRepository.findOne({
      where: {
        user_id: recipient_id,
      },
    });
    if (!user || !recipient) {
      throw new HttpException('Пользователь не найден', HttpStatus.BAD_REQUEST);
    }

    const isExistChat: Chat = await this.chatRepository.findOne({
      where: {
        user_id,
        recipient_id,
      },
    });
    if (isExistChat) return;

    const chatModel: Chat = this.chatRepository.create({
      user_id: user.user_id,
      recipient_id: recipient.user_id,
    });
    const newChat: Chat = await this.chatRepository.save(chatModel);

    return newChat;
  }

  async getMessages(chat_id: string) {
    if (!chat_id) {
      throw new HttpException(
        'Неверные параметры запроса',
        HttpStatus.BAD_REQUEST,
      );
    }

    const chat: Chat = await this.chatRepository.findOne({
      where: {
        chat_id,
      },
    });
    if (!chat) {
      throw new HttpException('Чат не найден', HttpStatus.BAD_REQUEST);
    }

    const messages: Message[] = await this.messageRepository.find({
      where: {
        chat_id: chat.chat_id,
      },
    });

    const messagesFormatted: MessageFormatted[] = await Promise.all(
      messages.map(async (message: Message) => {
        const files: Partial<MessageFiles>[] =
          await this.messageFilesRepository.find({
            where: {
              message_id: message.message_id,
            },
            select: ['url', 'type', 'name'],
          });

        const audio: Partial<MessageFiles> | null = files.find(
          (file: Partial<MessageFiles>) => file.type.split('/')[0] === 'audio',
        );
        const filteredFiles: Partial<MessageFiles>[] = files.filter(
          (file: Partial<MessageFiles>) => file.type.split('/')[0] !== 'audio',
        );

        const result = {
          ...message,
          time: this.getTime(message.date),
          content: {
            text: message.text,
            files: filteredFiles,
            audio,
          },
        };
        delete result.text;
        return result;
      }),
    );

    return messagesFormatted;
  }

  async getLastMessage(chat_id: string) {
    if (!chat_id) {
      throw new HttpException(
        'Неверные параметры запроса',
        HttpStatus.BAD_REQUEST,
      );
    }

    const chat: Chat = await this.chatRepository.findOne({
      where: {
        chat_id,
      },
    });
    if (!chat) {
      throw new HttpException('Чат не найден', HttpStatus.BAD_REQUEST);
    }

    const messages: Message[] = await this.messageRepository.find({
      where: {
        chat_id,
      },
    });

    const lastMessage: Message = messages[messages.length - 1];
    if (!lastMessage) return;

    const files: Partial<MessageFiles>[] =
      await this.messageFilesRepository.find({
        where: {
          message_id: lastMessage.message_id,
        },
        select: ['url', 'name', 'type'],
      });

    const audio: Partial<MessageFiles> | null = files.find(
      (file: Partial<MessageFiles>) => file.type.split('/')[0] === 'audio',
    );
    const filteredFiles: Partial<MessageFiles>[] = files.filter(
      (file: Partial<MessageFiles>) => file.type.split('/')[0] !== 'audio',
    );

    const user: User = await this.userRepository.findOne({
      where: {
        user_id: lastMessage.user_id,
      },
    });
    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.BAD_REQUEST);
    }

    const time: string = this.getTime(lastMessage.date);

    const result = {
      avatar_url: user.avatar_url,
      time,
      content: {
        text: lastMessage.text,
        files: filteredFiles,
        audio,
      },
    };

    return result;
  }

  async readMessages(dto: ReadMessagesDto) {
    const { chat_id, user_id } = dto;
    if (!chat_id || !user_id) {
      throw new HttpException(
        'Неверные параметры запроса',
        HttpStatus.BAD_REQUEST,
      );
    }

    const chat: Chat = await this.chatRepository.findOne({
      where: {
        chat_id,
      },
    });
    const recipientChat: Chat = await this.chatRepository.findOne({
      where: {
        user_id: chat.recipient_id,
        recipient_id: user_id,
      },
    });
    if (!chat || !recipientChat) {
      throw new HttpException('Чат не найден', HttpStatus.BAD_REQUEST);
    }

    const messages: Message[] = await this.messageRepository.find({
      where: {
        chat_id: chat.chat_id,
        user_id: recipientChat.user_id,
        isRead: false,
      },
    });
    const recipientMessages: Message[] = await this.messageRepository.find({
      where: {
        chat_id: recipientChat.chat_id,
        user_id: recipientChat.user_id,
        isRead: false,
      },
    });

    const allMessages: Message[] = [...messages, ...recipientMessages];

    allMessages.map(async (message: Message) => {
      message.isRead = true;
      await this.messageRepository.save(message);
    });

    return {
      message_ids: allMessages.map((message: Message) => message.message_id),
      recipient_id: recipientChat.user_id,
    };
  }

  async getCountUnreadMessages(chat_id: string) {
    if (!chat_id) {
      throw new HttpException(
        'Неверные параметры запроса',
        HttpStatus.BAD_REQUEST,
      );
    }

    const chat: Chat = await this.chatRepository.findOne({
      where: {
        chat_id,
      },
    });
    if (!chat) {
      throw new HttpException('Чат не найден', HttpStatus.BAD_REQUEST);
    }

    return await this.messageRepository.count({
      where: {
        chat_id: chat.chat_id,
        isRead: false,
      },
    });
  }
}
