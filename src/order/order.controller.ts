import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFiles,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common'
import { OrderService } from './order.service'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderDto } from './dto/update-order.dto'
import { AuthGuard } from '../auth/auth.guards'
import { FileFieldsInterceptor } from '@nestjs/platform-express'

@UseGuards(AuthGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image' }]))
  @UsePipes(new ValidationPipe())
  create(
    @Body() createOrderDto: CreateOrderDto,
    @UploadedFiles() images: Express.Multer.File[],
    @Request() req: any,
  ) {
    return this.orderService.create(createOrderDto, images, req)
  }

  @Get()
  findAll(@Request() req: any) {
    const user = req.user
    return this.orderService.findAll(user)
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    const user = req.user
    return this.orderService.findOne(+id, user)
  }

  @Patch(':id')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image' }]))
  @UsePipes(new ValidationPipe())
  update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @UploadedFiles() images: Express.Multer.File[],
    @Request() req: any,
  ) {
    return this.orderService.update(+id, updateOrderDto, images, req)
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.orderService.remove(+id, req)
  }
}
