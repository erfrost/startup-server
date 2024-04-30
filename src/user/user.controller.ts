import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';

interface GetInfo {
  user_id: string;
  avatar_url: string;
  nickname: string;
  online_status: boolean;
  last_online_date: Date;
}

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/:user_id')
  async getUser(@Param('user_id') user_id: string): Promise<User> {
    return this.userService.getUser(user_id);
  }

  @Get('/getInfo/:user_id')
  async getInfo(@Param('user_id') user_id: string): Promise<GetInfo> {
    return this.userService.getInfo(user_id);
  }

  @Post('/:user_id')
  async updateUser(
    @Param('user_id') user_id: string,
    @Body() updateUserDto: User,
  ): Promise<User> {
    return this.userService.updateUser(user_id, updateUserDto);
  }
}
