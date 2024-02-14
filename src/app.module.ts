import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './user/user.module'
import { CommonModule } from './common/common.module'
import { ProfilesModule } from './profiles/profiles.module'
import { PrismaService } from './common/prisma/prisma.service'
import { MailingService } from './email/mailing.service'
import { AuthModule } from './auth/auth.module'

@Module({
  imports: [UserModule, CommonModule, ProfilesModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, MailingService],
})
export class AppModule {}
