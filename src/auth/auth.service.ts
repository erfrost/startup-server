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
import { AuthReturn } from 'interfaces';
import { SignInDto } from './dto/signIn.dto';
import comparePassword from './../utils/comparePassword';
import nodemailerInstance from 'nodemailer.config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    private readonly tokenService: TokenService,
  ) {}

  async createUser(dto: CreateUserDto): Promise<AuthReturn> {
    const { nickname, email, password, role } = dto;

    if (!authValidate(nickname, email, password, role)) return;

    const isExistUser: User = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (isExistUser) {
      throw new HttpException(
        'Пользователь с таким email уже зарегистрирован',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword: string = await hashingPassword(password);

    const mailCode: string = Math.floor(
      10000 + Math.random() * 90000,
    ).toString();

    const userModel = this.userRepository.create({
      nickname,
      email,
      password: hashedPassword,
      role,
      confirmed: false,
      confirmationCode: mailCode,
    });
    const newUser = await this.userRepository.save(userModel);

    const message = await nodemailerInstance.sendMail({
      from: '"SkillGrove. 👻" <dlaskinow@gmail.com>',
      to: newUser.email,
      subject: 'SkillGrove. Код подтверждения',
      text: ``,
      html: `<span>Код подтверждения: <b>${newUser.confirmationCode}</b></span>`,
    });

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

  async confirmCode(user_id: string, code: string) {
    if (!user_id || !code) {
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
    if (code !== user.confirmationCode) {
      return false;
    }

    user.confirmed = true;

    await this.userRepository.save(user);

    return true;
  }

  async signIn(dto: SignInDto): Promise<any> {
    const { email, password } = dto;
    if (!email || !password) {
      throw new HttpException(
        'Неверные параметры запроса',
        HttpStatus.BAD_REQUEST,
      );
    }

    const currentUser: User = await this.userRepository.findOne({
      where: {
        email,
      },
    });
    if (!currentUser) {
      throw new HttpException(
        'Пользователь с этим email не найден',
        HttpStatus.BAD_REQUEST,
      );
    }

    const isValidPassword: boolean = await comparePassword(
      password,
      currentUser.password,
    );
    if (!isValidPassword) {
      throw new HttpException('Пароль не верный', HttpStatus.BAD_REQUEST);
    }

    const tokens: TokensDto = this.tokenService.generate({
      user_id: currentUser.user_id,
    });

    await this.tokenService.save(
      tokens.access_token,
      tokens.refresh_token,
      currentUser.user_id,
    );

    return {
      ...tokens,
      user_id: currentUser.user_id,
    };
  }
}
