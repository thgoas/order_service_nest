import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { UpdateAuthDto } from './dto/update-auth.dto'
import { ReturnAuthEntity } from './entities/return-auth-entity'
import { AuthGuard } from './auth.guards'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.email, signInDto.password)
  }

  @UseGuards(AuthGuard)
  @Post('reload')
  async reload(@Request() req: any) {
    return this.authService.loader(req.user.userEmail)
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body('email') email: string,
  ): Promise<ReturnAuthEntity> {
    try {
      return await this.authService.requestPasswordReset(email)
    } catch (error) {
      console.log(error)
      if (error instanceof NotFoundException) {
        throw new NotFoundException('User not found')
      }
      throw new BadRequestException('Failed to request password reset')
    }
  }

  @Post('reset-password')
  async resetPassword(
    @Body(ValidationPipe) updateAuthDto: UpdateAuthDto,
  ): Promise<ReturnAuthEntity> {
    if (!updateAuthDto.token) {
      throw new BadRequestException('token cannot be null')
    }
    try {
      return await this.authService.resetPassword(updateAuthDto)
    } catch (error) {
      throw new BadRequestException(error.response)
    }
  }
}
