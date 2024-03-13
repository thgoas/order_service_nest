import { PartialType } from '@nestjs/mapped-types';
import { CreateTechnicalAccompanimentDto } from './create-technical-accompaniment.dto';

export class UpdateTechnicalAccompanimentDto extends PartialType(CreateTechnicalAccompanimentDto) {}
