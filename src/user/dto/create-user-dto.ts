import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator'

export class CreateUserDto {
  @IsNotEmpty()
  @Length(5, 200)
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
  status?: boolean

  @IsNotEmpty()
  profile_id: string

  @IsNotEmpty()
  companies_ids: string[]

  @IsOptional()
  created_at?: Date

  @IsOptional()
  updated_at?: Date
}
