import { Test, TestingModule } from '@nestjs/testing'
import { ImagesController } from './images.controller'
import { ImagesService } from './images.service'
import { PrismaService } from '../common/prisma/prisma.service'
import { UploadsService } from '../uploads/uploads.service'
import { MailingService } from '../email/mailing.service'
import { OrderService } from '../order/order.service'
import { BullModule } from '@nestjs/bull'
import { JwtService } from '@nestjs/jwt'

describe('ImagesController', () => {
  let controller: ImagesController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [BullModule.registerQueue({ name: 'email' })],
      controllers: [ImagesController],
      providers: [
        ImagesService,
        PrismaService,
        UploadsService,
        MailingService,
        OrderService,
        JwtService,
      ],
    }).compile()

    controller = module.get<ImagesController>(ImagesController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
