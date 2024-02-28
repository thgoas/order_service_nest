import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator'

export class CreateUserDto {
  @IsNotEmpty()
  @Length(5, 200)
  @IsString()
  name: string

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(200)
  email: string

  @IsNotEmpty()
  @MinLength(6)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must contain at least one uppercase letter, one lowercase letter, one number or one symbol',
  })
  password: string

  @IsNotEmpty()
  @MinLength(6)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must contain at least one uppercase letter, one lowercase letter, one number or one symbol',
  })
  passwordConfirmation: string

  @IsOptional()
  @IsBoolean()
  status?: boolean

  @IsNotEmpty()
  @IsString()
  profile_id: string

  @IsArray()
  @IsString({ each: true })
  companies_ids: string[]

  @IsOptional()
  @IsDate()
  created_at?: Date

  @IsOptional()
  @IsDate()
  updated_at?: Date
}
