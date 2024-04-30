import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QAService } from './Q&A.service';
import { QAController } from './Q&A.controller';
import { Question } from 'src/entities/question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Question])],
  controllers: [QAController],
  providers: [QAService],
})
export class QAModule {}
