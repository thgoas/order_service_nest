import { Test, TestingModule } from '@nestjs/testing'
import { CustomersController } from './customers.controller'
import { CustomersService } from './customers.service'
import { PrismaService } from '../common/prisma/prisma.service'
import { UploadsService } from '../uploads/uploads.service'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '../user/user.service'
import { MailingService } from '../email/mailing.service'
import { CommonModule } from '../common/common.module'
import { BullModule } from '@nestjs/bull'

describe('CustomersController', () => {
  let controller: CustomersController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CommonModule, BullModule.registerQueue({ name: 'email' })],
      controllers: [CustomersController],
      providers: [
        CustomersService,
        PrismaService,
        UploadsService,
        JwtService,
        UserService,
        MailingService,
      ],
    }).compile()

    controller = module.get<CustomersController>(CustomersController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
