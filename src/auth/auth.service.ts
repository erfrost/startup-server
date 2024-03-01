import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { authValidate } from 'src/utils/authValidate';
import { Token } from 'src/entities/tokens.entity';
import { hashingPassword } from 'src/utils/hashingPassword';
import { TokenService } from './token.service';
import { TokensDto } from './dto/tokens.dto';
import { CreateUser } from 'interfaces';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    private readonly tokenService: TokenService,
  ) {}

  async createUser(dto: CreateUserDto): Promise<CreateUser> {
    const { nickname, email, password, role } = dto;

    if (!authValidate(nickname, email, password, role)) return;

    const isExistUser: User = await this.userRepository.findOne({
      where: {
        email,
      },
    });
    console.log(isExistUser);
    if (isExistUser) {
      throw new HttpException(
        'Пользователь с таким email уже зарегистрирован',
        HttpStatus.CONFLICT,
      );
    }

    const hashedPassword: string = await hashingPassword(password);

    const userModel = this.userRepository.create({
      nickname,
      email,
      password: hashedPassword,
      role,
    });
    const newUser = await this.userRepository.save(userModel);

    const tokens: TokensDto = this.tokenService.generate({
      user_id: newUser.user_id,
    });

    await this.tokenService.save(
      tokens.access_token,
      tokens.refresh_token,
      newUser.user_id,
    );

    return {
      ...tokens,
      user_id: newUser.user_id,
    };
  }
}
