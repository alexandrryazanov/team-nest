import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from './storage.service';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get('/')
  async getAllFiles() {
    return this.storageService.listFiles();
  }

  @Post('/')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Please specify file');

    try {
      const publicUrl = await this.storageService.uploadFile(file);
      return { url: publicUrl, fileName: file.originalname, size: file.size };
    } catch (error) {
      throw new BadRequestException(`Something went wrong: ${error.message}`);
    }
  }
}
