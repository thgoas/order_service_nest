import { Test, TestingModule } from '@nestjs/testing'
import { CustomersService } from './customers.service'
import { PrismaService } from '../common/prisma/prisma.service'
import { UploadsService } from '../uploads/uploads.service'
import { afterEach } from 'node:test'
import { CreateCustomerDto } from './dto/create-customer.dto'
import { cpf } from 'cpf-cnpj-validator'

const fakeCpf = cpf.generate()
const fakeCustomers = [
  {
    id: '1',
    name: 'test customers',
    fantasy_name: 'fantasy customers',
    identification_number: fakeCpf,
    legal_person: true,
    email: 'test@email.com',
    company_id: '1',
    image_url: '',
    filename: '',
    extension: '',
  },
  {
    id: '2',
    name: 'test customers',
    fantasy_name: 'fantasy customers',
    identification_number: fakeCpf,
    legal_person: true,
    email: 'test@email.com',
    company_id: '1',
    image_url: '',
    filename: '',
    extension: '',
  },
]

describe('CustomersService', () => {
  let service: CustomersService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomersService, PrismaService, UploadsService],
    }).compile()

    service = module.get<CustomersService>(CustomersService)
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('find all', () => {
    it('should return all register', async () => {
      const req = {
        userProfile: {
          name: 'fulano',
          profile: {
            name: 'admin',
          },
          company: [{ id: '1' }],
        },
      }
      jest
        .spyOn(service['prisma'].customers, 'findMany')
        .mockResolvedValue(fakeCustomers)

      const result = await service.findAll(req)

      expect(result).toEqual(fakeCustomers)
      expect(service['prisma'].customers.findMany).toHaveBeenCalledTimes(1)
      expect(service['prisma'].customers.findMany).toHaveBeenCalledWith({
        where: {
          company_id: {
            in: ['1'],
          },
        },
      })
    })
    it('should return exception', async () => {
      const req = {
        userProfile: {
          name: 'fulano',
          profile: {
            name: 'admin',
          },
          company: [{ id: '1' }],
        },
      }
      jest
        .spyOn(service['prisma'].customers, 'findMany')
        .mockRejectedValue(new Error())

      await expect(service.findAll(req)).rejects.toThrow('Error')
      expect(service['prisma'].customers.findMany).toHaveBeenCalledTimes(1)
      expect(service['prisma'].customers.findMany).toHaveBeenCalledWith({
        where: {
          company_id: {
            in: ['1'],
          },
        },
      })
    })
  })
  describe('find one', () => {
    it('should return one register', async () => {
      const req = {
        userProfile: {
          name: 'fulano',
          profile: {
            name: 'admin',
          },
          company: [{ id: '1' }],
        },
      }
      jest
        .spyOn(service['prisma'].customers, 'findUnique')
        .mockResolvedValue(fakeCustomers[0])
      const result = await service.findOne('1', req)

      expect(result).toEqual(fakeCustomers[0])
      expect(service['prisma'].customers.findUnique).toHaveBeenCalledTimes(1)
      expect(service['prisma'].customers.findUnique).toHaveBeenCalledWith({
        where: {
          id: '1',
          company_id: {
            in: ['1'],
          },
        },
      })
    })
    it('should return exception', async () => {
      const req = {
        userProfile: {
          name: 'fulano',
          profile: {
            name: 'admin',
          },
          company: [{ id: '1' }],
        },
      }
      jest
        .spyOn(service['prisma'].customers, 'findUnique')
        .mockRejectedValue(new Error())

      await expect(service.findOne('1', req)).rejects.toThrow('Error')
      expect(service['prisma'].customers.findUnique).toHaveBeenCalledTimes(1)
      expect(service['prisma'].customers.findUnique).toHaveBeenCalledWith({
        where: {
          id: '1',
          company_id: {
            in: ['1'],
          },
        },
      })
    })
  })
  describe('create', () => {
    it('should return new register without image', async () => {
      const req = {
        userProfile: {
          name: 'fulano',
          profile: {
            name: 'admin',
          },
          company: [{ id: '1' }],
        },
      }

      const customerDto: CreateCustomerDto = {
        name: 'test customers',
        fantasy_name: 'fantasy customers',
        identification_number: fakeCpf,
        legal_person: true,
        email: 'test@email.com',
        company_id: '1',
      }

      const companies = [
        {
          id: '1',
          cin: '11111111',
          name: 'company test',
          fantasy: 'fantasy company test',
          email: 'comp@email.com',
          created_at: new Date(2022, 1, 1),
          updated_at: null,
        },
      ]

      jest
        .spyOn(service['prisma'].customers, 'create')
        .mockResolvedValue(fakeCustomers[0])
      jest
        .spyOn(service['prisma'].company, 'findMany')
        .mockResolvedValue(companies)

      const result = await service.create(customerDto, null, req)

      expect(result).toEqual(fakeCustomers[0])
      expect(service['prisma'].customers.create).toHaveBeenCalledTimes(1)
      expect(service['prisma'].company.findMany).toHaveBeenCalledTimes(1)
    })

    it('should return new register with image', async () => {
      const req = {
        userProfile: {
          name: 'fulano',
          profile: {
            name: 'admin',
          },
          company: [{ id: '1' }],
        },
      }

      const customerDto: CreateCustomerDto = {
        name: 'test customers',
        fantasy_name: 'fantasy customers',
        identification_number: fakeCpf,
        legal_person: true,
        email: 'test@email.com',
        company_id: '1',
      }

      const image: Express.Multer.File = {
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
      }

      const companies = [
        {
          id: '1',
          cin: '11111111',
          name: 'company test',
          fantasy: 'fantasy company test',
          email: 'comp@email.com',
          created_at: new Date(2022, 1, 1),
          updated_at: null,
        },
      ]

      jest
        .spyOn(service['prisma'].customers, 'create')
        .mockResolvedValue(fakeCustomers[0])
      jest
        .spyOn(service['prisma'].company, 'findMany')
        .mockResolvedValue(companies)
      jest
        .spyOn(service['uploadsService'], 'saveUserImage')
        .mockResolvedValue({ fileName: 'test', extension: 'tes.jpg' })

      const result = await service.create(customerDto, image, req)

      expect(result).toEqual(fakeCustomers[0])
      expect(service['prisma'].customers.create).toHaveBeenCalledTimes(1)
      expect(service['prisma'].company.findMany).toHaveBeenCalledTimes(1)
    })

    it('should return exception without image', async () => {
      const req = {
        userProfile: {
          name: 'fulano',
          profile: {
            name: 'admin',
          },
          company: [{ id: '1' }],
        },
      }

      const customerDto: CreateCustomerDto = {
        name: 'test customers',
        fantasy_name: 'fantasy customers',
        identification_number: fakeCpf,
        legal_person: true,
        email: 'test@email.com',
        company_id: '1',
      }

      const companies = [
        {
          id: '1',
          cin: '11111111',
          name: 'company test',
          fantasy: 'fantasy company test',
          email: 'comp@email.com',
          created_at: new Date(2022, 1, 1),
          updated_at: null,
        },
      ]

      jest
        .spyOn(service['prisma'].customers, 'create')
        .mockRejectedValue(new Error())
      jest
        .spyOn(service['prisma'].company, 'findMany')
        .mockResolvedValue(companies)

      await expect(service.create(customerDto, null, req)).rejects.toThrow(
        'Error',
      )
      expect(service['prisma'].customers.create).toHaveBeenCalledTimes(1)
      expect(service['prisma'].company.findMany).toHaveBeenCalledTimes(1)
    })

    it('should return exception with image', async () => {
      const req = {
        userProfile: {
          name: 'fulano',
          profile: {
            name: 'admin',
          },
          company: [{ id: '1' }],
        },
      }

      const customerDto: CreateCustomerDto = {
        name: 'test customers',
        fantasy_name: 'fantasy customers',
        identification_number: fakeCpf,
        legal_person: true,
        email: 'test@email.com',
        company_id: '1',
      }

      const image: Express.Multer.File = {
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
      }

      const companies = [
        {
          id: '1',
          cin: '11111111',
          name: 'company test',
          fantasy: 'fantasy company test',
          email: 'comp@email.com',
          created_at: new Date(2022, 1, 1),
          updated_at: null,
        },
      ]

      jest
        .spyOn(service['prisma'].customers, 'create')
        .mockRejectedValue(new Error())
      jest
        .spyOn(service['prisma'].company, 'findMany')
        .mockResolvedValue(companies)
      jest
        .spyOn(service['uploadsService'], 'saveUserImage')
        .mockResolvedValue({ fileName: 'test', extension: 'tes.jpg' })

      jest
        .spyOn(service['uploadsService'], 'deleteUserImage')
        .mockResolvedValue()

      await expect(service.create(customerDto, image, req)).rejects.toThrow(
        'Error',
      )
      expect(service['prisma'].customers.create).toHaveBeenCalledTimes(1)
      expect(service['prisma'].company.findMany).toHaveBeenCalledTimes(1)
    })

    it('should return exception for identification number incorrect for legal person true', async () => {
      const req = {
        userProfile: {
          name: 'fulano',
          profile: {
            name: 'admin',
          },
          company: [{ id: '1' }],
        },
      }
      const customerDto: CreateCustomerDto = {
        name: 'test customers',
        fantasy_name: 'fantasy customers',
        identification_number: '11111111111',
        legal_person: true,
        email: 'test@email.com',
        company_id: '1',
      }

      const companies = [
        {
          id: '1',
          cin: '11111111',
          name: 'company test',
          fantasy: 'fantasy company test',
          email: 'comp@email.com',
          created_at: new Date(2022, 1, 1),
          updated_at: null,
        },
      ]

      jest
        .spyOn(service['prisma'].customers, 'create')
        .mockRejectedValue(new Error())
      jest
        .spyOn(service['prisma'].company, 'findMany')
        .mockResolvedValue(companies)

      await expect(service.create(customerDto, null, req)).rejects.toThrow(
        'Invalid identification number',
      )
      expect(service['prisma'].customers.create).toHaveBeenCalledTimes(0)
      expect(service['prisma'].company.findMany).toHaveBeenCalledTimes(0)
    })
    it('should return exception for identification number incorrect (more than or less than) for legal person true', async () => {
      const req = {
        userProfile: {
          name: 'fulano',
          profile: {
            name: 'admin',
          },
          company: [{ id: '1' }],
        },
      }
      const customerDto: CreateCustomerDto = {
        name: 'test customers',
        fantasy_name: 'fantasy customers',
        identification_number: '111111111',
        legal_person: true,
        email: 'test@email.com',
        company_id: '1',
      }

      const companies = [
        {
          id: '1',
          cin: '11111111',
          name: 'company test',
          fantasy: 'fantasy company test',
          email: 'comp@email.com',
          created_at: new Date(2022, 1, 1),
          updated_at: null,
        },
      ]

      jest
        .spyOn(service['prisma'].customers, 'create')
        .mockRejectedValue(new Error())
      jest
        .spyOn(service['prisma'].company, 'findMany')
        .mockResolvedValue(companies)

      await expect(service.create(customerDto, null, req)).rejects.toThrow(
        'Invalid identification number other than 11',
      )
      expect(service['prisma'].customers.create).toHaveBeenCalledTimes(0)
      expect(service['prisma'].company.findMany).toHaveBeenCalledTimes(0)
    })

    it('should return exception for identification number incorrect for legal person false', async () => {
      const req = {
        userProfile: {
          name: 'fulano',
          profile: {
            name: 'admin',
          },
          company: [{ id: '1' }],
        },
      }
      const customerDto: CreateCustomerDto = {
        name: 'test customers',
        fantasy_name: 'fantasy customers',
        identification_number: '11111111111111',
        legal_person: false,
        email: 'test@email.com',
        company_id: '1',
      }

      const companies = [
        {
          id: '1',
          cin: '11111111',
          name: 'company test',
          fantasy: 'fantasy company test',
          email: 'comp@email.com',
          created_at: new Date(2022, 1, 1),
          updated_at: null,
        },
      ]

      jest
        .spyOn(service['prisma'].customers, 'create')
        .mockRejectedValue(new Error())
      jest
        .spyOn(service['prisma'].company, 'findMany')
        .mockResolvedValue(companies)

      await expect(service.create(customerDto, null, req)).rejects.toThrow(
        'Invalid identification number',
      )
      expect(service['prisma'].customers.create).toHaveBeenCalledTimes(0)
      expect(service['prisma'].company.findMany).toHaveBeenCalledTimes(0)
    })
    it('should return exception for identification number incorrect (more than or less than) for legal person false', async () => {
      const req = {
        userProfile: {
          name: 'fulano',
          profile: {
            name: 'admin',
          },
          company: [{ id: '1' }],
        },
      }
      const customerDto: CreateCustomerDto = {
        name: 'test customers',
        fantasy_name: 'fantasy customers',
        identification_number: '111111111',
        legal_person: false,
        email: 'test@email.com',
        company_id: '1',
      }

      const companies = [
        {
          id: '1',
          cin: '11111111',
          name: 'company test',
          fantasy: 'fantasy company test',
          email: 'comp@email.com',
          created_at: new Date(2022, 1, 1),
          updated_at: null,
        },
      ]

      jest
        .spyOn(service['prisma'].customers, 'create')
        .mockRejectedValue(new Error())
      jest
        .spyOn(service['prisma'].company, 'findMany')
        .mockResolvedValue(companies)

      await expect(service.create(customerDto, null, req)).rejects.toThrow(
        'Invalid identification number other than 14',
      )
      expect(service['prisma'].customers.create).toHaveBeenCalledTimes(0)
      expect(service['prisma'].company.findMany).toHaveBeenCalledTimes(0)
    })
  })

  describe('update', () => {
    it('should return register edit without image', async () => {
      const req = {
        userProfile: {
          name: 'fulano',
          profile: {
            name: 'admin',
          },
          company: [{ id: '1' }],
        },
      }

      const customerDto: CreateCustomerDto = {
        name: 'test customers',
        fantasy_name: 'fantasy customers',
        identification_number: fakeCpf,
        legal_person: true,
        email: 'test@email.com',
        company_id: '1',
      }

      const companies = [
        {
          id: '1',
          cin: '11111111',
          name: 'company test',
          fantasy: 'fantasy company test',
          email: 'comp@email.com',
          created_at: new Date(2022, 1, 1),
          updated_at: null,
        },
      ]

      jest
        .spyOn(service['prisma'].customers, 'findUnique')
        .mockResolvedValue(fakeCustomers[0])
      jest
        .spyOn(service['prisma'].customers, 'update')
        .mockResolvedValue(fakeCustomers[0])
      jest
        .spyOn(service['prisma'].company, 'findMany')
        .mockResolvedValue(companies)

      const result = await service.update('1', customerDto, null, req)

      expect(result).toEqual(fakeCustomers[0])
      expect(service['prisma'].customers.update).toHaveBeenCalledTimes(1)
      expect(service['prisma'].company.findMany).toHaveBeenCalledTimes(1)
    })

    it('should return register edit with image', async () => {
      const req = {
        userProfile: {
          name: 'fulano',
          profile: {
            name: 'admin',
          },
          company: [{ id: '1' }],
        },
      }

      const customerDto: CreateCustomerDto = {
        name: 'test customers',
        fantasy_name: 'fantasy customers',
        identification_number: fakeCpf,
        legal_person: true,
        email: 'test@email.com',
        company_id: '1',
      }

      const image: Express.Multer.File = {
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
      }

      const companies = [
        {
          id: '1',
          cin: '11111111',
          name: 'company test',
          fantasy: 'fantasy company test',
          email: 'comp@email.com',
          created_at: new Date(2022, 1, 1),
          updated_at: null,
        },
      ]

      jest
        .spyOn(service['prisma'].customers, 'findUnique')
        .mockResolvedValue(fakeCustomers[0])

      jest
        .spyOn(service['prisma'].customers, 'update')
        .mockResolvedValue(fakeCustomers[0])
      jest
        .spyOn(service['prisma'].company, 'findMany')
        .mockResolvedValue(companies)
      jest
        .spyOn(service['uploadsService'], 'saveUserImage')
        .mockResolvedValue({ fileName: 'test', extension: 'tes.jpg' })

      const result = await service.update('1', customerDto, image, req)

      expect(result).toEqual(fakeCustomers[0])
      expect(service['prisma'].customers.update).toHaveBeenCalledTimes(1)
      expect(service['prisma'].company.findMany).toHaveBeenCalledTimes(1)
    })

    it('should return exception without image', async () => {
      const req = {
        userProfile: {
          name: 'fulano',
          profile: {
            name: 'admin',
          },
          company: [{ id: '1' }],
        },
      }

      const customerDto: CreateCustomerDto = {
        name: 'test customers',
        fantasy_name: 'fantasy customers',
        identification_number: fakeCpf,
        legal_person: true,
        email: 'test@email.com',
        company_id: '1',
      }

      const companies = [
        {
          id: '1',
          cin: '11111111',
          name: 'company test',
          fantasy: 'fantasy company test',
          email: 'comp@email.com',
          created_at: new Date(2022, 1, 1),
          updated_at: null,
        },
      ]

      jest
        .spyOn(service['prisma'].customers, 'findUnique')
        .mockResolvedValue(fakeCustomers[0])

      jest
        .spyOn(service['prisma'].customers, 'update')
        .mockRejectedValue(new Error())
      jest
        .spyOn(service['prisma'].company, 'findMany')
        .mockResolvedValue(companies)

      await expect(service.update('1', customerDto, null, req)).rejects.toThrow(
        'Error',
      )
      expect(service['prisma'].customers.update).toHaveBeenCalledTimes(1)
      expect(service['prisma'].company.findMany).toHaveBeenCalledTimes(1)
    })

    it('should return exception with image', async () => {
      const req = {
        userProfile: {
          name: 'fulano',
          profile: {
            name: 'admin',
          },
          company: [{ id: '1' }],
        },
      }

      const customerDto: CreateCustomerDto = {
        name: 'test customers',
        fantasy_name: 'fantasy customers',
        identification_number: fakeCpf,
        legal_person: true,
        email: 'test@email.com',
        company_id: '1',
      }

      const image: Express.Multer.File = {
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
      }

      const companies = [
        {
          id: '1',
          cin: '11111111',
          name: 'company test',
          fantasy: 'fantasy company test',
          email: 'comp@email.com',
          created_at: new Date(2022, 1, 1),
          updated_at: null,
        },
      ]
      jest
        .spyOn(service['prisma'].customers, 'findUnique')
        .mockResolvedValue(fakeCustomers[0])

      jest
        .spyOn(service['prisma'].customers, 'update')
        .mockRejectedValue(new Error())
      jest
        .spyOn(service['prisma'].company, 'findMany')
        .mockResolvedValue(companies)
      jest
        .spyOn(service['uploadsService'], 'saveUserImage')
        .mockResolvedValue({ fileName: 'test', extension: 'tes.jpg' })

      jest
        .spyOn(service['uploadsService'], 'deleteUserImage')
        .mockResolvedValue()

      await expect(
        service.update('1', customerDto, image, req),
      ).rejects.toThrow('Error')
      expect(service['prisma'].customers.update).toHaveBeenCalledTimes(1)
      expect(service['prisma'].company.findMany).toHaveBeenCalledTimes(1)
    })

    it('should return exception for identification number incorrect for legal person true', async () => {
      const req = {
        userProfile: {
          name: 'fulano',
          profile: {
            name: 'admin',
          },
          company: [{ id: '1' }],
        },
      }
      const customerDto: CreateCustomerDto = {
        name: 'test customers',
        fantasy_name: 'fantasy customers',
        identification_number: '11111111111',
        legal_person: true,
        email: 'test@email.com',
        company_id: '1',
      }

      const companies = [
        {
          id: '1',
          cin: '11111111',
          name: 'company test',
          fantasy: 'fantasy company test',
          email: 'comp@email.com',
          created_at: new Date(2022, 1, 1),
          updated_at: null,
        },
      ]

      jest
        .spyOn(service['prisma'].customers, 'findUnique')
        .mockResolvedValue(fakeCustomers[0])

      jest
        .spyOn(service['prisma'].customers, 'update')
        .mockRejectedValue(new Error())
      jest
        .spyOn(service['prisma'].company, 'findMany')
        .mockResolvedValue(companies)

      await expect(service.update('1', customerDto, null, req)).rejects.toThrow(
        'Invalid identification number',
      )
      expect(service['prisma'].customers.update).toHaveBeenCalledTimes(0)
      expect(service['prisma'].company.findMany).toHaveBeenCalledTimes(0)
    })
    it('should return exception for identification number incorrect (more than or less than) for legal person true', async () => {
      const req = {
        userProfile: {
          name: 'fulano',
          profile: {
            name: 'admin',
          },
          company: [{ id: '1' }],
        },
      }
      const customerDto: CreateCustomerDto = {
        name: 'test customers',
        fantasy_name: 'fantasy customers',
        identification_number: '111111111',
        legal_person: true,
        email: 'test@email.com',
        company_id: '1',
      }

      const companies = [
        {
          id: '1',
          cin: '11111111',
          name: 'company test',
          fantasy: 'fantasy company test',
          email: 'comp@email.com',
          created_at: new Date(2022, 1, 1),
          updated_at: null,
        },
      ]

      jest
        .spyOn(service['prisma'].customers, 'update')
        .mockRejectedValue(new Error())
      jest
        .spyOn(service['prisma'].company, 'findMany')
        .mockResolvedValue(companies)

      await expect(service.update('1', customerDto, null, req)).rejects.toThrow(
        'Invalid identification number other than 11',
      )
      expect(service['prisma'].customers.update).toHaveBeenCalledTimes(0)
      expect(service['prisma'].company.findMany).toHaveBeenCalledTimes(0)
    })

    it('should return exception for identification number incorrect for legal person false', async () => {
      const req = {
        userProfile: {
          name: 'fulano',
          profile: {
            name: 'admin',
          },
          company: [{ id: '1' }],
        },
      }
      const customerDto: CreateCustomerDto = {
        name: 'test customers',
        fantasy_name: 'fantasy customers',
        identification_number: '11111111111111',
        legal_person: false,
        email: 'test@email.com',
        company_id: '1',
      }

      const companies = [
        {
          id: '1',
          cin: '11111111',
          name: 'company test',
          fantasy: 'fantasy company test',
          email: 'comp@email.com',
          created_at: new Date(2022, 1, 1),
          updated_at: null,
        },
      ]

      jest
        .spyOn(service['prisma'].customers, 'update')
        .mockRejectedValue(new Error())
      jest
        .spyOn(service['prisma'].company, 'findMany')
        .mockResolvedValue(companies)

      await expect(service.update('1', customerDto, null, req)).rejects.toThrow(
        'Invalid identification number',
      )
      expect(service['prisma'].customers.update).toHaveBeenCalledTimes(0)
      expect(service['prisma'].company.findMany).toHaveBeenCalledTimes(0)
    })
    it('should return exception for identification number incorrect (more than or less than) for legal person false', async () => {
      const req = {
        userProfile: {
          name: 'fulano',
          profile: {
            name: 'admin',
          },
          company: [{ id: '1' }],
        },
      }
      const customerDto: CreateCustomerDto = {
        name: 'test customers',
        fantasy_name: 'fantasy customers',
        identification_number: '111111111',
        legal_person: false,
        email: 'test@email.com',
        company_id: '1',
      }

      const companies = [
        {
          id: '1',
          cin: '11111111',
          name: 'company test',
          fantasy: 'fantasy company test',
          email: 'comp@email.com',
          created_at: new Date(2022, 1, 1),
          updated_at: null,
        },
      ]

      jest
        .spyOn(service['prisma'].customers, 'create')
        .mockRejectedValue(new Error())
      jest
        .spyOn(service['prisma'].company, 'findMany')
        .mockResolvedValue(companies)

      await expect(service.create(customerDto, null, req)).rejects.toThrow(
        'Invalid identification number other than 14',
      )
      expect(service['prisma'].customers.create).toHaveBeenCalledTimes(0)
      expect(service['prisma'].company.findMany).toHaveBeenCalledTimes(0)
    })
  })

  describe('remove', () => {
    it('should delete register with success', async () => {
      const req = {
        userProfile: {
          name: 'fulano',
          profile: {
            name: 'admin',
          },
          company: [{ id: '1' }],
        },
      }

      jest
        .spyOn(service['prisma'].customers, 'delete')
        .mockResolvedValue(fakeCustomers[0])
      const result = await service.remove('1', req)

      expect(result).toEqual(fakeCustomers[0])
    })

    it('should return exception if user dont have company', async () => {
      const req = {
        userProfile: {
          name: 'fulano',
          profile: {
            name: 'admin',
          },
          company: [],
        },
      }

      jest
        .spyOn(service['prisma'].customers, 'delete')
        .mockRejectedValue(new Error())
      await expect(service.remove('1', req)).rejects.toThrow('Error')
    })
  })
})
