import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from '../common/prisma/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { PasswordHasher } from '../utils/password-hasher'
import { MailingService } from '../email/mailing.service'
import { userProfile } from './entities/user_profile.entity'
import { UploadsService } from '../uploads/uploads.service'

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailingService: MailingService,
    private readonly uploadService: UploadsService,
  ) {}

  async create(
    createUserDto: CreateUserDto,
    user: userProfile,
    image: Express.Multer.File,
  ) {
    const userCompaniesIds = createUserDto.companies_ids
    delete createUserDto.companies_ids
    if (user.profile.name === 'admin') {
      const result = await this.prisma.company.findMany({
        where: {
          user: {
            some: {
              id: user.id,
            },
          },
        },
      })
      const companies = []
      for (const id of userCompaniesIds) {
        const findResult = result.find((f) => f.id === id)
        if (findResult) {
          companies.push(findResult)
        }
      }

      if (userCompaniesIds.length !== companies.length)
        throw new ForbiddenException(
          'You are not authorized to access this feature',
        )
    }

    if (createUserDto.password !== createUserDto.passwordConfirmation) {
      throw new BadRequestException(
        'passwords and password confirmation do not match',
      )
    }

    const passwordHash = await PasswordHasher.hashPassword(
      createUserDto.password,
    )
    delete createUserDto.passwordConfirmation
    const connect = []
    for (const id of userCompaniesIds) {
      connect.push({ id: id })
    }

    const imageName = image
      ? await this.uploadService.saveUserImage(image)
      : {
          fileName: null,
          extension: null,
        }

    try {
      const result = await this.prisma.user.create({
        data: {
          ...createUserDto,
          image_url: imageName.fileName
            ? `${process.env.IMAGES_USER_URL}/${imageName.fileName}${imageName.extension}`
            : null,
          filename: imageName.fileName,
          extension: imageName.extension,
          password: passwordHash,
          company: {
            connect: connect,
          },
        },
        include: {
          profile: true,
          company: true,
        },
      })
      await this.mailingService.sendUserWelcome(result, createUserDto.password)
      delete result.password
      return result
    } catch (error) {
      if (imageName.fileName) {
        await this.uploadService.deleteUserImage(imageName)
      }
      if (error.code === 'P2002') {
        throw new HttpException('E-mail already exists', HttpStatus.BAD_GATEWAY)
      } else if (error.code) {
        throw new HttpException(error, HttpStatus.BAD_GATEWAY)
      } else {
        throw new Error(error)
      }
    }
  }

  async findAll(user: any) {
    if (user.profile.name === 'admin') {
      const result = await this.prisma.company.findMany({
        where: {
          user: {
            some: {
              id: user.id,
            },
          },
        },
      })

      const resultUser = await this.prisma.user.findMany({
        where: {
          company: {
            some: {
              id: {
                in: result.map((r) => r.id),
              },
            },
          },
        },
        include: {
          company: true,
          profile: true,
        },
      })
      return resultUser.map((r) => {
        delete r.password
        return {
          ...r,
        }
      })
    }
    const result = await this.prisma.user.findMany({
      include: {
        company: true,
        profile: true,
      },
    })
    return result.map((r) => {
      delete r.password
      return {
        ...r,
      }
    })
  }

  async findOne(id: string, user) {
    if (user.profile.name === 'admin') {
      const result = await this.prisma.company.findMany({
        where: {
          user: {
            some: {
              id: user.id,
            },
          },
        },
      })

      const resultUser = await this.prisma.user.findUnique({
        where: {
          id: id,
          company: {
            some: {
              id: {
                in: result.map((r) => r.id),
              },
            },
          },
        },
        include: {
          company: true,
          profile: true,
        },
      })
      delete resultUser.password
      return resultUser
    }
    const result = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        company: true,
        profile: true,
      },
    })
    delete result.password
    return result
  }

  async findOneComplete(id: string, email: string) {
    if (id) {
      return await this.prisma.user.findUnique({
        where: {
          id: id,
        },
        include: {
          profile: true,
          company: true,
        },
      })
    } else {
      return await this.prisma.user.findUnique({
        where: {
          email: email,
        },
        include: {
          profile: true,
          company: true,
        },
      })
    }
  }

  async updateForgotPassword(id: string, updateUserDto: UpdateUserDto) {
    try {
      await this.prisma.user.update({
        where: { id },
        data: {
          ...updateUserDto,
        },
      })
    } catch (error) {
      throw new BadRequestException('Failed to request password reset')
    }
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    user: userProfile,
    image: Express.Multer.File,
  ) {
    let userCompaniesIds = updateUserDto.companies_ids
    delete updateUserDto.companies_ids
    if (user.profile.name === 'common') {
      delete updateUserDto.profile_id
      delete updateUserDto.status
      userCompaniesIds = []
    }

    if (user.profile.name === 'admin') {
      const result = await this.prisma.company.findMany({
        where: {
          user: {
            some: {
              id: user.id,
            },
          },
        },
      })
      const companies = []
      for (const id of userCompaniesIds) {
        const findResult = result.find((f) => f.id === id)
        if (findResult) {
          companies.push(findResult)
        }
      }
      if (userCompaniesIds.length !== companies.length)
        throw new ForbiddenException(
          'You are not authorized to access this feature',
        )
    }
    if (
      updateUserDto.password &&
      updateUserDto.password !== updateUserDto.passwordConfirmation
    ) {
      throw new BadRequestException(
        'passwords and password confirmation do not match',
      )
    }

    const passwordHash = updateUserDto.password
      ? await PasswordHasher.hashPassword(updateUserDto.password)
      : null

    passwordHash ? (updateUserDto.password = passwordHash) : null
    const connect = []
    for (const id of userCompaniesIds) {
      connect.push({ id: id })
    }
    delete updateUserDto.email
    delete updateUserDto.passwordConfirmation
    const imageName = image
      ? await this.uploadService.saveUserImage(image)
      : null

    try {
      const result = await this.prisma.user.update({
        where: {
          id: id,
        },
        data: {
          ...updateUserDto,
          image_url: imageName
            ? `${process.env.IMAGES_USER_URL}/${imageName.fileName}${imageName.extension}`
            : null,
          filename: imageName ? imageName.fileName : '',
          extension: imageName ? imageName.extension : '',
          updated_at: new Date(),
          company: {
            set: [],
            connect: connect,
          },
        },
        include: {
          profile: true,
          company: true,
        },
      })
      delete result.password
      return result
    } catch (error) {
      if (image) {
        await this.uploadService.deleteUserImage(imageName)
      }
      if (error.code && error.meta) {
        throw new HttpException(error.meta, HttpStatus.BAD_GATEWAY)
      } else {
        throw new Error(error)
      }
    }
  }

  async remove(id: string, user: any) {
    if (user.profile.name === 'admin') {
      const userDelete = await this.findOneComplete(id, null)
      const deleted = []
      for (const i in userDelete.company) {
        const find = user.company.find((f) => f.id === userDelete.company[i].id)
        find ? deleted.push(find) : null
      }
      if (deleted.length === 0)
        throw new ForbiddenException(
          'You are not authorized to access this feature',
        )
    }

    if (id === '' || id === null) {
      throw new HttpException('id cannot be null', HttpStatus.BAD_GATEWAY)
    }
    try {
      const result = await this.prisma.user.delete({ where: { id: id } })

      return result
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(error.meta.cause)
      } else {
        throw new Error(error)
      }
    }
  }
}
