import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';

@Injectable()
export class StorageService {
  private storage: Storage;
  private bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.initBucket();
  }

  private initBucket() {
    const projectId = this.configService.get<string>('GOOGLE_PROJECT_ID');
    const bucketName = this.configService.get<string>('GOOGLE_BUCKET_NAME');
    const keyFilename = './google-account-key.json';

    try {
      fs.readFileSync(keyFilename);
    } catch {
      throw new Error(
        `${keyFilename} file is not provided. Run decrypt-google-key script.`,
      );
    }

    if (!bucketName || !projectId) {
      throw new Error(
        'GOOGLE_PROJECT_ID or GOOGLE_BUCKET_NAME is not provided in .env file. Check the .env.example file.',
      );
    }

    this.bucketName = bucketName;
    this.storage = new Storage({ projectId, keyFilename });
  }

  async listFiles(): Promise<string[]> {
    const [files] = await this.storage.bucket(this.bucketName).getFiles();
    return files.map((file) => file.name);
  }

  getPublicUrl(fileName: string): string {
    return `https://storage.googleapis.com/${this.bucketName}/${fileName}`;
  }

  async uploadFile(
    file: Express.Multer.File,
    fileName?: string,
  ): Promise<string> {
    const finalFileName = fileName || file.originalname;
    const bucket = this.storage.bucket(this.bucketName);
    const blob = bucket.file(finalFileName);

    const blobStream = blob.createWriteStream({
      resumable: false,
      metadata: { contentType: file.mimetype },
    });

    return new Promise((resolve, reject) => {
      blobStream.on('error', (err) => {
        reject(err);
      });

      blobStream.on('finish', () => {
        const publicUrl = this.getPublicUrl(finalFileName);
        resolve(publicUrl);
      });

      blobStream.end(file.buffer);
    });
  }
}
