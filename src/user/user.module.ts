import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CommonModule } from 'src/common/common.module';
import { MailingService } from 'src/email/mailing.service';

@Module({
  imports: [CommonModule],
  controllers: [UserController],
  providers: [UserService, MailingService],
})
export class UserModule {}
