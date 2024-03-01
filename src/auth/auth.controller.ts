import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUser } from 'interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('createUser')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<CreateUser> {
    return this.authService.createUser(createUserDto);
  }
}
