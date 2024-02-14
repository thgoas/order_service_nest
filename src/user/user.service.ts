import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from '../common/prisma/prisma.service'
import { CreateUserDto } from './dto/create-user-dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { EmailValidator } from '../utils/email-validator'
import { PasswordHasher } from '../utils/password-hasher'
import { MailingService } from '../email/mailing.service'

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailingService: MailingService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const emailValidator = new EmailValidator()
    if (createUserDto.name === '' || createUserDto.name === null) {
      throw new HttpException('name cannot be empty!', HttpStatus.FORBIDDEN)
    }
    if (createUserDto.email === '' || createUserDto.email === null) {
      throw new HttpException('email cannot be empty!', HttpStatus.FORBIDDEN)
    }

    if (!emailValidator.validate(createUserDto.email)) {
      throw new HttpException('Invalid Email!', HttpStatus.FORBIDDEN)
    }

    if (createUserDto.password === '' || createUserDto.password === null) {
      throw new HttpException('password cannot be empty!', HttpStatus.FORBIDDEN)
    }

    if (createUserDto.password.length < 6) {
      throw new HttpException(
        'Password must be greater than or equal to 6 characters',
        HttpStatus.FORBIDDEN,
      )
    }

    if (createUserDto.profile_id === '' || createUserDto.profile_id === null) {
      throw new HttpException(
        'profile_id cannot be empty!',
        HttpStatus.FORBIDDEN,
      )
    }

    const passwordHash = await PasswordHasher.hashPassword(
      createUserDto.password,
    )
    try {
      const result = await this.prisma.user.create({
        data: {
          ...createUserDto,
          password: passwordHash,
        },
      })
      await this.mailingService.sendUserConfirmation(result, '123456')
      return result
    } catch (error) {
      if (error.code && error.meta) {
        throw new HttpException(error.meta.field_name, HttpStatus.BAD_GATEWAY)
      } else {
        throw new Error(error)
      }
    }
  }

  findAll() {
    return this.prisma.user.findMany()
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id: id,
      },
    })
  }

  async findOneLogin(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async update(id: string, updateUserDto: UpdateUserDto) {
    console.log(updateUserDto)
    // const passwordHash = await PasswordHasher.hashPassword(
    //   createUserDto.password,
    // );
    if (updateUserDto.name === '' || updateUserDto.name === null) {
      throw new HttpException('Invalid Name!', HttpStatus.FORBIDDEN)
    }

    if (updateUserDto.email === '' || updateUserDto.email === null) {
      throw new HttpException('Invalid Email!', HttpStatus.FORBIDDEN)
    }

    if (updateUserDto.password === '' || updateUserDto.password === null) {
      throw new HttpException('password cannot be empty!', HttpStatus.FORBIDDEN)
    }

    if (updateUserDto.profile_id === '' || updateUserDto.profile_id === null) {
      throw new HttpException(
        'profile_id cannot be empty!',
        HttpStatus.FORBIDDEN,
      )
    }

    if (updateUserDto.password && updateUserDto.password.length < 6) {
      throw new HttpException(
        'Password must be greater than or equal to 6 characters',
        HttpStatus.FORBIDDEN,
      )
    }

    const passwordHash = await PasswordHasher.hashPassword(
      updateUserDto.password,
    )

    try {
      return await this.prisma.user.update({
        where: {
          id: id,
        },
        data: {
          ...updateUserDto,
          updated_at: new Date(),
          password: passwordHash,
        },
      })
    } catch (error) {
      console.error(error)
      if (error.code && error.meta) {
        throw new HttpException(error.meta.field_name, HttpStatus.BAD_GATEWAY)
      } else {
        throw new Error(error)
      }
    }
  }

  remove(id: string) {
    return this.prisma.user.delete({ where: { id: id } })
  }
}
