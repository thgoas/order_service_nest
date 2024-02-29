import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { jwtConstants } from './auth/constants'
import { Request } from 'express'
import { Reflector } from '@nestjs/core'
import { UserService } from './user/user.service'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)
    if (!token) {
      throw new UnauthorizedException()
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      })
      const user = await this.usersService.findOneComplete(payload.sub, null)
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      const roles = this.reflector.get<string[]>('roles', context.getHandler())
      const total_roles = roles.filter((role) => role === user.profile.name)
      request['userProfile'] = {
        name: user.name,
        email: user.email,
        id: user.id,
        profile: user.profile,
        company: user.company,
      }

      if (total_roles.length >= 1) {
        return true
      } else {
        return false
      }
    } catch {
      throw new UnauthorizedException()
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
