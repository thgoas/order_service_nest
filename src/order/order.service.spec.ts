import { Test, TestingModule } from '@nestjs/testing'
import { OrderService } from './order.service'
import { PrismaService } from '../common/prisma/prisma.service'
import { MailingService } from '../email/mailing.service'
import { BullModule, getQueueToken } from '@nestjs/bull'
import { CreateOrderDto } from './dto/create-order.dto'
import { UploadsService } from '../uploads/uploads.service'
import { Uploads } from 'src/uploads/entities/uploads.entity'
import { UpdateOrderDto } from './dto/update-order.dto'

jest.mock('multer', () => {
  return jest.fn().mockImplementation(() => ({
    single: jest.fn((fieldName: string) => (req, res, next) => {
      req.file = {
        fieldname: fieldName,
        originalname: 'test.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: 1024,
        buffer: Buffer.from('test image buffer'),
      }
      next()
    }),
  }))
})

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

const mokeOrders: any = [
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
    technical_accompaniments: [],
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
    technical_accompaniments: [],
  },
]
describe('OrderService', () => {
  let service: OrderService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [BullModule.registerQueue({ name: 'email' })],
      providers: [OrderService, PrismaService, MailingService, UploadsService],
    })
      .overrideProvider(getQueueToken('email'))
      .useValue({})
      .compile()

    service = module.get<OrderService>(OrderService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('find all orders services', () => {
    it('should return all orders for user admin', async () => {
      const reqUser = {
        sub: '1',
        userEmail: 'teste@email.com',
      }

      const userMoke = {
        id: '1',
        name: 'test',
        email: 'test@email.com.br',
        password: 'asdfasdfsdf',
        status: true,
        profile_id: '1',
        created_at: new Date(2024, 1, 1),
        updated_at: new Date(2024, 1, 1),
        token: null,
        image_url: '',
        filename: '',
        extension: '',
        company: [
          {
            id: '1',
            cin: '111',
            name: 'teste',
            fantasy: 'teste',
            email: 'thiago@abys.com.br',
            created_at: new Date(2024, 1, 1),
            updated_at: null,
          },
        ],
        profile: {
          id: '1',
          name: 'admin',
          description: 'admin',
        },
      }

      jest
        .spyOn(service['prisma'].user, 'findUnique')
        .mockResolvedValue(userMoke)
      jest
        .spyOn(service['prisma'].orderService, 'findMany')
        .mockResolvedValue(mokeOrders)

      const result = await service.findAll(reqUser)

      expect(result).toEqual(mokeOrders)
      expect(service['prisma'].orderService.findMany).toHaveBeenCalledTimes(1)
      expect(service['prisma'].orderService.findMany).toHaveBeenCalledWith({
        where: {
          company: {
            id: {
              in: ['1'],
            },
          },
        },
        include: {
          company: true,
          customers: true,
          images: true,
          history_order_service: true,
          status: true,
          technical_accompaniments: true,
        },
      })
    })
    it('should return all orders for user master', async () => {
      const reqUser = {
        sub: '1',
        userEmail: 'teste@email.com',
      }

      const userMoke = {
        id: '1',
        name: 'test',
        email: 'test@email.com.br',
        password: 'asdfasdfsdf',
        status: true,
        profile_id: '1',
        created_at: new Date(2024, 1, 1),
        updated_at: new Date(2024, 1, 1),
        token: null,
        image_url: '',
        filename: '',
        extension: '',
        company: [
          {
            id: '1',
            cin: '111',
            name: 'teste',
            fantasy: 'teste',
            email: 'thiago@abys.com.br',
            created_at: new Date(2024, 1, 1),
            updated_at: null,
          },
        ],
        profile: {
          id: '1',
          name: 'master',
          description: 'master',
        },
      }

      jest
        .spyOn(service['prisma'].user, 'findUnique')
        .mockResolvedValue(userMoke)
      jest
        .spyOn(service['prisma'].orderService, 'findMany')
        .mockResolvedValue(mokeOrders)

      const result = await service.findAll(reqUser)

      expect(result).toEqual(mokeOrders)
      expect(service['prisma'].orderService.findMany).toHaveBeenCalledTimes(1)
      expect(service['prisma'].orderService.findMany).toHaveBeenCalledWith({
        include: {
          company: true,
          customers: true,
          images: true,
          history_order_service: true,
          status: true,
          technical_accompaniments: true,
        },
      })
    })
  })
  describe('find One order', () => {
    it('should return one order for user admin or common', async () => {
      const reqUser = {
        sub: '1',
      }

      const userMoke = {
        id: '1',
        name: 'test',
        email: 'test@email.com.br',
        password: 'asdfasdfsdf',
        status: true,
        profile_id: '1',
        created_at: new Date(2024, 1, 1),
        updated_at: new Date(2024, 1, 1),
        token: null,
        image_url: '',
        filename: '',
        extension: '',
        company: [
          {
            id: '1',
            cin: '111',
            name: 'teste',
            fantasy: 'teste',
            email: 'thiago@abys.com.br',
            created_at: new Date(2024, 1, 1),
            updated_at: null,
          },
        ],
        profile: {
          id: '1',
          name: 'admin',
        },
      }

      jest
        .spyOn(service['prisma'].user, 'findUnique')
        .mockResolvedValue(userMoke)
      jest
        .spyOn(service['prisma'].orderService, 'findUnique')
        .mockResolvedValue(mokeOrders[0])

      const result = await service.findOne(1, reqUser)

      expect(result).toEqual(mokeOrders[0])
      expect(service['prisma'].orderService.findUnique).toHaveBeenCalledTimes(1)
      expect(service['prisma'].orderService.findUnique).toHaveBeenCalledWith({
        where: {
          id: 1,
          company: {
            id: {
              in: ['1'],
            },
          },
        },
        include: {
          company: true,
          customers: true,
          images: true,
          history_order_service: true,
          status: true,
          technical_accompaniments: true,
        },
      })
    })

    it('should return one order for user master', async () => {
      const reqUser = {
        sub: '1',
      }

      const userMoke = {
        id: '1',
        name: 'test',
        email: 'test@email.com.br',
        password: 'asdfasdfsdf',
        status: true,
        profile_id: '1',
        created_at: new Date(2024, 1, 1),
        updated_at: new Date(2024, 1, 1),
        token: null,
        image_url: '',
        filename: '',
        extension: '',
        company: [
          {
            id: '1',
            cin: '111',
            name: 'teste',
            fantasy: 'teste',
            email: 'thiago@abys.com.br',
            created_at: new Date(2024, 1, 1),
            updated_at: null,
          },
        ],
        profile: {
          id: '1',
          name: 'master',
        },
      }

      jest
        .spyOn(service['prisma'].user, 'findUnique')
        .mockResolvedValue(userMoke)
      jest
        .spyOn(service['prisma'].orderService, 'findUnique')
        .mockResolvedValue(mokeOrders[0])

      const result = await service.findOne(1, reqUser)

      expect(result).toEqual(mokeOrders[0])
      expect(service['prisma'].orderService.findUnique).toHaveBeenCalledTimes(1)
      expect(service['prisma'].orderService.findUnique).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
        include: {
          company: true,
          customers: true,
          images: true,
          history_order_service: true,
          status: true,
          technical_accompaniments: true,
        },
      })
    })
  })
  describe('create order', () => {
    it('should create and return order without image', async () => {
      const reqUser = {
        user: {
          sub: '1',
          userEmail: 'test@test.com',
        },
      }

      const userMoke = {
        id: '1',
        name: 'test',
        email: 'test@email.com.br',
        password: 'asdfasdfsdf',
        status: true,
        profile_id: '1',
        created_at: new Date(2024, 1, 1),
        updated_at: new Date(2024, 1, 1),
        token: null,
        image_url: '',
        filename: '',
        extension: '',
        company: [
          {
            id: '1',
            cin: '111',
            name: 'teste',
            fantasy: 'teste',
            email: 'test@email.com.br',
            created_at: new Date(2024, 1, 1),
            updated_at: null,
          },
        ],
        profile: {
          id: '1',
          name: 'admin',
        },
      }

      const createOrderDto: CreateOrderDto = {
        description: 'Troca de tela',
        status_id: '1',
        identification_number: '123',
        serie_number: '123334',
        date_entry: new Date(2024, 4, 1),
        departure_date: null,
        technician_id: '2',
        company_id: '1',
        customers_id: '1',
      }

      jest
        .spyOn(service['mailingService'], 'sendNewCreateOrderService')
        .mockResolvedValue()
      jest
        .spyOn(service['prisma'].user, 'findUnique')
        .mockResolvedValue(userMoke)
      jest
        .spyOn(service['prisma'].orderService, 'create')
        .mockResolvedValue(mokeOrders[0])
      jest.spyOn(service['uploadsService'], 'saveImages').mockResolvedValue([])
      const result = await service.create(createOrderDto, null, reqUser)

      expect(result).toEqual(mokeOrders[0])
      expect(service['prisma'].orderService.create).toHaveBeenCalledTimes(1)
      expect(service['prisma'].orderService.create).toHaveBeenCalledWith({
        data: {
          ...createOrderDto,
          user_id: '1',
          history_order_service: {
            create: {
              description: 'create a new order service by test@test.com',
            },
          },
          images: {
            createMany: {
              data: [],
            },
          },
        },
        include: {
          company: true,
          customers: true,
          images: true,
          history_order_service: true,
          status: true,
          technical_accompaniments: true,
        },
      })
      expect(service['uploadsService'].saveImages).toHaveBeenCalledTimes(1)
      expect(service['uploadsService'].saveImages).toHaveBeenCalledWith(null)
    })

    it('should create and return order with image', async () => {
      const reqUser = {
        user: {
          sub: '1',
          userEmail: 'test@test.com',
        },
      }

      const userMoke = {
        id: '1',
        name: 'test',
        email: 'test@email.com.br',
        password: 'asdfasdfsdf',
        status: true,
        profile_id: '1',
        created_at: new Date(2024, 1, 1),
        updated_at: new Date(2024, 1, 1),
        token: null,
        company: [
          {
            id: '1',
            cin: '111',
            name: 'teste',
            fantasy: 'teste',
            email: 'test@email.com.br',
            created_at: new Date(2024, 1, 1),
            updated_at: null,
          },
        ],
        profile: {
          id: '1',
          name: 'admin',
        },
        image_url: '',
        filename: '',
        extension: '',
      }

      const createOrderDto: CreateOrderDto = {
        description: 'Troca de tela',
        status_id: '1',
        identification_number: '123',
        serie_number: '123334',
        date_entry: new Date(2024, 4, 1),
        departure_date: null,
        technician_id: '2',
        company_id: '1',
        customers_id: '1',
      }

      const returnMockImages: Uploads[] = [
        {
          fileName: 'image test',
          extension: '.jpg',
        },
      ]

      jest
        .spyOn(service['mailingService'], 'sendNewCreateOrderService')
        .mockResolvedValue()
      jest
        .spyOn(service['prisma'].user, 'findUnique')
        .mockResolvedValue(userMoke)
      jest
        .spyOn(service['prisma'].orderService, 'create')
        .mockResolvedValue(mokeOrders[0])
      jest
        .spyOn(service['uploadsService'], 'saveImages')
        .mockResolvedValue(returnMockImages)
      const result = await service.create(createOrderDto, mockImages, reqUser)
      const images = returnMockImages.map((r) => {
        return {
          filename: r.fileName,
          extension: r.extension,
          url: `${process.env.IMAGES_URL}/${r.fileName}${r.extension}`,
        }
      })
      expect(result).toEqual(mokeOrders[0])
      expect(service['prisma'].orderService.create).toHaveBeenCalledTimes(1)
      expect(service['prisma'].orderService.create).toHaveBeenCalledWith({
        data: {
          ...createOrderDto,
          user_id: '1',
          history_order_service: {
            create: {
              description: 'create a new order service by test@test.com',
            },
          },
          images: {
            createMany: {
              data: images,
            },
          },
        },
        include: {
          company: true,
          customers: true,
          images: true,
          history_order_service: true,
          status: true,
          technical_accompaniments: true,
        },
      })
      expect(service['uploadsService'].saveImages).toHaveBeenCalledTimes(1)
      expect(service['uploadsService'].saveImages).toHaveBeenCalledWith(
        mockImages,
      )
    })
    it('should return exception and delete images', async () => {
      const reqUser = {
        user: {
          sub: '1',
          userEmail: 'test@test.com',
        },
      }

      const userMoke = {
        id: '1',
        name: 'test',
        email: 'test@email.com.br',
        password: 'asdfasdfsdf',
        status: true,
        profile_id: '1',
        created_at: new Date(2024, 1, 1),
        updated_at: new Date(2024, 1, 1),
        token: null,
        company: [
          {
            id: '1',
            cin: '111',
            name: 'teste',
            fantasy: 'teste',
            email: 'test@email.com.br',
            created_at: new Date(2024, 1, 1),
            updated_at: null,
          },
        ],
        profile: {
          id: '1',
          name: 'admin',
        },
        image_url: '',
        filename: '',
        extension: '',
      }

      const createOrderDto: CreateOrderDto = {
        description: 'Troca de tela',
        status_id: '1',
        identification_number: '123',
        serie_number: '123334',
        date_entry: new Date(2024, 4, 1),
        departure_date: null,
        technician_id: '2',
        company_id: '1',
        customers_id: '1',
      }

      const returnMockImages: Uploads[] = [
        {
          fileName: 'image test',
          extension: '.jpg',
        },
      ]

      jest
        .spyOn(service['mailingService'], 'sendNewCreateOrderService')
        .mockResolvedValue()
      jest
        .spyOn(service['prisma'].user, 'findUnique')
        .mockResolvedValue(userMoke)
      jest
        .spyOn(service['prisma'].orderService, 'create')
        .mockRejectedValue(new Error())
      jest
        .spyOn(service['uploadsService'], 'saveImages')
        .mockResolvedValue(returnMockImages)
      jest.spyOn(service['uploadsService'], 'deleteImages').mockResolvedValue()

      const images = returnMockImages.map((r) => {
        return {
          filename: r.fileName,
          extension: r.extension,
          url: `${process.env.IMAGES_URL}/${r.fileName}${r.extension}`,
        }
      })
      await expect(
        service.create(createOrderDto, mockImages, reqUser),
      ).rejects.toThrow('Error')
      expect(service['prisma'].orderService.create).toHaveBeenCalledTimes(1)
      expect(service['prisma'].orderService.create).toHaveBeenCalledWith({
        data: {
          ...createOrderDto,
          user_id: '1',
          history_order_service: {
            create: {
              description: 'create a new order service by test@test.com',
            },
          },
          images: {
            createMany: {
              data: images,
            },
          },
        },
        include: {
          company: true,
          customers: true,
          images: true,
          history_order_service: true,
          status: true,
          technical_accompaniments: true,
        },
      })
      expect(service['uploadsService'].saveImages).toHaveBeenCalledTimes(1)
      expect(service['uploadsService'].saveImages).toHaveBeenCalledWith(
        mockImages,
      )
      expect(service['uploadsService'].deleteImages).toHaveBeenCalledTimes(1)
      expect(service['uploadsService'].deleteImages).toHaveBeenCalledWith(
        returnMockImages,
      )
    })
  })
  describe('update order', () => {
    it('should edit with success for user master', async () => {
      const reqUser = {
        user: {
          sub: '1',
          userEmail: 'test@test.com',
        },
      }

      const userMoke = {
        id: '1',
        name: 'test',
        email: 'test@email.com.br',
        password: 'asdfasdfsdf',
        status: true,
        profile_id: '1',
        created_at: new Date(2024, 1, 1),
        updated_at: new Date(2024, 1, 1),
        token: null,
        image_url: '',
        filename: '',
        extension: '',
        company: [
          {
            id: '1',
            cin: '111',
            name: 'teste',
            fantasy: 'teste',
            email: 'test@email.com.br',
            created_at: new Date(2024, 1, 1),
            updated_at: null,
          },
        ],
        profile: {
          id: '1',
          name: 'master',
        },
      }

      const updateOrderDto: UpdateOrderDto = {
        description: 'Troca de tela',
        status_id: '1',
        identification_number: '123',
        serie_number: '123334',
        date_entry: new Date(2024, 4, 1),
        departure_date: null,
        technician_id: '2',
        company_id: '1',
        customers_id: '1',
      }

      jest
        .spyOn(service['mailingService'], 'sendUpdateOrderService')
        .mockResolvedValue()
      jest
        .spyOn(service['prisma'].user, 'findUnique')
        .mockResolvedValue(userMoke)
      jest
        .spyOn(service['prisma'].orderService, 'update')
        .mockResolvedValue(mokeOrders[0])

      const result = await service.update(1, updateOrderDto, reqUser)

      expect(result).toEqual(mokeOrders[0])
      expect(service['prisma'].orderService.update).toHaveBeenCalledTimes(1)
      expect(service['prisma'].orderService.update).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
        data: {
          ...updateOrderDto,
          history_order_service: {
            create: {
              description: 'Update Order Service by test@test.com | => null',
            },
          },
        },
        include: {
          company: true,
          customers: true,
          history_order_service: true,
          images: true,
          status: true,
          technical_accompaniments: true,
        },
      })
    })

    it('should edit with success for user admin or common', async () => {
      const reqUser = {
        user: {
          sub: '1',
          userEmail: 'test@test.com',
        },
      }

      const userMoke = {
        id: '1',
        name: 'test',
        email: 'test@email.com.br',
        password: 'asdfasdfsdf',
        status: true,
        profile_id: '1',
        created_at: new Date(2024, 1, 1),
        updated_at: new Date(2024, 1, 1),
        token: null,
        image_url: '',
        filename: '',
        extension: '',
        company: [
          {
            id: '1',
            cin: '111',
            name: 'teste',
            fantasy: 'teste',
            email: 'test@email.com.br',
            created_at: new Date(2024, 1, 1),
            updated_at: null,
          },
        ],
        profile: {
          id: '1',
          name: 'admin',
        },
      }

      const updateOrderDto: UpdateOrderDto = {
        description: 'Troca de tela',
        status_id: '1',
        identification_number: '123',
        serie_number: '123334',
        date_entry: new Date(2024, 4, 1),
        departure_date: null,
        technician_id: '2',
        company_id: '1',
        customers_id: '1',
      }

      jest
        .spyOn(service['mailingService'], 'sendUpdateOrderService')
        .mockResolvedValue()
      jest
        .spyOn(service['prisma'].user, 'findUnique')
        .mockResolvedValue(userMoke)
      jest
        .spyOn(service['prisma'].orderService, 'update')
        .mockResolvedValue(mokeOrders[0])

      const result = await service.update(1, updateOrderDto, reqUser)

      expect(result).toEqual(mokeOrders[0])
      expect(service['prisma'].orderService.update).toHaveBeenCalledTimes(1)
      expect(service['prisma'].orderService.update).toHaveBeenCalledWith({
        where: {
          id: 1,
          company: {
            id: {
              in: ['1'],
            },
          },
        },
        data: {
          ...updateOrderDto,
          history_order_service: {
            create: {
              description: 'Update Order Service by test@test.com | => null',
            },
          },
        },
        include: {
          company: true,
          customers: true,
          history_order_service: true,
          images: true,
          status: true,
          technical_accompaniments: true,
        },
      })
    })

    it('should return exception and delete Images for user master', async () => {
      const reqUser = {
        user: {
          sub: '1',
          userEmail: 'test@test.com',
        },
      }

      const userMoke = {
        id: '1',
        name: 'test',
        email: 'test@email.com.br',
        password: 'asdfasdfsdf',
        status: true,
        profile_id: '1',
        created_at: new Date(2024, 1, 1),
        updated_at: new Date(2024, 1, 1),
        token: null,
        image_url: '',
        filename: '',
        extension: '',
        company: [
          {
            id: '1',
            cin: '111',
            name: 'teste',
            fantasy: 'teste',
            email: 'test@email.com.br',
            created_at: new Date(2024, 1, 1),
            updated_at: null,
          },
        ],
        profile: {
          id: '1',
          name: 'master',
        },
      }

      const updateOrderDto: UpdateOrderDto = {
        description: 'Troca de tela',
        status_id: '1',
        identification_number: '123',
        serie_number: '123334',
        date_entry: new Date(2024, 4, 1),
        departure_date: null,
        technician_id: '2',
        company_id: '1',
        customers_id: '1',
      }

      jest
        .spyOn(service['mailingService'], 'sendUpdateOrderService')
        .mockResolvedValue()
      jest
        .spyOn(service['prisma'].user, 'findUnique')
        .mockResolvedValue(userMoke)
      jest
        .spyOn(service['prisma'].orderService, 'update')
        .mockRejectedValue(new Error())

      jest.spyOn(service['uploadsService'], 'deleteImages').mockResolvedValue()

      await expect(service.update(1, updateOrderDto, reqUser)).rejects.toThrow(
        'Error',
      )
      expect(service['prisma'].orderService.update).toHaveBeenCalledTimes(1)
      expect(service['prisma'].orderService.update).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
        data: {
          ...updateOrderDto,
          history_order_service: {
            create: {
              description: 'Update Order Service by test@test.com | => null',
            },
          },
        },
        include: {
          company: true,
          customers: true,
          history_order_service: true,
          images: true,
          status: true,
          technical_accompaniments: true,
        },
      })
    })
    it('should return exception and delete Images for user admin or common', async () => {
      const reqUser = {
        user: {
          sub: '1',
          userEmail: 'test@test.com',
        },
      }

      const userMoke = {
        id: '1',
        name: 'test',
        email: 'test@email.com.br',
        password: 'asdfasdfsdf',
        status: true,
        profile_id: '1',
        created_at: new Date(2024, 1, 1),
        updated_at: new Date(2024, 1, 1),
        token: null,
        image_url: '',
        filename: '',
        extension: '',
        company: [
          {
            id: '1',
            cin: '111',
            name: 'teste',
            fantasy: 'teste',
            email: 'test@email.com.br',
            created_at: new Date(2024, 1, 1),
            updated_at: null,
          },
        ],
        profile: {
          id: '1',
          name: 'admin',
        },
      }

      const updateOrderDto: UpdateOrderDto = {
        description: 'Troca de tela',
        status_id: '1',
        identification_number: '123',
        serie_number: '123334',
        date_entry: new Date(2024, 4, 1),
        departure_date: null,
        technician_id: '2',
        company_id: '1',
        customers_id: '1',
      }

      jest
        .spyOn(service['mailingService'], 'sendUpdateOrderService')
        .mockResolvedValue()
      jest
        .spyOn(service['prisma'].user, 'findUnique')
        .mockResolvedValue(userMoke)
      jest
        .spyOn(service['prisma'].orderService, 'update')
        .mockRejectedValue(new Error())

      jest.spyOn(service['uploadsService'], 'deleteImages').mockResolvedValue()

      await expect(service.update(1, updateOrderDto, reqUser)).rejects.toThrow(
        'Error',
      )
      expect(service['prisma'].orderService.update).toHaveBeenCalledTimes(1)
      expect(service['prisma'].orderService.update).toHaveBeenCalledWith({
        where: {
          id: 1,
          company: {
            id: {
              in: ['1'],
            },
          },
        },
        data: {
          ...updateOrderDto,
          history_order_service: {
            create: {
              description: 'Update Order Service by test@test.com | => null',
            },
          },
        },
        include: {
          company: true,
          customers: true,
          history_order_service: true,
          images: true,
          status: true,
          technical_accompaniments: true,
        },
      })
    })
  })
  describe('delete order', () => {
    it('should delete with success for user master', async () => {
      const reqUser = {
        user: {
          sub: '1',
          userEmail: 'test@test.com',
        },
      }

      const userMoke = {
        id: '1',
        name: 'test',
        email: 'test@email.com.br',
        password: 'asdfasdfsdf',
        status: true,
        profile_id: '1',
        created_at: new Date(2024, 1, 1),
        updated_at: new Date(2024, 1, 1),
        token: null,
        image_url: '',
        filename: '',
        extension: '',
        company: [
          {
            id: '1',
            cin: '111',
            name: 'teste',
            fantasy: 'teste',
            email: 'test@email.com.br',
            created_at: new Date(2024, 1, 1),
            updated_at: null,
          },
        ],
        profile: {
          id: '1',
          name: 'master',
        },
      }

      jest
        .spyOn(service['mailingService'], 'sendDeleteOrderService')
        .mockResolvedValue()
      jest
        .spyOn(service['prisma'].user, 'findUnique')
        .mockResolvedValue(userMoke)
      jest
        .spyOn(service['prisma'].orderService, 'delete')
        .mockResolvedValue(mokeOrders[0])
      jest.spyOn(service['uploadsService'], 'deleteImages').mockResolvedValue()
      const result = await service.remove(1, reqUser)

      expect(result).toEqual(mokeOrders[0])
      expect(service['prisma'].orderService.delete).toHaveBeenCalledTimes(1)
      expect(service['prisma'].orderService.delete).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
        include: {
          customers: true,
          images: true,
          status: true,
          technical_accompaniments: true,
        },
      })
      const deleteImages = result.images.map((r) => {
        return {
          fileName: r.filename,
          extension: r.extension,
        }
      })
      expect(service['uploadsService'].deleteImages).toHaveBeenCalledTimes(1)
      expect(service['uploadsService'].deleteImages).toHaveBeenCalledWith(
        deleteImages,
      )
    })

    it('should delete with success for user different of master', async () => {
      const reqUser = {
        user: {
          sub: '1',
          userEmail: 'test@test.com',
        },
      }

      const userMoke = {
        id: '1',
        name: 'test',
        email: 'test@email.com.br',
        password: 'asdfasdfsdf',
        status: true,
        profile_id: '1',
        created_at: new Date(2024, 1, 1),
        updated_at: new Date(2024, 1, 1),
        token: null,
        image_url: '',
        filename: '',
        extension: '',
        company: [
          {
            id: '1',
            cin: '111',
            name: 'teste',
            fantasy: 'teste',
            email: 'test@email.com.br',
            created_at: new Date(2024, 1, 1),
            updated_at: null,
          },
        ],
        profile: {
          id: '1',
          name: 'admin',
        },
      }

      jest
        .spyOn(service['mailingService'], 'sendDeleteOrderService')
        .mockResolvedValue()
      jest
        .spyOn(service['prisma'].user, 'findUnique')
        .mockResolvedValue(userMoke)
      jest
        .spyOn(service['prisma'].orderService, 'delete')
        .mockResolvedValue(mokeOrders[0])
      jest.spyOn(service['uploadsService'], 'deleteImages').mockResolvedValue()
      const result = await service.remove(1, reqUser)

      expect(result).toEqual(mokeOrders[0])
      expect(service['prisma'].orderService.delete).toHaveBeenCalledTimes(1)
      expect(service['prisma'].orderService.delete).toHaveBeenCalledWith({
        where: {
          id: 1,
          company: {
            id: {
              in: ['1'],
            },
          },
        },
        include: {
          customers: true,
          images: true,
          status: true,
          technical_accompaniments: true,
        },
      })
      const deleteImages = result.images.map((r) => {
        return {
          fileName: r.filename,
          extension: r.extension,
        }
      })
      expect(service['uploadsService'].deleteImages).toHaveBeenCalledTimes(1)
      expect(service['uploadsService'].deleteImages).toHaveBeenCalledWith(
        deleteImages,
      )
    })
  })
})
