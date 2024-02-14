import { Test, TestingModule } from '@nestjs/testing'
import { ProfilesService } from './profiles.service'
import { CommonModule } from '../common/common.module'
import { PrismaService } from '../common/prisma/prisma.service'
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common'
import { fakeProfiles } from './mock_data/fakeProfiles'

describe('ProfilesService', () => {
  let service: ProfilesService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CommonModule],
      providers: [ProfilesService, PrismaService],
    }).compile()

    service = module.get<ProfilesService>(ProfilesService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('findAll', () => {
    it('should return an array of profiles', async () => {
      jest
        .spyOn(service['prisma'].profile, 'findMany')
        .mockResolvedValueOnce(fakeProfiles)
      const response = await service.findAll()
      expect(service['prisma'].profile.findMany).toHaveBeenCalledTimes(1)
      expect(service['prisma'].profile.findMany).toHaveBeenCalledWith()
      expect(response).toEqual(fakeProfiles)
    })
  })
  describe('findOne', () => {
    it('should return a single profile', async () => {
      jest
        .spyOn(service['prisma'].profile, 'findUnique')
        .mockResolvedValueOnce(fakeProfiles[0])
      const response = await service.findOne('1')
      expect(response).toEqual(fakeProfiles[0])
      expect(service['prisma'].profile.findUnique).toHaveBeenCalledTimes(1)
      expect(service['prisma'].profile.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      })
    })
    it('should return nothing when profile is not found', async () => {
      jest
        .spyOn(service['prisma'].profile, 'findUnique')
        .mockReturnValue(undefined)
      const response = await service.findOne('99')
      expect(response).toBeUndefined
    })
  })
  describe('create', () => {
    it('should create a new profile', async () => {
      jest
        .spyOn(service['prisma'].profile, 'create')
        .mockResolvedValue(fakeProfiles[0])
      const response = await service.create(fakeProfiles[0])
      expect(response).toEqual(fakeProfiles[0])
      expect(service['prisma'].profile.create).toHaveBeenCalledTimes(1)
      expect(service['prisma'].profile.create).toHaveBeenCalledWith({
        data: fakeProfiles[0],
      })
    })
    it('should handle HttpException for empty name', async () => {
      const createProfileDto = {
        name: '',
        description: 'Test Description',
      }

      jest
        .spyOn(service['prisma'].profile, 'create')
        .mockRejectedValueOnce(
          new HttpException('cannot be empty!', HttpStatus.FORBIDDEN),
        )

      await expect(service.create(createProfileDto)).rejects.toThrow(
        new HttpException('cannot be empty!', HttpStatus.FORBIDDEN),
      )

      expect(service['prisma'].profile.create).not.toHaveBeenCalledWith()
    })

    it('should handle HttpException for empty description', async () => {
      const createProfileDto = {
        name: 'Test Name',
        description: '',
      }

      jest
        .spyOn(service['prisma'].profile, 'create')
        .mockRejectedValueOnce(
          new HttpException('cannot be empty!', HttpStatus.FORBIDDEN),
        )

      await expect(service.create(createProfileDto)).rejects.toThrow(
        new HttpException('cannot be empty!', HttpStatus.FORBIDDEN),
      )

      expect(service['prisma'].profile.create).not.toHaveBeenCalled()
    })
    it('should handle HttpException for duplicate name', async () => {
      const createProfileDto = {
        name: 'Duplicate Name',
        description: 'Test Description',
      }
      const duplicateError = new Error('Duplicate name error')

      jest
        .spyOn(service['prisma'].profile, 'create')
        .mockRejectedValue('Duplicate name error')
      try {
        await service.create(createProfileDto)
      } catch (error) {
        expect(error).toEqual(duplicateError)
      }

      expect(service['prisma'].profile.create).toHaveBeenCalledWith({
        data: { ...createProfileDto },
      })
    })
  })
  describe('updateOne', () => {
    it('should update a profile', async () => {
      jest
        .spyOn(service['prisma'].profile, 'update')
        .mockResolvedValue(fakeProfiles[0])
      const response = await service.update('1', fakeProfiles[0])
      expect(response).toEqual(fakeProfiles[0])
      expect(service['prisma'].profile.update).toHaveBeenCalledTimes(1)
      expect(service['prisma'].profile.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          ...fakeProfiles[0],
          updated_at: expect.any(Date),
        },
      })
    })
    it('should return NotFoundException when no profile is found', async () => {
      const unexistingProfile = {
        id: '39',
        name: 'Sales',
        description: 'Sales',
        created_at: new Date(2024, 1, 1),
        updated_at: new Date(2024, 1, 1),
      }

      jest
        .spyOn(service['prisma'].profile, 'update')
        .mockRejectedValue(new Error())

      try {
        await service.update('39', unexistingProfile)
      } catch (error) {
        expect(error).toEqual(new NotFoundException(error))
      }

      expect(service['prisma'].profile.update).toHaveBeenCalledWith({
        where: { id: '39' },
        data: { ...unexistingProfile, updated_at: expect.any(Date) },
      })
    })
  })

  describe('deleteOne', () => {
    it('should delete profile and return body', async () => {
      jest
        .spyOn(service['prisma'].profile, 'delete')
        .mockResolvedValue(fakeProfiles[0])

      expect(await service.remove('1')).toEqual(fakeProfiles[0])
      expect(service['prisma'].profile.delete).toHaveBeenCalledTimes(1)
      expect(service['prisma'].profile.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      })
    })
    it('should return NotFoundException if profile not exist', async () => {
      jest
        .spyOn(service['prisma'].profile, 'delete')
        .mockRejectedValue(new Error())

      try {
        await service.remove('39')
      } catch (error) {
        expect(error).toEqual(new NotFoundException(error))
      }
    })
  })
})
