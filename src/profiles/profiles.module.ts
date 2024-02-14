import { Module } from '@nestjs/common'
import { ProfilesController } from './profiles.controller'
import { ProfilesService } from './profiles.service'
import { CommonModule } from 'src/common/common.module'

@Module({
  imports: [CommonModule],
  controllers: [ProfilesController],
  providers: [ProfilesService],
})
export class ProfilesModule {}
