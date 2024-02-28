import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common'
import { ProfilesService } from './profiles.service'
import { Prisma } from '@prisma/client'
import { AuthGuard } from '../auth/auth.guards'
import { RolesGuard } from 'src/roles.guards'
import { Roles } from 'src/decorators/roles.decorator'
import { Role } from 'src/enums/role.enum'

@UseGuards(AuthGuard, RolesGuard)
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}
  @Roles(Role.Master)
  @Post()
  create(@Body() createProfileDto: Prisma.ProfileCreateInput) {
    return this.profilesService.create(createProfileDto)
  }
  @Roles(Role.Master, Role.Admin, Role.Common)
  @Get()
  findAll() {
    return this.profilesService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profilesService.findOne(id)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProfileDto: Prisma.ProfileUpdateInput,
  ) {
    return this.profilesService.update(id, updateProfileDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profilesService.remove(id)
  }
}
