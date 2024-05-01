import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { MAIL_JOB, MAIL_QUEUE } from '@app/shared';

@Processor(MAIL_QUEUE)
export class MailerService {
  @Process(MAIL_JOB)
  async handleDataJob(job: Job) {
    console.log('Send email to the author with Id :', job.data.authorId);
    job.moveToCompleted();
  }
}
