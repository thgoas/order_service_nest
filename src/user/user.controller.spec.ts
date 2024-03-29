import { Test, TestingModule } from '@nestjs/testing'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { CommonModule } from '../common/common.module'
import { PrismaService } from '../common/prisma/prisma.service'
import { MailingService } from '../email/mailing.service'
import { RolesGuard } from '../roles.guards'
import { JwtService } from '@nestjs/jwt'
import { ProfilesService } from '../profiles/profiles.service'
import { UpdateUserDto } from './dto/update-user.dto'
import { ForbiddenException } from '@nestjs/common'
import { fakeUsers } from './dataMock/fakeUsers'
import { BullModule, getQueueToken } from '@nestjs/bull'
import { UploadsService } from '../uploads/uploads.service'

const profile = {
  id: '1',
  name: 'profile',
  description: 'profile',
  updated_at: new Date('2022-01-01'),
  created_at: new Date('2022-01-01'),
}

const mockImages: Express.Multer.File = {
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

describe('UserController', () => {
  let controller: UserController
  let userService: UserService
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CommonModule, BullModule.registerQueue({ name: 'email' })],
      controllers: [UserController],
      providers: [
        UserService,
        PrismaService,
        MailingService,
        RolesGuard,
        JwtService,
        ProfilesService,
        UploadsService,
      ],
    })
      .overrideProvider(getQueueToken('email'))
      .useValue({})
      .compile()

    controller = module.get<UserController>(UserController)
    userService = module.get<UserService>(UserService)
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('Update user', () => {
    it('Should ForbidException for user not admin or master', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'user edit',
      }
      const req = {
        userProfile: {
          id: '2',
          profile: {
            name: 'common',
          },
        },
        File: mockImages,
      }

      try {
        await controller.update('1', updateUserDto, req, mockImages)
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException)
        expect(error.message).toBe(
          'You are not authorized to access this feature',
        )
      }
    })
    it('should be able to edit your own username in common profile', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'user edit',
      }
      const req = {
        userProfile: {
          id: '2',
          profile: {
            name: 'common',
          },
        },
      }
      jest.spyOn(userService, 'update').mockResolvedValueOnce({
        ...fakeUsers[0],
        company: [],
        profile,
      })

      const result = await controller.update(
        '2',
        updateUserDto,
        req,
        mockImages,
      )

      expect(result).toEqual({
        ...fakeUsers[0],
        company: [],
        profile,
      })
    })
    it('must be able to edit all users with master profile', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'user edit',
      }
      const req = {
        userProfile: {
          id: '1',
          profile: {
            name: 'master',
          },
        },
      }
      jest
        .spyOn(userService, 'update')
        .mockResolvedValueOnce({ ...fakeUsers[0], profile, company: [] })

      const result = await controller.update(
        '2',
        updateUserDto,
        req,
        mockImages,
      )

      expect(result).toEqual({
        ...fakeUsers[0],
        company: [],
        profile,
      })
    })
    it('must be able to edit all users with admin profile', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'user edit',
      }
      const req = {
        userProfile: {
          id: '1',
          profile: {
            name: 'admin',
          },
        },
      }
      jest
        .spyOn(userService, 'update')
        .mockResolvedValueOnce({ ...fakeUsers[0], profile, company: [] })

      const result = await controller.update(
        '2',
        updateUserDto,
        req,
        mockImages,
      )

      expect(result).toEqual({
        ...fakeUsers[0],
        company: [],
        profile,
      })
    })
  })
})
