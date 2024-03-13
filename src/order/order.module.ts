import { Module } from '@nestjs/common'
import { OrderService } from './order.service'
import { OrderController } from './order.controller'
import { CommonModule } from 'src/common/common.module'
import { MailingService } from 'src/email/mailing.service'
import { BullModule } from '@nestjs/bull'
import { UploadsService } from 'src/uploads/uploads.service'

@Module({
  imports: [
    CommonModule,
    BullModule.registerQueue({
      name: 'email',
    }),
  ],
  controllers: [OrderController],
  providers: [OrderService, MailingService, UploadsService],
})
export class OrderModule {}
