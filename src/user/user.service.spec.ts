import { Test, TestingModule } from '@nestjs/testing'
import { UserService } from './user.service'
import { PrismaService } from '../common/prisma/prisma.service'
import { fakeUsers } from './dataMock/fakeUsers'
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { PasswordHasher } from '../utils/password-hasher'
import { MailingService } from '../email/mailing.service'
import { UpdateUserDto } from './dto/update-user.dto'
import { userProfile } from './entities/user_profile.entity'
import { BullModule, getQueueToken } from '@nestjs/bull'

describe('UserService', () => {
  let service: UserService
  let mailingService: MailingService
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [BullModule.registerQueue({ name: 'email' })],
      providers: [UserService, PrismaService, MailingService],
    })
      .overrideProvider(getQueueToken('email'))
      .useValue({})
      .compile()

    service = module.get<UserService>(UserService)
    mailingService = module.get<MailingService>(MailingService)
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('user findAll', () => {
    it('should return all users for user request admin', async () => {
      const userRequest: userProfile = {
        id: '1',
        name: 'user 1',
        email: 'user1@email.com',
        profile: {
          id: '1',
          name: 'admin',
          description: 'Administrator',
        },
        company: [
          { id: '1', cin: '11111', fantasy: 'company test', name: 'company' },
        ],
      }
      jest
        .spyOn(service['prisma'].user, 'findMany')
        .mockResolvedValue(fakeUsers)
      const result = await service.findAll(userRequest)
      expect(service['prisma'].user.findMany).toHaveBeenCalledTimes(1)

      expect(service['prisma'].user.findMany).toHaveBeenCalledWith({
        where: {
          company: {
            some: {
              id: {
                in: [],
              },
            },
          },
        },
        include: {
          company: true,
          profile: true,
        },
      })

      expect(result).toEqual(fakeUsers)
    })

    it('should return all users for user request master', async () => {
      const userRequest: userProfile = {
        id: '1',
        name: 'user 1',
        email: 'user1@email.com',
        profile: {
          id: '1',
          name: 'master',
          description: 'Master',
        },
        company: [
          { id: '1', cin: '11111', fantasy: 'company test', name: 'company' },
        ],
      }
      jest
        .spyOn(service['prisma'].user, 'findMany')
        .mockResolvedValue(fakeUsers)
      const result = await service.findAll(userRequest)
      expect(service['prisma'].user.findMany).toHaveBeenCalledTimes(1)

      expect(service['prisma'].user.findMany).toHaveBeenCalledWith({
        include: {
          company: true,
          profile: true,
        },
      })

      expect(result).toEqual(fakeUsers)
    })
  })
  describe('user findOne', () => {
    it('should return a single user for admin', async () => {
      const userRequest: userProfile = {
        id: '1',
        name: 'user 1',
        email: 'user1@email.com',
        profile: {
          id: '1',
          name: 'admin',
          description: 'Administrator',
        },
        company: [
          { id: '1', cin: '11111', fantasy: 'company test', name: 'company' },
        ],
      }
      jest
        .spyOn(service['prisma'].user, 'findUnique')
        .mockResolvedValue(fakeUsers[0])
      const result = await service.findOne('1', userRequest)

      expect(service['prisma'].user.findUnique).toHaveBeenCalledTimes(1)
      expect(service['prisma'].user.findUnique).toHaveBeenCalledWith({
        where: {
          id: '1',
          company: {
            some: {
              id: {
                in: [],
              },
            },
          },
        },
        include: {
          company: true,
          profile: true,
        },
      })
      expect(result).toEqual(fakeUsers[0])
    })
    it('should return a single user for master', async () => {
      const userRequest: userProfile = {
        id: '1',
        name: 'user 1',
        email: 'user1@email.com',
        profile: {
          id: '1',
          name: 'master',
          description: 'Master',
        },
        company: [
          { id: '1', cin: '11111', fantasy: 'company test', name: 'company' },
        ],
      }
      jest
        .spyOn(service['prisma'].user, 'findUnique')
        .mockResolvedValue(fakeUsers[0])
      const result = await service.findOne('1', userRequest)

      expect(service['prisma'].user.findUnique).toHaveBeenCalledTimes(1)
      expect(service['prisma'].user.findUnique).toHaveBeenCalledWith({
        where: {
          id: '1',
        },
        include: {
          company: true,
          profile: true,
        },
      })
      expect(result).toEqual(fakeUsers[0])
    })
  })
  describe('user create', () => {
    it('should create a new user and return for user request admin', async () => {
      const createUserDto: CreateUserDto = {
        name: 'user 1',
        email: 'user1@email.com',
        password: '123456',
        passwordConfirmation: '123456',
        profile_id: '2',
        companies_ids: ['1', '2'],
      }

      const userRequest: userProfile = {
        id: '2',
        name: 'user 2',
        email: 'user2@email.com',
        profile: {
          id: '1',
          name: 'admin',
          description: 'Administrator',
        },
        company: [
          { id: '1', cin: '11111', fantasy: 'company test', name: 'company' },
          { id: '2', cin: '11111', fantasy: 'company test', name: 'company' },
        ],
      }

      const companies: any[] = [
        {
          id: '1',
          cin: '11111',
          fantasy: 'company test',
          name: 'company',
          created_at: new Date('2022-01-01'),
          updated_at: null,
        },
        {
          id: '2',
          cin: '11111',
          fantasy: 'company test',
          name: 'company',
          created_at: new Date('2022-01-01'),
          updated_at: null,
        },
      ]

      const returnUser = {
        id: '1',
        name: 'user 1',
        email: 'user1@email.com',
        profile_id: '2',
        created_at: expect.any(Date),
        password: 'hashedpassword',
        status: true,
        updated_at: null,
      }

      jest.spyOn(mailingService, 'sendUserWelcome').mockResolvedValue()

      jest
        .spyOn(service['prisma'].company, 'findMany')
        .mockResolvedValueOnce(companies)
      jest.spyOn(service['prisma'].user, 'create').mockResolvedValue(returnUser)

      jest
        .spyOn(PasswordHasher, 'hashPassword')
        .mockResolvedValue('hashedpassword')

      const result = await service.create(createUserDto, userRequest)
      expect(result).toEqual(returnUser)
      expect(service['prisma'].user.create).toHaveBeenCalledTimes(1)
      expect(service['prisma'].user.create).toHaveBeenCalledWith({
        data: {
          ...createUserDto,
          password: 'hashedpassword',
          company: { connect: [{ id: '1' }, { id: '2' }] },
        },
        include: {
          company: true,
          profile: true,
        },
      })
    })
    it('should return an exception when creating a new user with the admin profile without being from the same company', async () => {
      const createUserDto: CreateUserDto = {
        name: 'user 1',
        email: 'user1@email.com',
        password: '123456',
        passwordConfirmation: '123456',
        profile_id: '2',
        companies_ids: ['1', '2', '3'],
      }

      const userRequest: userProfile = {
        id: '2',
        name: 'user 2',
        email: 'user2@email.com',
        profile: {
          id: '1',
          name: 'admin',
          description: 'Administrator',
        },
        company: [
          { id: '1', cin: '11111', fantasy: 'company test', name: 'company' },
          { id: '2', cin: '11111', fantasy: 'company test', name: 'company' },
        ],
      }

      const companies: any[] = [
        {
          id: '1',
          cin: '11111',
          fantasy: 'company test',
          name: 'company',
          created_at: new Date('2022-01-01'),
          updated_at: null,
        },
        {
          id: '2',
          cin: '11111',
          fantasy: 'company test',
          name: 'company',
          created_at: new Date('2022-01-01'),
          updated_at: null,
        },
      ]

      const returnUser = {
        id: '1',
        name: 'user 1',
        email: 'user1@email.com',
        profile_id: '2',
        created_at: expect.any(Date),
        password: 'hashedpassword',
        status: true,
        updated_at: null,
      }
      jest.spyOn(mailingService, 'sendUserWelcome').mockResolvedValue()
      jest
        .spyOn(service['prisma'].company, 'findMany')
        .mockResolvedValueOnce(companies)
      jest.spyOn(service['prisma'].user, 'create').mockResolvedValue(returnUser)

      jest
        .spyOn(PasswordHasher, 'hashPassword')
        .mockResolvedValue('hashedpassword')
      expect(service.create(createUserDto, userRequest)).rejects.toThrow(
        new Error('You are not authorized to access this feature'),
      )
      expect(service['prisma'].user.create).toHaveBeenCalledTimes(0)
    })

    it('should create a new user and return for user request Master', async () => {
      const createUserDto: CreateUserDto = {
        name: 'user 1',
        email: 'user1@email.com',
        password: '123456',
        passwordConfirmation: '123456',
        profile_id: '2',
        companies_ids: ['1', '2'],
      }

      const userRequest: userProfile = {
        id: '2',
        name: 'user 2',
        email: 'user2@email.com',
        profile: {
          id: '1',
          name: 'master',
          description: 'Master',
        },
        company: [],
      }

      const returnUser = {
        id: '1',
        name: 'user 1',
        email: 'user1@email.com',
        profile_id: '2',
        created_at: expect.any(Date),
        password: 'hashedpassword',
        status: true,
        updated_at: null,
      }

      jest.spyOn(mailingService, 'sendUserWelcome').mockResolvedValue()

      jest.spyOn(service['prisma'].user, 'create').mockResolvedValue(returnUser)

      jest
        .spyOn(PasswordHasher, 'hashPassword')
        .mockResolvedValue('hashedpassword')

      const result = await service.create(createUserDto, userRequest)
      expect(result).toEqual(returnUser)
      expect(service['prisma'].user.create).toHaveBeenCalledTimes(1)
      expect(service['prisma'].user.create).toHaveBeenCalledWith({
        data: {
          ...createUserDto,
          password: 'hashedpassword',
          company: { connect: [{ id: '1' }, { id: '2' }] },
        },
        include: {
          company: true,
          profile: true,
        },
      })
    })
    it('should handle HttpException for password confirmation different from password', async () => {
      const createUserDto: CreateUserDto = {
        name: 'user 1',
        email: 'user 1@email.com',
        password: '1234567',
        passwordConfirmation: '123456',
        profile_id: '1',
        companies_ids: ['1'],
      }

      const userProfile: userProfile = {
        id: '2',
        name: 'user 2',
        email: 'user2@email.com',
        profile: {
          id: '1',
          name: 'admin',
          description: 'Administrator',
        },
        company: [
          { id: '1', cin: '11111', fantasy: 'company test', name: 'company' },
        ],
      }

      const companies: any[] = [
        {
          id: '1',
          cin: '11111',
          fantasy: 'company test',
          name: 'company',
          created_at: new Date('2022-01-01'),
          updated_at: null,
        },
        {
          id: '2',
          cin: '11111',
          fantasy: 'company test',
          name: 'company',
          created_at: new Date('2022-01-01'),
          updated_at: null,
        },
      ]

      jest
        .spyOn(service['prisma'].company, 'findMany')
        .mockResolvedValue(companies)
      jest
        .spyOn(service['prisma'].user, 'create')
        .mockRejectedValueOnce(new Error())
      await expect(service.create(createUserDto, userProfile)).rejects.toThrow(
        new BadRequestException(
          'passwords and password confirmation do not match',
        ),
      )
      expect(service['prisma'].user.create).toHaveBeenCalledTimes(0)
      expect(service['prisma'].user.create).not.toHaveBeenCalledWith()
    })

    it('should handle HttpException for invalid profile_id', async () => {
      const createUserDto: CreateUserDto = {
        name: 'user1',
        email: 'user1@email.com',
        password: '123456',
        passwordConfirmation: '123456',
        profile_id: '9',
        companies_ids: ['1'],
      }

      const userProfile: userProfile = {
        id: '2',
        name: 'user 2',
        email: 'user2@email.com',
        profile: {
          id: '1',
          name: 'admin',
          description: 'Administrator',
        },
        company: [
          { id: '1', cin: '11111', fantasy: 'company test', name: 'company' },
        ],
      }

      const companies: any[] = [
        {
          id: '1',
          cin: '11111',
          fantasy: 'company test',
          name: 'company',
          created_at: new Date('2022-01-01'),
          updated_at: null,
        },
        {
          id: '2',
          cin: '11111',
          fantasy: 'company test',
          name: 'company',
          created_at: new Date('2022-01-01'),
          updated_at: null,
        },
      ]
      jest
        .spyOn(service['prisma'].company, 'findMany')
        .mockResolvedValue(companies)

      jest.spyOn(service['prisma'].user, 'create').mockImplementation(() => {
        throw { code: 'P2003', meta: { field_name: 'users_profile_id_fkey' } }
      })

      try {
        await service.create(createUserDto, userProfile)
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException)
        expect(error.getStatus()).toEqual(HttpStatus.BAD_GATEWAY)
      }
    })
  })

  describe('user update', () => {
    it('should return the edited user for user request admin', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'user 1 edited',
        email: 'user1-edited@email.com',
        password: '123456789',
        passwordConfirmation: '123456789',
        profile_id: '1',
        companies_ids: ['1', '2'],
      }
      const userRequest: userProfile = {
        id: '2',
        name: 'user 2',
        email: 'user2@email.com',
        profile: {
          id: '1',
          name: 'admin',
          description: 'Administrator',
        },
        company: [
          { id: '1', cin: '11111', fantasy: 'company test', name: 'company' },
          { id: '2', cin: '11111', fantasy: 'company test', name: 'company' },
        ],
      }

      const companies: any[] = [
        {
          id: '1',
          cin: '11111',
          fantasy: 'company test',
          name: 'company',
          created_at: new Date('2022-01-01'),
          updated_at: null,
        },
        {
          id: '2',
          cin: '11111',
          fantasy: 'company test',
          name: 'company',
          created_at: new Date('2022-01-01'),
          updated_at: null,
        },
      ]
      const returnUser = {
        id: '1',
        name: 'user 1 edited',
        email: 'user1-edited@email.com',
        profile_id: '1',
        created_at: expect.any(Date),
        password: 'hashedpassword',
        status: true,
        updated_at: expect.any(Date),
      }
      jest
        .spyOn(service['prisma'].company, 'findMany')
        .mockResolvedValue(companies)
      jest.spyOn(service['prisma'].user, 'update').mockResolvedValue(returnUser)
      jest
        .spyOn(PasswordHasher, 'hashPassword')
        .mockResolvedValue('hashedpassword')
      const result = await service.update('1', updateUserDto, userRequest)
      expect(result).toEqual(returnUser)
      expect(service['prisma'].user.update).toHaveBeenCalledTimes(1)
      expect(service['prisma'].user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          ...updateUserDto,
          password: 'hashedpassword',
          updated_at: expect.any(Date),
          company: {
            set: [],
            connect: [{ id: '1' }, { id: '2' }],
          },
        },
        include: {
          profile: true,
          company: true,
        },
      })
    })

    it('should return the edited user for user request master', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'user 1 edited',
        email: 'user1-edited@email.com',
        password: '123456789',
        passwordConfirmation: '123456789',
        profile_id: '1',
        companies_ids: ['3'],
      }
      const userRequest: userProfile = {
        id: '2',
        name: 'user 2',
        email: 'user2@email.com',
        profile: {
          id: '1',
          name: 'master',
          description: 'Master',
        },
        company: [
          { id: '1', cin: '11111', fantasy: 'company test', name: 'company' },
          { id: '2', cin: '11111', fantasy: 'company test', name: 'company' },
        ],
      }

      const returnUser = {
        id: '1',
        name: 'user 1 edited',
        email: 'user1-edited@email.com',
        profile_id: '1',
        created_at: expect.any(Date),
        password: 'hashedpassword',
        status: true,
        updated_at: expect.any(Date),
      }
      jest.spyOn(service['prisma'].user, 'update').mockResolvedValue(returnUser)
      jest
        .spyOn(PasswordHasher, 'hashPassword')
        .mockResolvedValue('hashedpassword')
      const result = await service.update('1', updateUserDto, userRequest)

      expect(result).toEqual(returnUser)
      expect(service['prisma'].user.update).toHaveBeenCalledTimes(1)
      expect(service['prisma'].user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          ...updateUserDto,
          password: 'hashedpassword',
          updated_at: expect.any(Date),
          company: {
            set: [],
            connect: [{ id: '3' }],
          },
        },
        include: {
          profile: true,
          company: true,
        },
      })
    })
    it('should not change profile, status and company if the user is common', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'user 1 edited',
        email: 'user1-edited@email.com',
        status: false,
        password: '123456789',
        passwordConfirmation: '123456789',
        profile_id: '1',
        companies_ids: ['1', '2', '3'],
      }
      const userRequest: userProfile = {
        id: '1',
        name: 'user 1',
        email: 'user1@email.com',
        profile: {
          id: '2',
          name: 'common',
          description: 'Common',
        },
        company: [
          { id: '1', cin: '11111', fantasy: 'company test', name: 'company' },
          { id: '2', cin: '11111', fantasy: 'company test', name: 'company' },
        ],
      }

      const returnUser = {
        id: '1',
        name: 'user 1 edited',
        email: 'user1@email.com',
        profile_id: '2',
        created_at: expect.any(Date),
        password: 'hashedpassword',
        status: true,
        updated_at: expect.any(Date),
        companies_ids: ['1', '2'],
      }
      jest.spyOn(service['prisma'].user, 'update').mockResolvedValue(returnUser)
      jest
        .spyOn(PasswordHasher, 'hashPassword')
        .mockResolvedValue('hashedpassword')
      const result = await service.update('1', updateUserDto, userRequest)

      expect(result).toEqual(returnUser)
      expect(service['prisma'].user.update).toHaveBeenCalledTimes(1)
      expect(service['prisma'].user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          ...updateUserDto,
          password: 'hashedpassword',
          updated_at: expect.any(Date),
          company: {
            set: [],
            connect: [],
          },
        },
        include: {
          profile: true,
          company: true,
        },
      })
    })
    it('should handle HttpException for password confirmation different from password', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'user 1 edited',
        email: 'user1-edited@.com',
        password: '123456',
        passwordConfirmation: '1234567',
        profile_id: '1',
      }
      const userRequest: userProfile = {
        id: '1',
        name: 'user 1',
        email: 'user1@email.com',
        profile: {
          id: '2',
          name: 'common',
          description: 'Common',
        },
        company: [
          { id: '1', cin: '11111', fantasy: 'company test', name: 'company' },
          { id: '2', cin: '11111', fantasy: 'company test', name: 'company' },
        ],
      }
      jest
        .spyOn(service['prisma'].user, 'update')
        .mockRejectedValueOnce(new Error())
      await expect(
        service.update('1', updateUserDto, userRequest),
      ).rejects.toThrow(
        new BadRequestException(
          'passwords and password confirmation do not match',
        ),
      )
      expect(service['prisma'].user.update).toHaveBeenCalledTimes(0)
      expect(service['prisma'].user.update).not.toHaveBeenCalledWith()
    })
  })
  describe('user delete', () => {
    it('should return success for delete user for user request admin', async () => {
      const userRequest: userProfile = {
        id: '1',
        name: 'user 1',
        email: 'user1@email.com',
        profile: {
          id: '2',
          name: 'admin',
          description: 'admin',
        },
        company: [
          { id: '1', cin: '11111', fantasy: 'company test', name: 'company' },
          { id: '2', cin: '11111', fantasy: 'company test', name: 'company' },
        ],
      }

      const company = [
        {
          id: '1',
          cin: '11111',
          fantasy: 'company test',
          name: 'company',
          updated_at: null,
          created_at: new Date('2022-01-01'),
        },
        {
          id: '2',
          cin: '11111',
          fantasy: 'company test',
          name: 'company',
          updated_at: new Date('2022-01-01'),
          created_at: new Date('2022-01-01'),
        },
      ]

      const profile = {
        id: '2',
        name: 'admin',
        description: 'admin',
        updated_at: new Date('2022-01-01'),
        created_at: new Date('2022-01-01'),
      }

      jest
        .spyOn(service, 'findOneComplete')
        .mockResolvedValue({ ...fakeUsers[0], profile, company })
      jest
        .spyOn(service['prisma'].user, 'delete')
        .mockResolvedValue(fakeUsers[0])
      const result = await service.remove('1', userRequest)
      expect(result).toEqual(fakeUsers[0])
      expect(service['prisma'].user.delete).toHaveBeenCalledTimes(1)
      expect(service['prisma'].user.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      })
    })
    it('must return an exception to delete a user when the user request is admin and not part of the company ', async () => {
      const userRequest: userProfile = {
        id: '1',
        name: 'user 1',
        email: 'user1@email.com',
        profile: {
          id: '2',
          name: 'admin',
          description: 'admin',
        },
        company: [
          { id: '1', cin: '11111', fantasy: 'company test', name: 'company' },
          { id: '2', cin: '11111', fantasy: 'company test', name: 'company' },
        ],
      }

      const company = [
        {
          id: '3',
          cin: '11111',
          fantasy: 'company test',
          name: 'company',
          updated_at: null,
          created_at: new Date('2022-01-01'),
        },
        {
          id: '4',
          cin: '11111',
          fantasy: 'company test',
          name: 'company',
          updated_at: new Date('2022-01-01'),
          created_at: new Date('2022-01-01'),
        },
      ]

      const profile = {
        id: '2',
        name: 'admin',
        description: 'admin',
        updated_at: new Date('2022-01-01'),
        created_at: new Date('2022-01-01'),
      }

      jest
        .spyOn(service, 'findOneComplete')
        .mockResolvedValue({ ...fakeUsers[0], profile, company })
      jest
        .spyOn(service['prisma'].user, 'delete')
        .mockResolvedValue(fakeUsers[0])
      await expect(service.remove('1', userRequest)).rejects.toThrow(
        new Error('You are not authorized to access this feature'),
      )
      expect(service['prisma'].user.delete).toHaveBeenCalledTimes(0)
    })

    it('should return success for delete user for user request master', async () => {
      const userRequest: userProfile = {
        id: '1',
        name: 'user 1',
        email: 'user1@email.com',
        profile: {
          id: '2',
          name: 'master',
          description: 'master',
        },
        company: [
          { id: '1', cin: '11111', fantasy: 'company test', name: 'company' },
          { id: '2', cin: '11111', fantasy: 'company test', name: 'company' },
        ],
      }

      const company = [
        {
          id: '3',
          cin: '11111',
          fantasy: 'company test',
          name: 'company',
          updated_at: null,
          created_at: new Date('2022-01-01'),
        },
        {
          id: '4',
          cin: '11111',
          fantasy: 'company test',
          name: 'company',
          updated_at: new Date('2022-01-01'),
          created_at: new Date('2022-01-01'),
        },
      ]

      const profile = {
        id: '2',
        name: 'admin',
        description: 'admin',
        updated_at: new Date('2022-01-01'),
        created_at: new Date('2022-01-01'),
      }

      jest
        .spyOn(service, 'findOneComplete')
        .mockResolvedValue({ ...fakeUsers[0], profile, company })
      jest
        .spyOn(service['prisma'].user, 'delete')
        .mockResolvedValue(fakeUsers[0])
      const result = await service.remove('1', userRequest)
      expect(result).toEqual(fakeUsers[0])
      expect(service['prisma'].user.delete).toHaveBeenCalledTimes(1)
      expect(service['prisma'].user.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      })
    })
    it('should return Exception for null or wrong id', async () => {
      const userRequest: userProfile = {
        id: '1',
        name: 'user 1',
        email: 'user1@email.com',
        profile: {
          id: '2',
          name: 'master',
          description: 'master',
        },
        company: [
          { id: '1', cin: '11111', fantasy: 'company test', name: 'company' },
          { id: '2', cin: '11111', fantasy: 'company test', name: 'company' },
        ],
      }
      await expect(service.remove('', userRequest)).rejects.toThrow(
        new HttpException('id cannot be null', HttpStatus.BAD_GATEWAY),
      )
    })
    it('should return Exception for id does not exist', async () => {
      const userRequest: userProfile = {
        id: '1',
        name: 'user 1',
        email: 'user1@email.com',
        profile: {
          id: '2',
          name: 'master',
          description: 'master',
        },
        company: [
          { id: '1', cin: '11111', fantasy: 'company test', name: 'company' },
          { id: '2', cin: '11111', fantasy: 'company test', name: 'company' },
        ],
      }
      jest
        .spyOn(service['prisma'].user, 'delete')
        .mockRejectedValue(new Error())
      try {
        await service.remove('66', userRequest)
      } catch (error) {
        expect(error).toEqual(new NotFoundException(error))
      }
    })
  })

  describe('findOneComplete', () => {
    it('should return find complete by id', async () => {
      const id = '1'
      const resultMock = {
        ...fakeUsers[0],
        profile: {
          id: '1',
          name: 'commom',
          description: 'Commom',
          created_at: new Date(),
          updated_at: null,
        },
        company: [
          {
            id: '1',
            cin: '11111111',
            name: 'company fake',
            fantasy: 'fake',
            created_at: new Date(),
            updated_at: null,
          },
        ],
      }
      jest
        .spyOn(service['prisma'].user, 'findUnique')
        .mockResolvedValueOnce(resultMock)

      const result = await service.findOneComplete(id, null)

      expect(result).toEqual(resultMock)
      expect(service['prisma'].user.findUnique).toHaveBeenCalledTimes(1)
      expect(service['prisma'].user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: {
          profile: true,
          company: true,
        },
      })
    })
    it('should return find complete by id', async () => {
      const email = 'email@fake.com'
      const resultMock = {
        ...fakeUsers[0],
        profile: {
          id: '1',
          name: 'commom',
          description: 'Commom',
          created_at: new Date(),
          updated_at: null,
        },
        company: [
          {
            id: '1',
            cin: '11111111',
            name: 'company fake',
            fantasy: 'fake',
            created_at: new Date(),
            updated_at: null,
          },
        ],
      }
      jest
        .spyOn(service['prisma'].user, 'findUnique')
        .mockResolvedValueOnce(resultMock)

      const result = await service.findOneComplete(null, email)

      expect(result).toEqual(resultMock)
      expect(service['prisma'].user.findUnique).toHaveBeenCalledTimes(1)
      expect(service['prisma'].user.findUnique).toHaveBeenCalledWith({
        where: { email: 'email@fake.com' },
        include: {
          profile: true,
          company: true,
        },
      })
    })
  })
})
