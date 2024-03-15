import { Module } from '@nestjs/common'
import { CustomersService } from './customers.service'
import { CustomersController } from './customers.controller'
import { PrismaService } from '../common/prisma/prisma.service'
import { UploadsService } from '../uploads/uploads.service'
import { CommonModule } from 'src/common/common.module'
import { UserService } from 'src/user/user.service'
import { MailingService } from 'src/email/mailing.service'
import { BullModule } from '@nestjs/bull'

@Module({
  imports: [
    CommonModule,
    BullModule.registerQueue({
      name: 'email',
    }),
  ],
  controllers: [CustomersController],
  providers: [
    CustomersService,
    PrismaService,
    UploadsService,
    UserService,
    MailingService,
  ],
})
export class CustomersModule {}
