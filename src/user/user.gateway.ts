import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserService } from './user.service';
import { Client } from 'interfaces';

@WebSocketGateway({ namespace: 'user', cors: { origin: '*' } })
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly userService: UserService) {}

  @WebSocketServer() server: Server;

  handleConnection(@ConnectedSocket() client: Socket) {
    const user_id: string = client.handshake.query.user_id as string;

    if (!this.userService.getClient(client.id)) {
      this.userService.addClient(client.id, user_id);
    }

    this.userService.updateOnline(user_id, true);
  }
  handleDisconnect(@ConnectedSocket() client: Socket) {
    const currentUser: Client = this.userService.getClient(client.id);
    if (!currentUser) return;

    this.userService.removeClient(client.id);
    this.userService.updateOnline(currentUser.user_id, false);

    client.disconnect(true);
  }
}
