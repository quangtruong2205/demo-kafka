import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  chunkFile(file: Express.Multer.File): Buffer[] {
    // Logic to chunk the file into smaller pieces
    // For simplicity, let's just split the file into chunks of 1KB each
    const chunkSize = 1024; // 1KB
    const fileSize = file.size;
    const chunks: Buffer[] = [];
    let offset = 0;

    while (offset < fileSize) {
      const chunk = Buffer.from(file.buffer.slice(offset, offset + chunkSize));
      chunks.push(chunk);
      offset += chunkSize;
    }

    return chunks;
  }
}
