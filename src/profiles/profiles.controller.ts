import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { Prisma } from '@prisma/client';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  create(@Body() createProfileDto: Prisma.ProfileCreateInput) {
    if (createProfileDto.name === '' || createProfileDto.name === null) {
      throw new HttpException('cannot be empty!', HttpStatus.FORBIDDEN);
    }
    if (
      createProfileDto.description === '' ||
      createProfileDto.description === null
    ) {
      throw new HttpException('cannot be empty!', HttpStatus.FORBIDDEN);
    }

    return this.profilesService.create(createProfileDto);
  }

  @Get()
  findAll() {
    return this.profilesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profilesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProfileDto: Prisma.ProfileUpdateInput,
  ) {
    return this.profilesService.update(id, updateProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profilesService.remove(+id);
  }
}
