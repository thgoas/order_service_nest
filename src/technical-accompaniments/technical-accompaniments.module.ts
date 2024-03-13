import { Module } from '@nestjs/common'
import { TechnicalAccompanimentsService } from './technical-accompaniments.service'
import { TechnicalAccompanimentsController } from './technical-accompaniments.controller'
import { PrismaService } from '../common/prisma/prisma.service'
import { MailingService } from '../email/mailing.service'
import { OrderService } from '../order/order.service'
import { CommonModule } from '../common/common.module'
import { BullModule } from '@nestjs/bull'
import { UploadsService } from 'src/uploads/uploads.service'

@Module({
  imports: [
    CommonModule,
    BullModule.registerQueue({
      name: 'email',
    }),
  ],
  controllers: [TechnicalAccompanimentsController],
  providers: [
    TechnicalAccompanimentsService,
    PrismaService,
    MailingService,
    OrderService,
    UploadsService,
  ],
})
export class TechnicalAccompanimentsModule {}
