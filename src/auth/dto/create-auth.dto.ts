import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator'

export class CreateAuthDto {
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
      'The password confirmation must contain at least one uppercase letter, one lowercase letter, one number or one symbol',
  })
  passwordConfirmation: string

  @IsNotEmpty()
  @IsString()
  token: string
}
