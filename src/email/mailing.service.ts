import { InjectQueue } from '@nestjs/bull'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bull'
import { EmailOrderService } from './model/email-order-service'

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
  async sendNewCreateOrderService(createOrderService: EmailOrderService) {
    await this.emailQueue.add('sendNewCreateOrderService', createOrderService)
  }

  async sendUpdateOrderService(updateOrderService: EmailOrderService) {
    await this.emailQueue.add('sendUpdateOrderService', updateOrderService)
  }

  async sendDeleteOrderService(deleteOrderService: EmailOrderService) {
    await this.emailQueue.add('sendDeleteOrderService', deleteOrderService)
  }
}
