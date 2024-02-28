import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { CommonModule } from 'src/common/common.module'
import { MailingService } from 'src/email/mailing.service'
import { ProfilesService } from 'src/profiles/profiles.service'

@Module({
  imports: [CommonModule],
  controllers: [UserController],
  providers: [UserService, MailingService, ProfilesService],
  exports: [UserService],
})
export class UserModule {}
