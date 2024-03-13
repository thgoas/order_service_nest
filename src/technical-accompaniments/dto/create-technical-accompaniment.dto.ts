import { IsNotEmpty, IsString } from 'class-validator'

export class CreateTechnicalAccompanimentDto {
  @IsNotEmpty()
  @IsString()
  description: string

  @IsNotEmpty()
  @IsString()
  order_service_id: string
}
