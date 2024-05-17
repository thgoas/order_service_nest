import {
  IsBooleanString,
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator'

export class CreateCustomerDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  fantasy_name: string

  @IsNotEmpty()
  @IsString()
  @Length(11, 14)
  identification_number: string

  @IsNotEmpty()
  @IsBooleanString()
  legal_person: string

  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsString()
  company_id: string
}
