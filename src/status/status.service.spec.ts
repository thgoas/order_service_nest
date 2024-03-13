import { Test, TestingModule } from '@nestjs/testing'
import { StatusService } from './status.service'
import { PrismaService } from '../common/prisma/prisma.service'
import { BadGatewayException } from '@nestjs/common'

const fakeStatus = [
  {
    id: '1',
    name: 'teste status 1',
    description: 'teste status 1',
    created_at: new Date(2024, 1, 1),
    updated_at: null,
  },
  {
    id: '2',
    name: 'teste status 2',
    description: 'teste status 2',
    created_at: new Date(2024, 1, 1),
    updated_at: null,
  },
]
describe('StatusService', () => {
  let service: StatusService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatusService, PrismaService],
    }).compile()

    service = module.get<StatusService>(StatusService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('find all', () => {
    it('should return all status', async () => {
      jest
        .spyOn(service['prisma'].status, 'findMany')
        .mockResolvedValue(fakeStatus)
      const result = await service.findAll()

      expect(result).toEqual(fakeStatus)
      expect(service['prisma'].status.findMany).toHaveBeenCalledTimes(1)
      expect(service['prisma'].status.findMany).toHaveBeenCalledWith()
    })

    it('should return exception', async () => {
      jest
        .spyOn(service['prisma'].status, 'findMany')
        .mockRejectedValue(new Error())

      await expect(service.findAll()).rejects.toThrow('Error')
      expect(service['prisma'].status.findMany).toHaveBeenCalledTimes(1)
      expect(service['prisma'].status.findMany).toHaveBeenCalledWith()
    })

    it('should return exception BadGatewayException', async () => {
      jest
        .spyOn(service['prisma'].status, 'findMany')
        .mockRejectedValue(new BadGatewayException())

      await expect(service.findAll()).rejects.toThrow(
        'BadGatewayException: Bad Gateway',
      )
      expect(service['prisma'].status.findMany).toHaveBeenCalledTimes(1)
      expect(service['prisma'].status.findMany).toHaveBeenCalledWith()
    })
  })

  describe('find one', () => {
    it('should return all status', async () => {
      jest
        .spyOn(service['prisma'].status, 'findUnique')
        .mockResolvedValue(fakeStatus[0])
      const result = await service.findOne('1')

      expect(result).toEqual(fakeStatus[0])
      expect(service['prisma'].status.findUnique).toHaveBeenCalledTimes(1)
      expect(service['prisma'].status.findUnique).toHaveBeenCalledWith({
        where: {
          id: '1',
        },
      })
    })

    it('should return exception', async () => {
      jest
        .spyOn(service['prisma'].status, 'findUnique')
        .mockRejectedValue(new Error())

      await expect(service.findOne('1')).rejects.toThrow('Error')
      expect(service['prisma'].status.findUnique).toHaveBeenCalledTimes(1)
      expect(service['prisma'].status.findUnique).toHaveBeenCalledWith({
        where: {
          id: '1',
        },
      })
    })

    it('should return exception BadGatewayException', async () => {
      jest
        .spyOn(service['prisma'].status, 'findUnique')
        .mockRejectedValue(new BadGatewayException())

      await expect(service.findOne('1')).rejects.toThrow(
        'BadGatewayException: Bad Gateway',
      )
      expect(service['prisma'].status.findUnique).toHaveBeenCalledTimes(1)
      expect(service['prisma'].status.findUnique).toHaveBeenCalledWith({
        where: {
          id: '1',
        },
      })
    })
  })
})
