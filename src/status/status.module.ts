import { Module } from '@nestjs/common'
import { StatusService } from './status.service'
import { StatusController } from './status.controller'
import { PrismaService } from 'src/common/prisma/prisma.service'

@Module({
  controllers: [StatusController],
  providers: [StatusService, PrismaService],
})
export class StatusModule {}
