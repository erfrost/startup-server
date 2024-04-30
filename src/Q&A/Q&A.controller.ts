import { Body, Controller, Param, Post } from '@nestjs/common';
import { QAService } from './Q&A.service';
import { CreateQuestionDto } from './dto/create_question.dto';

@Controller('QA')
export class QAController {
  constructor(private readonly qaService: QAService) {}

  @Post('/createQuestion/:user_id')
  async createQuestion(
    @Body() createQuestionDto: CreateQuestionDto,
    @Param('user_id') user_id: string,
  ): Promise<void> {
    console.log(createQuestionDto, user_id);
    await this.qaService.createQuestion(createQuestionDto, user_id);
  }
}
