import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { StatusService } from './status.service'
import { AuthGuard } from '../auth/auth.guards'

@UseGuards(AuthGuard)
@Controller('status')
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Get()
  findAll() {
    return this.statusService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.statusService.findOne(id)
  }
}
