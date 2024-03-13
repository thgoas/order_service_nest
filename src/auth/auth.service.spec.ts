import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { UserService } from '../user/user.service'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '../common/prisma/prisma.service'
import { MailingService } from '../email/mailing.service'
import { BullModule, getQueueToken } from '@nestjs/bull'
import { UploadsService } from '../uploads/uploads.service'

describe('AuthService', () => {
  let service: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [BullModule.registerQueue({ name: 'email' })],
      providers: [
        AuthService,
        UserService,
        JwtService,
        PrismaService,
        MailingService,
        UploadsService,
      ],
    })
      .overrideProvider(getQueueToken('email'))
      .useValue({})
      .compile()

    service = module.get<AuthService>(AuthService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
