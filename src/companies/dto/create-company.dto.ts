import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator'

export class CreateCompanyDto {
  @IsNotEmpty()
  @IsString()
  cin: string

  @IsNotEmpty()
  @IsString()
  @Length(5, 200)
  name: string

  @IsNotEmpty()
  @IsString()
  @Length(5, 200)
  fantasy: string

  @IsOptional()
  @IsDate()
  created_at?: Date

  @IsOptional()
  @IsDate()
  updated_at?: Date

  @IsNotEmpty()
  @IsEmail()
  email: string
}
