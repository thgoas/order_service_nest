import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { CommonModule } from 'src/common/common.module'
import { MailingService } from 'src/email/mailing.service'
import { ProfilesService } from 'src/profiles/profiles.service'
import { BullModule } from '@nestjs/bull'
import { UploadsService } from 'src/uploads/uploads.service'

@Module({
  imports: [
    CommonModule,
    BullModule.registerQueue({
      name: 'email',
    }),
  ],
  controllers: [UserController],
  providers: [UserService, MailingService, ProfilesService, UploadsService],
  exports: [UserService, BullModule],
})
export class UserModule {}
