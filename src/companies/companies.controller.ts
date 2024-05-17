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
} from '@nestjs/common'
import { CompaniesService } from './companies.service'
import { CreateCompanyDto } from './dto/create-company.dto'
import { UpdateCompanyDto } from './dto/update-company.dto'
import { AuthGuard } from '../auth/auth.guards'
import { RolesGuard } from '../roles.guards'
import { Roles } from '../decorators/roles.decorator'
import { Role } from '../enums/role.enum'

@UseGuards(AuthGuard, RolesGuard)
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @Roles(Role.Master)
  create(@Body(ValidationPipe) createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto)
  }

  @Get()
  @Roles(Role.Master, Role.Admin, Role.Common)
  findAll(@Request() req: any) {
    const user = req.userProfile
    return this.companiesService.findAll(user)
  }

  @Get(':id')
  @Roles(Role.Master)
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id)
  }

  @Patch(':id')
  @Roles(Role.Master)
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.companiesService.update(id, updateCompanyDto)
  }

  @Delete(':id')
  @Roles(Role.Master)
  remove(@Param('id') id: string) {
    return this.companiesService.remove(id)
  }
}
