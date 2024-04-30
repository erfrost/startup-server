import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from 'src/entities/question.entity';
import { CreateQuestionDto } from './dto/create_question.dto';

@Injectable()
export class QAService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  async createQuestion(dto: CreateQuestionDto, user_id: string) {
    const { title, description, secondDescription, tags } = dto;
    if (!title || !description || !secondDescription || !tags || !user_id) {
      throw new HttpException(
        'Неверные параметры запроса',
        HttpStatus.BAD_REQUEST,
      );
    }

    const questionModel: Question = this.questionRepository.create({
      user_id,
      title,
      description,
      secondDescription,
      tags,
    });

    await this.questionRepository.save(questionModel);
  }
}
