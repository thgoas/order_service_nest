import { Test, TestingModule } from '@nestjs/testing'
import { TechnicalAccompanimentsController } from './technical-accompaniments.controller'
import { TechnicalAccompanimentsService } from './technical-accompaniments.service'
import { PrismaService } from '../common/prisma/prisma.service'
import { MailingService } from '../email/mailing.service'
import { OrderService } from '../order/order.service'
import { BullModule } from '@nestjs/bull'
import { UploadsService } from '../uploads/uploads.service'
import { JwtService } from '@nestjs/jwt'

describe('TechnicalAccompanimentsController', () => {
  let controller: TechnicalAccompanimentsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [BullModule.registerQueue({ name: 'email' })],
      controllers: [TechnicalAccompanimentsController],
      providers: [
        TechnicalAccompanimentsService,
        PrismaService,
        MailingService,
        OrderService,
        UploadsService,
        JwtService,
      ],
    }).compile()

    controller = module.get<TechnicalAccompanimentsController>(
      TechnicalAccompanimentsController,
    )
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
