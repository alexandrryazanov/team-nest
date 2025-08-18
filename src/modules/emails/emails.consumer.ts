import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { EmailsType } from './emails.constants';

@Processor('emails', {
  concurrency: 1,
  limiter: { max: 1, duration: 3000 },
})
export class EmailsConsumer extends WorkerHost {
  async process(job: Job<{ email: string }, any, EmailsType>) {
    switch (job.name) {
      case EmailsType.SEND_WELCOME_EMAIL:
        console.log('Send welcome email to ' + job.data.email);
        break;
      case EmailsType.SEND_LOGIN_EMAIL:
        console.log('Send login email to ' + job.data.email);
        break;
    }

    console.log('EMAIL TIME:', new Date().toISOString());

    return Promise.resolve();
  }
}
