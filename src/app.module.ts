import { Module } from '@nestjs/common'
import { UserModule } from './user/user.module'
import { CommonModule } from './common/common.module'
import { ProfilesModule } from './profiles/profiles.module'
import { PrismaService } from './common/prisma/prisma.service'
import { MailingService } from './email/mailing.service'
import { AuthModule } from './auth/auth.module'
import { CompaniesModule } from './companies/companies.module'
import { BullModule } from '@nestjs/bull'
import { EmailWorker } from './email/Email-worker'

@Module({
  imports: [
    UserModule,
    CommonModule,
    ProfilesModule,
    AuthModule,
    CompaniesModule,
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    }),
  ],

  providers: [PrismaService, MailingService, EmailWorker],
})
export class AppModule {}
