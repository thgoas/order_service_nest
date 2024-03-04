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
  Request,
  ForbiddenException,
} from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { AuthGuard } from '../auth/auth.guards'
import { RolesGuard } from '../roles.guards'
import { Roles } from '../decorators/roles.decorator'
import { Role } from '../enums/role.enum'

@UseGuards(AuthGuard, RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(Role.Master, Role.Admin)
  async create(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
    @Request() req: any,
  ) {
    const user = req.userProfile
    return await this.userService.create(createUserDto, user)
  }

  @Get()
  @Roles(Role.Master, Role.Admin)
  findAll(@Request() req: any) {
    const user = req.userProfile
    return this.userService.findAll(user)
  }

  @Get(':id')
  @Roles(Role.Master, Role.Admin)
  findOne(@Param('id') id: string, @Request() req: any) {
    const user = req.userProfile
    return this.userService.findOne(id, user)
  }

  @Patch(':id')
  @Roles(Role.Common, Role.Admin, Role.Master)
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
    @Request() req: any,
  ) {
    const user = req.userProfile
    if (
      user.profile.name !== Role.Admin &&
      user.profile.name !== Role.Master &&
      user.id !== id
    ) {
      throw new ForbiddenException(
        'You are not authorized to access this feature',
      )
    }
    return this.userService.update(id, updateUserDto, user)
  }

  @Delete(':id')
  @Roles(Role.Admin, Role.Master)
  remove(@Param('id') id: string, @Request() req: any) {
    const user = req.userProfile
    return this.userService.remove(id, user)
  }
}
