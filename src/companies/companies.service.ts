import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateCompanyDto } from './dto/create-company.dto'
import { UpdateCompanyDto } from './dto/update-company.dto'
import { PrismaService } from '../common/prisma/prisma.service'
import { userProfile } from 'src/user/entities/user_profile.entity'

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createCompanyDto: CreateCompanyDto) {
    try {
      return await this.prisma.company.create({
        data: {
          ...createCompanyDto,
        },
      })
    } catch (error) {
      if (error.code === 'P2002') {
        throw new HttpException('CIN already exists', HttpStatus.BAD_GATEWAY)
      } else if (error.meta) {
        throw new HttpException(error.meta, HttpStatus.BAD_GATEWAY)
      }

      throw new Error(error)
    }
  }

  async findAll(user: userProfile) {
    const profileName = user.profile.name
    try {
      if (profileName === 'master') {
        return await this.prisma.company.findMany({
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
      } else {
        return await this.prisma.company.findMany({
          where: {
            user: {
              some: {
                profile: {
                  name: {
                    not: 'master',
                  },
                },
              },
            },
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
      }
    } catch (error) {
      if (error.meta) {
        throw new HttpException(error.meta, HttpStatus.BAD_GATEWAY)
      }

      throw new Error(error)
    }
  }

  async findOne(id: string) {
    try {
      return await this.prisma.company.findUnique({
        where: {
          id,
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
    } catch (error) {
      if (error.meta) {
        throw new HttpException(error.meta, HttpStatus.BAD_GATEWAY)
      }

      throw new Error(error)
    }
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    try {
      return await this.prisma.company.update({
        where: { id },
        data: updateCompanyDto,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
      })
    } catch (error) {
      if (error.meta) {
        throw new HttpException(error.meta, HttpStatus.BAD_GATEWAY)
      }

      throw new Error(error)
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.company.delete({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
      })
    } catch (error) {
      if (error.meta) {
        throw new HttpException(error.meta, HttpStatus.BAD_GATEWAY)
      }

      throw new Error(error)
    }
  }
}
