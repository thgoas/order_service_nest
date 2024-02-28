import { Test, TestingModule } from '@nestjs/testing'
import { ProfilesController } from './profiles.controller'
import { ProfilesService } from './profiles.service'
import { CommonModule } from '../common/common.module'
import { fakeProfiles } from './mock_data/fakeProfiles'
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

describe('ProfilesController', () => {
  let controller: ProfilesController
  let profilesServiceMock: ProfilesService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CommonModule],
      controllers: [ProfilesController],
      providers: [ProfilesService, JwtService],
    }).compile()

    controller = module.get<ProfilesController>(ProfilesController)
    profilesServiceMock = module.get<ProfilesService>(ProfilesService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('findAll', () => {
    it('should retunr an array of profiles', async () => {
      jest
        .spyOn(profilesServiceMock, 'findAll')
        .mockResolvedValueOnce(fakeProfiles)
      const response = await controller.findAll()
      expect(profilesServiceMock.findAll).toHaveBeenCalledTimes(1)
      expect(response).toEqual(fakeProfiles)
    })
  })
  describe('create', () => {
    it('should create a profile successfully', async () => {
      const createProfileDto = {
        name: 'Test Name',
        description: 'Test Description',
      }

      const createdProfile = {
        id: '1',
        name: 'Test Name',
        description: 'Test Description',
        created_at: new Date(),
        updated_at: new Date(),
      }

      jest
        .spyOn(profilesServiceMock, 'create')
        .mockResolvedValueOnce(createdProfile)

      const result = await controller.create(createProfileDto)

      expect(profilesServiceMock.create).toHaveBeenCalledTimes(1)
      expect(profilesServiceMock.create).toHaveBeenCalledWith(createProfileDto)

      expect(result).toEqual(createdProfile)
    })

    it('should handle HttpException for empty name', async () => {
      const createProfileDto = {
        name: '',
        description: 'Test Description',
      }

      jest
        .spyOn(profilesServiceMock, 'create')
        .mockRejectedValueOnce(
          new HttpException('cannot be empty!', HttpStatus.FORBIDDEN),
        )

      await expect(controller.create(createProfileDto)).rejects.toThrowError(
        new HttpException('cannot be empty!', HttpStatus.FORBIDDEN),
      )

      expect(profilesServiceMock.create).toHaveBeenCalledWith(createProfileDto)
    })

    it('should handle HttpException for empty description', async () => {
      const createProfileDto = {
        name: 'Test Name',
        description: '',
      }

      jest
        .spyOn(profilesServiceMock, 'create')
        .mockRejectedValueOnce(
          new HttpException('cannot be empty!', HttpStatus.FORBIDDEN),
        )

      await expect(controller.create(createProfileDto)).rejects.toThrow(
        new HttpException('cannot be empty!', HttpStatus.FORBIDDEN),
      )

      expect(profilesServiceMock.create).toHaveBeenCalledWith(createProfileDto)
    })
    it('should handle HttpException for duplicate name', async () => {
      const createProfileDto = {
        name: 'Duplicate Name',
        description: 'Test Description',
      }

      jest
        .spyOn(profilesServiceMock, 'create')
        .mockRejectedValueOnce(
          new HttpException(
            'name Duplicate Name already exists in the database!',
            HttpStatus.UNAUTHORIZED,
          ),
        )

      await expect(controller.create(createProfileDto)).rejects.toThrow(
        new HttpException(
          'name Duplicate Name already exists in the database!',
          HttpStatus.UNAUTHORIZED,
        ),
      )

      expect(profilesServiceMock.create).toHaveBeenCalledWith(createProfileDto)
    })
  })
  describe('delete', () => {
    it('should return a deleted profile on success ', async () => {
      jest
        .spyOn(profilesServiceMock, 'remove')
        .mockResolvedValue(fakeProfiles[0])

      const result = await controller.remove('1')

      expect(result).toEqual(fakeProfiles[0])
      expect(profilesServiceMock.remove).toHaveBeenCalledTimes(1)
      expect(profilesServiceMock.remove).toHaveBeenCalledWith('1')
    })

    it('should return NotFoundException case the does not exist ', () => {
      jest
        .spyOn(profilesServiceMock, 'remove')
        .mockRejectedValue(new NotFoundException())

      expect(controller.remove('id not exist')).rejects.toThrow(
        new NotFoundException(),
      )
      expect(profilesServiceMock.remove).toHaveBeenCalledTimes(1)
      expect(profilesServiceMock.remove).toHaveBeenCalledWith('id not exist')
    })
  })
})
