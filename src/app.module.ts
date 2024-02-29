import { Module } from '@nestjs/common'
import { UserModule } from './user/user.module'
import { CommonModule } from './common/common.module'
import { ProfilesModule } from './profiles/profiles.module'
import { PrismaService } from './common/prisma/prisma.service'
import { MailingService } from './email/mailing.service'
import { AuthModule } from './auth/auth.module'
import { CompaniesModule } from './companies/companies.module'

@Module({
  imports: [
    UserModule,
    CommonModule,
    ProfilesModule,
    AuthModule,
    CompaniesModule,
  ],

  providers: [PrismaService, MailingService],
})
export class AppModule {}
