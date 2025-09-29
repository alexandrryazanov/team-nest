import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoopsClient } from 'loops';
import { EMAIL_TEMPLATE } from './emails.constants';

@Injectable()
export class EmailsService {
  private loops: LoopsClient;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('LOOPS_API_KEY');
    if (!apiKey) throw new Error('LOOPS_API_KEY is not provided in .env file');

    this.loops = new LoopsClient(apiKey);
  }

  async sendEmail({
    templateId,
    email,
    variables,
  }: {
    templateId: EMAIL_TEMPLATE;
    email: string;
    variables: Record<string, string | number>;
  }) {
    try {
      await this.loops.sendTransactionalEmail({
        transactionalId: templateId,
        email,
        dataVariables: variables,
      });
      console.log('Email sent', { templateId, email });
    } catch (e) {
      throw new HttpException(
        'Something went wrong when sending email',
        500,
        e,
      );
    }

    return true;
  }
}
