import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthReturn } from 'interfaces';
import { SignInDto } from './dto/signIn.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('createUser')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<AuthReturn> {
    return this.authService.createUser(createUserDto);
  }

  @Post('signIn')
  async signIn(@Body() signInDto: SignInDto): Promise<AuthReturn> {
    return this.authService.signIn(signInDto);
  }
}
