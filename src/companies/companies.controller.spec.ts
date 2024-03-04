import { Test, TestingModule } from '@nestjs/testing'
import { CompaniesController } from './companies.controller'
import { CompaniesService } from './companies.service'
import { PrismaService } from '../common/prisma/prisma.service'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '../user/user.service'
import { MailingService } from '../email/mailing.service'
import { BullModule, getQueueToken } from '@nestjs/bull'

describe('CompaniesController', () => {
  let controller: CompaniesController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [BullModule.registerQueue({ name: 'email' })],
      controllers: [CompaniesController],
      providers: [
        CompaniesService,
        PrismaService,
        JwtService,
        UserService,
        MailingService,
      ],
    })
      .overrideProvider(getQueueToken('email'))
      .useValue({})
      .compile()

    controller = module.get<CompaniesController>(CompaniesController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
