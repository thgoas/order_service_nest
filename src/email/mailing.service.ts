import { InjectQueue } from '@nestjs/bull'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bull'

@Injectable()
export class MailingService {
  constructor(@InjectQueue('email') private emailQueue: Queue) {}

  async sendUserWelcome(user: any, password: string) {
    await this.emailQueue.add('sendUserWelcome', { user, password })
  }

  async sendUserRecoveryPasswordLink(user: any, recoveryPasswordLink: string) {
    await this.emailQueue.add('sendUserRecoveryPasswordLink', {
      user,
      recoveryPasswordLink,
    })
  }
}
