import { Module } from '@nestjs/common'
import { CompaniesService } from './companies.service'
import { CompaniesController } from './companies.controller'
import { CommonModule } from 'src/common/common.module'
import { UserModule } from 'src/user/user.module'

@Module({
  imports: [CommonModule, UserModule],
  controllers: [CompaniesController],
  providers: [CompaniesService],
})
export class CompaniesModule {}
