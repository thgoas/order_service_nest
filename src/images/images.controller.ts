import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Request,
  UseGuards,
} from '@nestjs/common'
import { ImagesService } from './images.service'
import { CreateImageDto } from './dto/create-image.dto'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { AuthGuard } from '../auth/auth.guards'

@UseGuards(AuthGuard)
@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image' }]))
  create(
    @Body() createImageDto: CreateImageDto,
    @UploadedFiles() images: Express.Multer.File[],
    @Request() req: any,
  ) {
    return this.imagesService.create(createImageDto, images, req)
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.imagesService.remove(id, req)
  }
}
