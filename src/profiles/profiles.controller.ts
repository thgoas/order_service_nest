import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common'
import { ProfilesService } from './profiles.service'
import { AuthGuard } from '../auth/auth.guards'
import { RolesGuard } from '../roles.guards'
import { Roles } from '../decorators/roles.decorator'
import { Role } from '../enums/role.enum'
import { CreateProfileDto } from './dto/create-profile.dto'
import { UpdateProfileDto } from './dto/update-profile.dto'

@UseGuards(AuthGuard, RolesGuard)
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  @Roles(Role.Master)
  create(@Body(ValidationPipe) createProfileDto: CreateProfileDto) {
    return this.profilesService.create(createProfileDto)
  }

  @Get()
  @Roles(Role.Master)
  findAll() {
    return this.profilesService.findAll()
  }

  @Get(':id')
  @Roles(Role.Master)
  findOne(@Param('id') id: string) {
    return this.profilesService.findOne(id)
  }

  @Patch(':id')
  @Roles(Role.Master)
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateProfileDto: UpdateProfileDto,
  ) {
    return this.profilesService.update(id, updateProfileDto)
  }

  @Delete(':id')
  @Roles(Role.Master)
  remove(@Param('id') id: string) {
    return this.profilesService.remove(id)
  }
}
