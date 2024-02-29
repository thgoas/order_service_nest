import { Test, TestingModule } from '@nestjs/testing'
import { CompaniesService } from './companies.service'
import { PrismaService } from '../common/prisma/prisma.service'
import { CreateCompanyDto } from './dto/create-company.dto'
import { HttpException, HttpStatus } from '@nestjs/common'
import { UpdateCompanyDto } from './dto/update-company.dto'

const fakeCompanies = [
  {
    id: '1',
    cin: '111',
    fantasy: 'Fake Company 1',
    name: 'Fake Company',
    created_at: new Date(2022, 1, 1),
    updated_at: null,
  },
  {
    id: '2',
    cin: '222',
    fantasy: 'Fake Company 2',
    name: 'Fake Company',
    created_at: new Date(2022, 1, 1),
    updated_at: null,
  },
  {
    id: '3',
    cin: '333',
    fantasy: 'Fake Company 3',
    name: 'Fake Company',
    created_at: new Date(2022, 1, 1),
    updated_at: null,
  },
]

describe('CompaniesService', () => {
  let service: CompaniesService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompaniesService, PrismaService],
    }).compile()

    service = module.get<CompaniesService>(CompaniesService)
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('findAll companies', () => {
    it('should return all companies', async () => {
      jest
        .spyOn(service['prisma'].company, 'findMany')
        .mockResolvedValueOnce(fakeCompanies)
      const result = await service.findAll()

      expect(result).toEqual(fakeCompanies)

      expect(service['prisma'].company.findMany).toHaveBeenCalledTimes(1)
      expect(service['prisma'].company.findMany).toHaveBeenCalledWith({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })
    })
  })

  describe('findOne companies', () => {
    it('should return a company with id 1', async () => {
      jest
        .spyOn(service['prisma'].company, 'findUnique')
        .mockResolvedValueOnce(fakeCompanies[0])
      const result = await service.findOne('1')

      expect(result).toEqual(fakeCompanies[0])
      expect(service['prisma'].company.findUnique).toHaveBeenCalledTimes(1)
      expect(service['prisma'].company.findUnique).toHaveBeenCalledWith({
        where: {
          id: '1',
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })
    })
    it('should return a Exception where invalid id', async () => {
      jest
        .spyOn(service['prisma'].company, 'findUnique')
        .mockReturnValue(undefined)

      const result = await service.findOne('99')
      expect(result).toEqual(undefined)
      expect(service['prisma'].company.findUnique).toHaveBeenCalledTimes(1)
      expect(service['prisma'].company.findUnique).toHaveBeenCalledWith({
        where: {
          id: '99',
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })
    })
  })
  describe('create company', () => {
    it('should create a new company', async () => {
      const companyCreateDto: CreateCompanyDto = {
        cin: '111',
        fantasy: 'Fake Company 1',
        name: 'Fake Company',
      }

      jest
        .spyOn(service['prisma'].company, 'create')
        .mockResolvedValue(fakeCompanies[0])
      const result = await service.create(companyCreateDto)

      expect(result).toEqual(fakeCompanies[0])
      expect(service['prisma'].company.create).toHaveBeenCalledTimes(1)
      expect(service['prisma'].company.create).toHaveBeenCalledWith({
        data: companyCreateDto,
      })
    })
    it('should return exception a new company with name duplicated', async () => {
      const companyCreateDto: CreateCompanyDto = {
        cin: '111',
        fantasy: 'Fake Company 1',
        name: 'Fake Company',
      }

      jest
        .spyOn(service['prisma'].company, 'create')
        .mockRejectedValue(
          new HttpException('CIN already exists', HttpStatus.BAD_GATEWAY),
        )
      await expect(service.create(companyCreateDto)).rejects.toThrow(
        'HttpException: CIN already exists',
      )

      expect(service['prisma'].company.create).toHaveBeenCalledTimes(1)
      expect(service['prisma'].company.create).toHaveBeenCalledWith({
        data: companyCreateDto,
      })
    })
  })
  describe('remove company', () => {
    it('should remove company', async () => {
      jest
        .spyOn(service['prisma'].company, 'delete')
        .mockResolvedValue(fakeCompanies[0])

      const result = await service.remove('1')

      expect(result).toEqual(fakeCompanies[0])
      expect(service['prisma'].company.delete).toHaveBeenCalledTimes(1)
      expect(service['prisma'].company.delete).toHaveBeenCalledWith({
        where: { id: '1' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })
    })
    it('should return exception when remove with invalid id', async () => {
      jest
        .spyOn(service['prisma'].company, 'delete')
        .mockRejectedValue(new Error())

      await expect(service.remove('99')).rejects.toThrow('Error')
      expect(service['prisma'].company.delete).toHaveBeenCalledTimes(1)
      expect(service['prisma'].company.delete).toHaveBeenCalledWith({
        where: { id: '99' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })
    })
  })
  describe('update company', () => {
    it('should return the changed company ', async () => {
      const updateCompanyDto: UpdateCompanyDto = {
        cin: 'changed',
        name: 'changed',
        fantasy: 'changed',
      }
      const changedCompany: any = {
        id: '1',
        cin: 'changed',
        name: 'changed',
        fantasy: 'changed',
        updated_at: expect.any(Date),
        created_at: new Date(2022, 1, 1),
        user: [],
      }
      jest
        .spyOn(service['prisma'].company, 'update')
        .mockReturnValueOnce(changedCompany)

      const result = await service.update('1', updateCompanyDto)
      expect(result).toEqual(changedCompany)
      expect(service['prisma'].company.update).toHaveBeenCalledTimes(1)
      expect(service['prisma'].company.update).toHaveBeenCalledWith({
        where: {
          id: '1',
        },
        data: {
          ...updateCompanyDto,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })
    })

    it('should return a exception with invalid id ', async () => {
      const updateCompanyDto: UpdateCompanyDto = {
        cin: 'changed',
        name: 'changed',
        fantasy: 'changed',
      }
      jest
        .spyOn(service['prisma'].company, 'update')
        .mockRejectedValue(new Error())

      await expect(service.update('99', updateCompanyDto)).rejects.toThrow(
        'Error',
      )

      expect(service['prisma'].company.update).toHaveBeenCalledTimes(1)
      expect(service['prisma'].company.update).toHaveBeenCalledWith({
        where: {
          id: '99',
        },
        data: {
          ...updateCompanyDto,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })
    })
  })
})
