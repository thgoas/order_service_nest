import { Module } from '@nestjs/common'
import { ProfilesController } from './profiles.controller'
import { ProfilesService } from './profiles.service'
import { CommonModule } from 'src/common/common.module'
import { UserModule } from 'src/user/user.module'

@Module({
  imports: [CommonModule, UserModule],
  controllers: [ProfilesController],
  providers: [ProfilesService],
  exports: [ProfilesService],
})
export class ProfilesModule {}
