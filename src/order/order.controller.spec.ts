import { Test, TestingModule } from '@nestjs/testing'
import { OrderController } from './order.controller'
import { OrderService } from './order.service'
import { PrismaService } from '../common/prisma/prisma.service'
import { MailingService } from '../email/mailing.service'
import { UploadsService } from '../uploads/uploads.service'
import { CommonModule } from '../common/common.module'
import { BullModule } from '@nestjs/bull'
import { JwtService } from '@nestjs/jwt'

describe('OrderController', () => {
  let controller: OrderController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CommonModule, BullModule.registerQueue({ name: 'email' })],
      controllers: [OrderController],
      providers: [
        OrderService,
        PrismaService,
        MailingService,
        UploadsService,
        JwtService,
      ],
    }).compile()

    controller = module.get<OrderController>(OrderController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
