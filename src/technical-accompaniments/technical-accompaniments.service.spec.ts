import { Test, TestingModule } from '@nestjs/testing'
import { TechnicalAccompanimentsService } from './technical-accompaniments.service'
import { PrismaService } from '../common/prisma/prisma.service'
import { MailingService } from '../email/mailing.service'
import { OrderService } from '../order/order.service'
import { BullModule } from '@nestjs/bull'
import { UploadsService } from '../uploads/uploads.service'

const fakeTA = [
  {
    id: '1',
    description: 'fake accompaniments',
    date: new Date(2024, 1, 1),
    order_service_id: 1,
    user_id: '1',
  },
  {
    id: '2',
    description: 'fake accompaniments',
    date: new Date(2024, 1, 1),
    order_service_id: 1,
    user_id: '1',
  },
]

const fakeReturnUser = {
  id: '1',
  name: 'test user',
  email: 'test@email.com',
  password: 'hash password',
  status: true,
  profile_id: '1',
  created_at: new Date(2022, 1, 1),
  updated_at: null,
  token: '',
  image_url: '',
  filename: '',
  extension: '',
  profile: {
    name: 'master',
  },
}

const fakeOrderService = [
  {
    id: 1,
    description: 'Troca de tela',
    status_id: '1',
    identification_number: '123',
    serie_number: '123334',
    user_id: '1',
    date_entry: new Date(2024, 4, 1),
    departure_date: null,
    technician_id: '2',
    company_id: '1',
    customers_id: '1',
    solution: '',
    customers: {
      email: 'customers@email.com',
    },
    status: {
      name: 'open',
      description: 'open',
    },
    images: [{ filename: 'image test', extension: '.test' }],
  },
  {
    id: 2,
    description: 'Troca de bateria',
    status_id: '1',
    identification_number: '123',
    serie_number: '123334',
    user_id: '2',
    date_entry: new Date(2024, 4, 1),
    departure_date: null,
    technician_id: '1',
    company_id: '1',
    customers_id: '1',
    solution: '',
    customers: {
      email: 'customers@email.com',
    },
    status: {
      name: 'open',
      description: 'open',
    },
  },
]

