import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CryptService {
  async generateSalt() {
    return await bcrypt.genSalt(10);
  }

  async hash(password: string) {
    const salt = await this.generateSalt();
    return await bcrypt.hash(password, salt);
  }

  async compare(str: string, hash: string) {
    return await bcrypt.compare(str, hash);
  }
}
