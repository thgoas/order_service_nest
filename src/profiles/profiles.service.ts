import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../common/prisma/prisma.service'

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createProfileDto: Prisma.ProfileCreateInput) {
    if (createProfileDto.name === '' || createProfileDto.name === null) {
      throw new HttpException('cannot be empty!', HttpStatus.FORBIDDEN)
    }
    if (
      createProfileDto.description === '' ||
      createProfileDto.description === null
    ) {
      throw new HttpException('cannot be empty!', HttpStatus.FORBIDDEN)
    }
    try {
      return await this.prisma.profile.create({
        data: {
          ...createProfileDto,
        },
      })
    } catch (error) {
      if (error.code === 'P2002') {
        throw new HttpException(
          `name ${createProfileDto.name} already exists in the database!`,
          HttpStatus.UNAUTHORIZED,
        )
      } else {
        throw new Error(error)
      }
    }
  }

  findAll() {
    try {
      return this.prisma.profile.findMany()
    } catch (error) {
      throw new Error(error)
    }
  }

  async findOne(id: string) {
    try {
      return await this.prisma.profile.findUnique({
        where: { id },
      })
    } catch (error) {
      throw new Error(error)
    }
  }

  async update(id: string, updateProfileDto: Prisma.ProfileUpdateInput) {
    const date = new Date()
    try {
      return await this.prisma.profile.update({
        where: { id },
        data: {
          ...updateProfileDto,
          updated_at: date,
        },
      })
    } catch (error) {
      throw new NotFoundException(error.meta.cause)
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.profile.delete({ where: { id } })
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(error.meta.cause)
      } else {
        throw new Error(error)
      }
    }
  }
}
