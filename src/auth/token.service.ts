import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from 'src/entities/tokens.entity';
import { Repository } from 'typeorm';
import * as dotenv from 'dotenv';
import { JwtService } from '@nestjs/jwt';
import { TokensDto } from './dto/tokens.dto';
dotenv.config();

interface Payload {
  user_id: string;
}

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    private readonly jwtService: JwtService,
  ) {}

  generate(payload: Payload): TokensDto {
    const access_token: string = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_SECRET,
    });
    const refresh_token: string = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_SECRET,
    });

    return {
      access_token,
      refresh_token,
      expires_in: 3600,
    };
  }

  async save(
    access_token: string,
    refresh_token: string,
    user_id: string,
  ): Promise<void> {
    const isExistToken: Token = await this.tokenRepository.findOne({
      where: {
        user_id,
      },
    });

    if (isExistToken) {
      isExistToken.refresh_token = refresh_token;
      await this.tokenRepository.save(isExistToken);
    }

    const tokenModel: Token = this.tokenRepository.create({
      user_id,
      access_token,
      refresh_token,
    });

    await this.tokenRepository.save(tokenModel);
  }
}
