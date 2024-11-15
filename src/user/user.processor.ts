import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { UserService } from './user.service';

@Processor('user')
export class UserProcessor {
  constructor(private userService: UserService) {}

  @Process('status')
  async handleActivate(job: Job) {
    const { userId } = job.data;
    await this.userService.changeStatus(userId, true);
  }
}
