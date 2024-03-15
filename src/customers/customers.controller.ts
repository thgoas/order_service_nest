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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common'
import { CustomersService } from './customers.service'
import { CreateCustomerDto } from './dto/create-customer.dto'
import { UpdateCustomerDto } from './dto/update-customer.dto'
import { AuthGuard } from '../auth/auth.guards'
import { RolesGuard } from '../roles.guards'
import { Roles } from '../decorators/roles.decorator'
import { Role } from '../enums/role.enum'
import { FileInterceptor } from '@nestjs/platform-express'

@UseGuards(AuthGuard, RolesGuard)
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @Roles(Role.Admin, Role.Master)
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body(ValidationPipe) createCustomerDto: CreateCustomerDto,
    @UploadedFile() image: Express.Multer.File,
    @Request()
    req: any,
  ) {
    return this.customersService.create(createCustomerDto, image, req)
  }

  @Get()
  @Roles(Role.Admin, Role.Master, Role.Common)
  findAll(
    @Request()
    req: any,
  ) {
    return this.customersService.findAll(req)
  }

  @Get(':id')
  @Roles(Role.Admin, Role.Master, Role.Common)
  findOne(
    @Param('id') id: string,
    @Request()
    req: any,
  ) {
    return this.customersService.findOne(id, req)
  }

  @Patch(':id')
  @Roles(Role.Admin, Role.Master)
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
    @UploadedFile() image: Express.Multer.File,
    @Request()
    req: any,
  ) {
    return this.customersService.update(id, updateCustomerDto, image, req)
  }

  @Delete(':id')
  @Roles(Role.Admin, Role.Master)
  remove(
    @Param('id') id: string,
    @Request()
    req: any,
  ) {
    return this.customersService.remove(id, req)
  }
}
