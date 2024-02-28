import {
  IsNotEmpty,
  Length,
  IsString,
  IsOptional,
  IsDate,
} from 'class-validator'

export class CreateProfileDto {
  @IsNotEmpty()
  @IsString()
  @Length(5, 30)
  name: string

  @IsNotEmpty()
  @IsString()
  @Length(5, 100)
  description: string

  @IsOptional()
  @IsDate()
  created_at?: Date

  @IsOptional()
  @IsDate()
  updated_at?: Date
}
