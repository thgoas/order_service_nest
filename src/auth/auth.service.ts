import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '../user/user.service'
import { PasswordVerifier } from '../utils/password-verifier'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOneComplete(null, email)
    console.log(user)
    const passwordVerify = await PasswordVerifier.comparePassword(
      pass,
      user.password,
    )
    console.log(passwordVerify)
    if (!passwordVerify) {
      throw new UnauthorizedException()
    }
    const payload = { sub: user.id, userEmail: user.email }

    return {
      access_token: await this.jwtService.signAsync(payload),
    }
  }
}
