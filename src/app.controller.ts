import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerFilesConfig } from 'multer.config';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('uploadFile')
  @UseInterceptors(FileInterceptor('file', multerFilesConfig))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ url: string; type: string; name: string }> {
    const formattedFile: Express.Multer.File = {
      ...file,
      originalname: decodeURIComponent(file.originalname),
    };

    return this.appService.createFile(formattedFile);
  }
}
