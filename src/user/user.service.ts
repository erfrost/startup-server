import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from 'interfaces';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  #clients: Client[] = [];

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

  async updateOnline(user_id: string, online_status: boolean) {
    if (!user_id) {
      throw new HttpException(
        'Неверные параметры запроса',
        HttpStatus.BAD_REQUEST,
      );
    }

    const currentUser: User = await this.userRepository.findOne({
      where: {
        user_id,
      },
    });
    if (!currentUser) {
      throw new HttpException(
        'Неверные параметры запроса',
        HttpStatus.BAD_REQUEST,
      );
    }

    currentUser.online_status = online_status;

    if (!online_status) {
      const date: Date = new Date();

      currentUser.last_online_date = date;
    }

    await this.userRepository.save(currentUser);
  }

  async getUser(user_id: string) {
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
    delete user.password;

    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.BAD_REQUEST);
    }

    return user;
  }

  async getInfo(user_id: string) {
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

    return {
      user_id: user.user_id,
      avatar_url: user.avatar_url,
      nickname: user.nickname,
      online_status: user.online_status,
      last_online_date: user.last_online_date,
    };
  }

  async updateUser(user_id: string, dto: User) {
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

    return await this.userRepository.save({
      ...user,
      ...dto,
    });
  }
}
