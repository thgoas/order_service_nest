import { BadGatewayException, Injectable } from '@nestjs/common'
import { PrismaService } from '../common/prisma/prisma.service'

@Injectable()
export class StatusService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll() {
    try {
      return await this.prisma.status.findMany()
    } catch (error) {
      if (error.code) {
        throw new BadGatewayException(error)
      } else {
        throw new Error(error)
      }
    }
  }

  async findOne(id: string) {
    try {
      return await this.prisma.status.findUnique({
        where: {
          id,
        },
      })
    } catch (error) {
      if (error.code) {
        throw new BadGatewayException(error)
      } else {
        throw new Error(error)
      }
    }
  }
}
