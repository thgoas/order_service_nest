import { Test, TestingModule } from '@nestjs/testing'
import { ImagesService } from './images.service'
import { PrismaService } from '../common/prisma/prisma.service'
import { UploadsService } from '../uploads/uploads.service'
import { MailingService } from '../email/mailing.service'
import { OrderService } from '../order/order.service'
import { BullModule } from '@nestjs/bull'

const mockImages: Express.Multer.File[] = [
  {
    fieldname: 'imageField',
    originalname: 'image1.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    size: 1024,
    buffer: Buffer.from('fake-image-buffer-1'),
    stream: null,
    destination: '/uploads',
    filename: 'image1.jpg',
    path: '/uploads/image1.jpg',
  },
  {
    fieldname: 'imageField',
    originalname: 'image2.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    size: 2048,
    buffer: Buffer.from('fake-image-buffer-2'),
    stream: null,
    destination: '/uploads',
    filename: 'image2.jpg',
    path: '/uploads/image2.jpg',
  },
]

const fakeImages = {
  id: '1',
  order_id: 1,
  url: 'htt://localhost/uploads/test.jpg',
  filename: 'test',
  extension: '.jpg',
  created_at: new Date(2022, 1, 1),
}

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
    technical_accompaniments: [],
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
    technical_accompaniments: [],
  },
]

describe('ImagesService', () => {
  let service: ImagesService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [BullModule.registerQueue({ name: 'email' })],
      providers: [
        ImagesService,
        PrismaService,
        UploadsService,
        MailingService,
        OrderService,
      ],
    }).compile()

    service = module.get<ImagesService>(ImagesService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should return order service with new images ', async () => {
      const dto = {
        order_id: '1',
      }
      const req = {
        user: {
          sub: '1',
          userEmail: 'user@email.com',
        },
      }

      jest.spyOn(service['uploadsService'], 'saveImages').mockResolvedValue([
        {
          fileName: 'test',
          extension: '.jpg',
        },
        {
          fileName: 'test',
          extension: '.jpg',
        },
      ])
      jest
        .spyOn(service['mailingService'], 'sendUpdateOrderService')
        .mockResolvedValue()
      jest
        .spyOn(service['prisma'].image, 'create')
        .mockResolvedValue(fakeImages)
      jest
        .spyOn(service['prisma'].user, 'findUnique')
        .mockResolvedValue(fakeReturnUser)
      jest
        .spyOn(service['prisma'].orderService, 'findUnique')
        .mockResolvedValue(fakeOrderService[0])
      const images = { image: mockImages }
      const result = await service.create(dto, images, req)

      expect(result).toEqual(fakeOrderService[0])
      expect(service['prisma'].orderService.findUnique).toHaveBeenCalledTimes(1)
      expect(service['prisma'].image.create).toHaveBeenCalledTimes(2)
    })

    it('should return exception BadGatewayException ', async () => {
      const dto = {
        order_id: '1',
      }
      const req = {
        user: {
          sub: '1',
          userEmail: 'user@email.com',
        },
      }

      jest.spyOn(service['uploadsService'], 'saveImages').mockResolvedValue([
        {
          fileName: 'test',
          extension: '.jpg',
        },
        {
          fileName: 'test',
          extension: '.jpg',
        },
      ])
      jest
        .spyOn(service['mailingService'], 'sendUpdateOrderService')
        .mockResolvedValue()
      jest
        .spyOn(service['prisma'].image, 'create')
        .mockRejectedValue(new Error())
      jest
        .spyOn(service['prisma'].user, 'findUnique')
        .mockResolvedValue(fakeReturnUser)
      jest
        .spyOn(service['prisma'].orderService, 'findUnique')
        .mockResolvedValue(fakeOrderService[0])
      await expect(service.create(dto, mockImages, req)).rejects.toThrow('')
      expect(service['prisma'].orderService.findUnique).toHaveBeenCalledTimes(0)
    })

    it('should return exception BadGatewayException with image is null ', async () => {
      const dto = {
        order_id: '1',
      }
      const req = {
        user: {
          sub: '1',
          userEmail: 'user@email.com',
        },
      }

      jest.spyOn(service['uploadsService'], 'saveImages').mockResolvedValue([
        {
          fileName: 'test',
          extension: '.jpg',
        },
        {
          fileName: 'test',
          extension: '.jpg',
        },
      ])
      jest
        .spyOn(service['mailingService'], 'sendUpdateOrderService')
        .mockResolvedValue()
      jest
        .spyOn(service['prisma'].image, 'create')
        .mockRejectedValue(new Error())
      jest
        .spyOn(service['prisma'].user, 'findUnique')
        .mockResolvedValue(fakeReturnUser)
      jest
        .spyOn(service['prisma'].orderService, 'findUnique')
        .mockResolvedValue(fakeOrderService[0])
      await expect(service.create(dto, null, req)).rejects.toThrow('')
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
        .spyOn(service['prisma'].image, 'delete')
        .mockResolvedValue(fakeImages)
      jest
        .spyOn(service['prisma'].user, 'findUnique')
        .mockResolvedValue(fakeReturnUser)
      jest
        .spyOn(service['prisma'].orderService, 'findUnique')
        .mockResolvedValue(fakeOrderService[0])
      const result = await service.remove('1', req)

      expect(result).toEqual(fakeOrderService[0])
      expect(service['prisma'].orderService.findUnique).toHaveBeenCalledTimes(1)
      expect(service['prisma'].image.delete).toHaveBeenCalledTimes(1)
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
        .spyOn(service['prisma'].image, 'delete')
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
