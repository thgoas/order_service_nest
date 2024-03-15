import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '../user/user.service'
import { PasswordVerifier } from '../utils/password-verifier'
import { MailingService } from '../email/mailing.service'
import { jwtConstants } from './constants'
import { UpdateAuthDto } from './dto/update-auth.dto'
import { ReturnAuthEntity } from './entities/return-auth-entity'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private readonly mailingService: MailingService,
  ) {}

  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOneComplete(null, email)

    if (!user) {
      throw new BadRequestException('invalid email or password')
    }
    const passwordVerify = await PasswordVerifier.comparePassword(
      pass,
      user.password,
    )
    if (!passwordVerify) {
      throw new BadRequestException('invalid email or password')
    }
    const payload = { sub: user.id, userEmail: user.email }

    return {
      name: user.name,
      email: user.email,
      access_token: await this.jwtService.signAsync(payload),
    }
  }

  async requestPasswordReset(email: string): Promise<ReturnAuthEntity> {
    const user = await this.userService.findOneComplete(null, email)
    delete user.password
    if (!user) {
      throw new NotFoundException('User not found')
    }

    if (user.token) {
      try {
        await this.jwtService.verifyAsync(user.token, {
          secret: jwtConstants.secret,
        })
        return {
          message:
            'you have already made a request to recover your password, check your email',
        }
      } catch (error) {}
    }

    const token = await this.jwtService.signAsync(
      { userId: user.id },
      { expiresIn: '1h' },
    )

    await this.userService.update(user.id, { token }, user, null)

    await this.mailingService.sendUserRecoveryPasswordLink(
      user,
      process.env.RECOVERY_PASSWORD_LINK + token,
    )

    return {
      message: 'Email recovery password successfully!',
    }
  }

  async resetPassword(updateAuthDto: UpdateAuthDto): Promise<ReturnAuthEntity> {
    try {
      const decoded = await this.jwtService.verifyAsync(updateAuthDto.token, {
        secret: jwtConstants.secret,
      })
      const userId = decoded.userId

      const user = await this.userService.findOneComplete(userId, null)
      if (user) {
        if (user.token !== updateAuthDto.token) {
          throw new BadRequestException('Invalid or expired token!')
        }
        updateAuthDto.token = null
        await this.userService.update(user.id, updateAuthDto, user, null)
        return {
          message: 'password changed successfully',
        }
      }
    } catch (error) {
      throw new BadRequestException('Invalid or expired token')
    }
  }
}
