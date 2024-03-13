import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator'

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  description: string

  @IsNotEmpty()
  @IsString()
  status_id: string

  @IsOptional()
  @IsString()
  identification_number?: string

  @IsOptional()
  @IsString()
  serie_number?: string

  @IsNotEmpty()
  @IsDateString()
  date_entry: Date

  @IsOptional()
  @IsDateString()
  departure_date?: Date

  @IsNotEmpty()
  @IsString()
  technician_id: string

  @IsNotEmpty()
  @IsString()
  customers_id: string

  @IsNotEmpty()
  @IsString()
  company_id: string
}
