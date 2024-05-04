import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { KafkaService } from './kafka.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly kafkaService: KafkaService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const chunks = this.appService.chunkFile(file);
    for (const chunk of chunks) {
      await this.kafkaService.publishChunk(chunk);
    }
    return { message: 'File uploaded successfully' };
  }

  @Post('kafkaConsumer')
  async kafkaConsumer() {
    return this.kafkaService.consumerHandler();
  }
}
