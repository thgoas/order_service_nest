import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
  Request,
} from '@nestjs/common'
import { TechnicalAccompanimentsService } from './technical-accompaniments.service'
import { CreateTechnicalAccompanimentDto } from './dto/create-technical-accompaniment.dto'
import { UpdateTechnicalAccompanimentDto } from './dto/update-technical-accompaniment.dto'
import { AuthGuard } from '../auth/auth.guards'

@UseGuards(AuthGuard)
@Controller('technical-accompaniments')
export class TechnicalAccompanimentsController {
  constructor(
    private readonly technicalAccompanimentsService: TechnicalAccompanimentsService,
  ) {}

  @Post()
  create(
    @Body(ValidationPipe)
    createTechnicalAccompanimentDto: CreateTechnicalAccompanimentDto,
    @Request() req: any,
  ) {
    return this.technicalAccompanimentsService.create(
      createTechnicalAccompanimentDto,
      req,
    )
  }

  // @Get()
  // findAll() {
  //   return this.technicalAccompanimentsService.findAll()
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.technicalAccompanimentsService.findOne(+id)
  // }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(ValidationPipe)
    updateTechnicalAccompanimentDto: UpdateTechnicalAccompanimentDto,
    @Request() req: any,
  ) {
    return this.technicalAccompanimentsService.update(
      id,
      updateTechnicalAccompanimentDto,
      req,
    )
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.technicalAccompanimentsService.remove(id, req)
  }
}
