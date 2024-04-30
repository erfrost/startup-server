import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as dotenv from 'dotenv';
import { Files } from './entities/files.entity';

dotenv.config();

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Files)
    private readonly fileRepository: Repository<Files>,
  ) {}

  async createFile(file: Express.Multer.File) {
    const model: Files = this.fileRepository.create({
      url: process.env.FILES_URL + file.filename,
      type: file.mimetype,
      name: file.filename,
    });

    const newFile: Files = await this.fileRepository.save(model);

    return { url: newFile.url, type: newFile.type, name: newFile.name };
  }
}
