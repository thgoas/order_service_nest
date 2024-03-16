import { Module } from '@nestjs/common'
import { ImagesService } from './images.service'
import { ImagesController } from './images.controller'
import { UploadsService } from '../uploads/uploads.service'
import { OrderService } from '../order/order.service'
import { MailingService } from '../email/mailing.service'
import { PrismaService } from '../common/prisma/prisma.service'
import { BullModule } from '@nestjs/bull'

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'email',
    }),
  ],
  controllers: [ImagesController],
  providers: [
    ImagesService,
    PrismaService,
    MailingService,
    OrderService,
    UploadsService,
  ],
})
export class ImagesModule {}
