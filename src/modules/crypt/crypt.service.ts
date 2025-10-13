import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomInt } from 'node:crypto';

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

  generateNumCode(len = 6): string {
    let code = '';

    for (let i = 0; i < len; i++) {
      code += randomInt(9).toString();
    }

    return code;
  }

  generateHashedNumCode(len = 6) {
    return this.hash(this.generateNumCode(len));
  }
}
