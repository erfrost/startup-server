import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { ReadMessagesDto } from './dto/read-messages.dto';

@WebSocketGateway({ namespace: 'chat', cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer() server: Server;

  handleConnection(@ConnectedSocket() client: Socket) {
    const user_id: string = client.handshake.query.user_id as string;

    if (!this.chatService.getClient(client.id)) {
      this.chatService.addClient(client.id, user_id);
    }
  }
  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.chatService.removeClient(client.id);
    client.disconnect(true);
  }

  @SubscribeMessage('message')
  async sendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: SendMessageDto,
  ): Promise<void> {
    const message = await this.chatService.sendMessage(dto);
    const socket_id: string = this.chatService.getSocketId(
      message.recipient_id,
    );

    client.emit('message', message);

    if (!socket_id) return;
    delete message.recipient_id;
    client.to(socket_id).emit('message', message);

    client.to(socket_id).emit('countUnreadMessages', {
      content: message.content,
      time: message.time,
    });
  }

  @SubscribeMessage('read')
  async readMessages(
    @ConnectedSocket() client: Socket,
    @MessageBody() readMessagesDto: ReadMessagesDto,
  ): Promise<void> {
    const { message_ids, recipient_id } =
      await this.chatService.readMessages(readMessagesDto);
    const socket_id: string = this.chatService.getSocketId(recipient_id);

    client.emit('read', message_ids);

    if (!socket_id) return;
    client.to(socket_id).emit('read', message_ids);
  }
}