describe('TechnicalAccompanimentsService', () => {
  let service: TechnicalAccompanimentsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [BullModule.registerQueue({ name: 'email' })],
      providers: [
        TechnicalAccompanimentsService,
        PrismaService,
        MailingService,
        OrderService,
        UploadsService,
      ],
    }).compile()

    service = module.get<TechnicalAccompanimentsService>(
      TechnicalAccompanimentsService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should return order service with new accompaniment ', async () => {
      const dto = {
        description: 'test',
        order_service_id: '1',
      }
      const req = {
        user: {
          sub: '1',
          userEmail: 'user@email.com',
        },
      }
      jest
        .spyOn(service['mailingService'], 'sendUpdateOrderService')
        .mockResolvedValue()
      jest
        .spyOn(service['prisma'].technicalAccompaniments, 'create')
        .mockResolvedValue(fakeTA[0])
      jest
        .spyOn(service['prisma'].user, 'findUnique')
        .mockResolvedValue(fakeReturnUser)
      jest
        .spyOn(service['prisma'].orderService, 'findUnique')
        .mockResolvedValue(fakeOrderService[0])
      const result = await service.create(dto, req)

      expect(result).toEqual(fakeOrderService[0])
      expect(service['prisma'].orderService.findUnique).toHaveBeenCalledTimes(1)
      expect(
        service['prisma'].technicalAccompaniments.create,
      ).toHaveBeenCalledTimes(1)
    })

    it('should return exception BadGatewayException ', async () => {
      const dto = {
        description: 'test',
        order_service_id: '1',
      }
      const req = {
        user: {
          sub: '1',
          userEmail: 'user@email.com',
        },
      }
      jest
        .spyOn(service['mailingService'], 'sendUpdateOrderService')
        .mockResolvedValue()
      jest
        .spyOn(service['prisma'].technicalAccompaniments, 'create')
        .mockRejectedValue(new Error())
      jest
        .spyOn(service['prisma'].user, 'findUnique')
        .mockResolvedValue(fakeReturnUser)
      jest
        .spyOn(service['prisma'].orderService, 'findUnique')
        .mockResolvedValue(fakeOrderService[0])
      await expect(service.create(dto, req)).rejects.toThrow('')
      expect(service['prisma'].orderService.findUnique).toHaveBeenCalledTimes(0)
    })
  })

  describe('update', () => {
    it('should return order service edit with new accompaniment ', async () => {
      const dto = {
        description: 'test',
        order_service_id: '1',
      }
      const req = {
        user: {
          sub: '1',
          userEmail: 'user@email.com',
        },
      }
      jest
        .spyOn(service['mailingService'], 'sendUpdateOrderService')
        .mockResolvedValue()
      jest
        .spyOn(service['prisma'].technicalAccompaniments, 'update')
        .mockResolvedValue(fakeTA[0])
      jest
        .spyOn(service['prisma'].user, 'findUnique')
        .mockResolvedValue(fakeReturnUser)
      jest
        .spyOn(service['prisma'].orderService, 'findUnique')
        .mockResolvedValue(fakeOrderService[0])
      const result = await service.update('1', dto, req)

      expect(result).toEqual(fakeOrderService[0])
      expect(service['prisma'].orderService.findUnique).toHaveBeenCalledTimes(1)
      expect(
        service['prisma'].technicalAccompaniments.update,
      ).toHaveBeenCalledTimes(1)
    })

    it('should return exception BadGatewayException for update ', async () => {
      const dto = {
        description: 'test',
        order_service_id: '1',
      }
      const req = {
        user: {
          sub: '1',
          userEmail: 'user@email.com',
        },
      }
      jest
        .spyOn(service['mailingService'], 'sendUpdateOrderService')
        .mockResolvedValue()
      jest
        .spyOn(service['prisma'].technicalAccompaniments, 'update')
        .mockRejectedValue(new Error())
      jest
        .spyOn(service['prisma'].user, 'findUnique')
        .mockResolvedValue(fakeReturnUser)
      jest
        .spyOn(service['prisma'].orderService, 'findUnique')
        .mockResolvedValue(fakeOrderService[0])
      await expect(service.update('1', dto, req)).rejects.toThrow('')
      expect(service['prisma'].orderService.findUnique).toHaveBeenCalledTimes(0)
    })
  })

  describe('delete', () => {
    it('should return order service delete with new accompaniment ', async () => {
      const req = {
        user: {
          sub: '1',
          userEmail: 'user@email.com',
        },
      }
      jest
        .spyOn(service['mailingService'], 'sendUpdateOrderService')
        .mockResolvedValue()
      jest
        .spyOn(service['prisma'].technicalAccompaniments, 'delete')
        .mockResolvedValue(fakeTA[0])
      jest
        .spyOn(service['prisma'].user, 'findUnique')
        .mockResolvedValue(fakeReturnUser)
      jest
        .spyOn(service['prisma'].orderService, 'findUnique')
        .mockResolvedValue(fakeOrderService[0])
      const result = await service.remove('1', req)

      expect(result).toEqual(fakeOrderService[0])
      expect(service['prisma'].orderService.findUnique).toHaveBeenCalledTimes(1)
      expect(
        service['prisma'].technicalAccompaniments.delete,
      ).toHaveBeenCalledTimes(1)
    })

    it('should return exception BadGatewayException for delete ', async () => {
      const req = {
        user: {
          sub: '1',
          userEmail: 'user@email.com',
        },
      }
      jest
        .spyOn(service['mailingService'], 'sendUpdateOrderService')
        .mockResolvedValue()
      jest
        .spyOn(service['prisma'].technicalAccompaniments, 'delete')
        .mockRejectedValue(new Error())
      jest
        .spyOn(service['prisma'].user, 'findUnique')
        .mockResolvedValue(fakeReturnUser)
      jest
        .spyOn(service['prisma'].orderService, 'findUnique')
        .mockResolvedValue(fakeOrderService[0])
      await expect(service.remove('1', req)).rejects.toThrow('')
      expect(service['prisma'].orderService.findUnique).toHaveBeenCalledTimes(0)
    })
  })
})
