import {
  BadGatewayException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderDto } from './dto/update-order.dto'
import { PrismaService } from '../common/prisma/prisma.service'
import { MailingService } from '../email/mailing.service'
import { UploadsService } from '../uploads/uploads.service'
import { EmailOrderService } from '../email/model/email-order-service'
import { Uploads } from '../uploads/entities/uploads.entity'

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailingService: MailingService,
    private readonly uploadsService: UploadsService,
  ) {}
  async create(
    createOrderDto: CreateOrderDto,
    images: Express.Multer.File[],
    req: any,
  ) {
    const user = req.user
    const imagesNames = await this.uploadsService.saveImages(images)
    const imageData = imagesNames.map((r) => {
      return {
        filename: r.fileName,
        extension: r.extension,
        url: `${process.env.IMAGES_URL}/${r.fileName}${r.extension}`,
      }
    })
    try {
      const createResult = await this.prisma.orderService.create({
        data: {
          ...createOrderDto,
          date_entry: new Date(createOrderDto.date_entry),
          user_id: user.sub,
          history_order_service: {
            create: {
              description: `create a new order service by ${user.userEmail}`,
            },
          },
          images: {
            createMany: {
              data: imageData,
            },
          },
        },
        include: {
          company: true,
          customers: true,
          images: true,
          history_order_service: true,
          status: true,
          technical_accompaniments: true,
        },
      })
      const technicianEmail = await this.prisma.user.findUnique({
        where: {
          id: createResult.technician_id,
        },
        select: {
          email: true,
        },
      })

      const createNewOrderService: EmailOrderService = {
        applicant: createResult.customers.email,
        date_entry: Intl.DateTimeFormat('pt-Br').format(
          createResult.date_entry,
        ),
        description: createResult.description,
        order_number: createResult.id.toString(),
        solution: createResult.solution,
        status: `${createResult.status.name} - ${createResult.status.description}`,
        technicianEmail: technicianEmail.email,
        userEmail: user.userEmail,
        date_departure: createResult.departure_date
          ? Intl.DateTimeFormat('pt-Br').format(createResult.departure_date)
          : null,
        identification_number: createResult.identification_number,
        serie_number: createResult.serie_number,
        technical_accompaniments: [],
      }

      await this.mailingService.sendNewCreateOrderService(createNewOrderService)
      return createResult
    } catch (error) {
      await this.uploadsService.deleteImages(imagesNames)
      if (error.code) {
        throw new BadGatewayException(error)
      }
      throw new Error(error)
    }
  }

  async findAll(user: any) {
    try {
      const result = await this.prisma.user.findUnique({
        where: {
          id: user.sub,
        },
        include: {
          company: true,
          profile: true,
        },
      })
      if (result.profile.name === 'master') {
        return await this.prisma.orderService.findMany({
          include: {
            company: true,
            customers: true,
            images: true,
            history_order_service: true,
            status: true,
            technical_accompaniments: true,
          },
        })
      } else {
        return await this.prisma.orderService.findMany({
          where: {
            company: { id: { in: result.company.map((r) => r.id) } },
          },
          include: {
            company: true,
            customers: true,
            images: true,
            history_order_service: true,
            status: true,
            technical_accompaniments: true,
          },
        })
      }
    } catch (error) {
      if (error.code) {
        throw new BadGatewayException(error)
      }
      throw new Error(error)
    }
  }

  async findOne(id: number, user: any) {
    try {
      const userVerify = await this.prisma.user.findUnique({
        where: {
          id: user.sub,
        },
        include: {
          company: true,
          profile: true,
        },
      })

      const where: any = {}
      if (userVerify.profile.name !== 'master') {
        where['id'] = id
        where['company'] = { id: { in: userVerify.company.map((r) => r.id) } }
      } else {
        where['id'] = id
      }

      return await this.prisma.orderService.findUnique({
        where,
        include: {
          company: true,
          customers: true,
          images: true,
          history_order_service: true,
          status: true,
          technical_accompaniments: true,
        },
      })
    } catch (error) {
      if (error.code) {
        throw new BadGatewayException(error)
      }
      throw new Error(error)
    }
  }

  async update(id: number, updateOrderDto: UpdateOrderDto, req: any) {
    const user = req.user
    try {
      const beforeUpdated = await this.findOne(id, user)
      const userVerify = await this.prisma.user.findUnique({
        where: {
          id: user.sub,
        },
        include: {
          company: true,
          profile: true,
        },
      })

      const where: any = {}

      if (userVerify.profile.name !== 'master') {
        where['id'] = id
        where['company'] = { id: { in: userVerify.company.map((r) => r.id) } }
      } else {
        where['id'] = id
      }
      const result = await this.prisma.orderService.update({
        where,
        data: {
          ...updateOrderDto,
          date_entry: new Date(updateOrderDto.date_entry),
          departure_date: updateOrderDto.departure_date
            ? new Date(updateOrderDto.departure_date)
            : null,
          history_order_service: {
            create: {
              description: `Update Order Service by ${user.userEmail} | => ${JSON.stringify(beforeUpdated)}`,
            },
          },
        },
        include: {
          company: true,
          customers: true,
          images: true,
          history_order_service: true,
          status: true,
          technical_accompaniments: true,
        },
      })
      const technicianEmail = await this.prisma.user.findUnique({
        where: {
          id: result.technician_id,
        },
        select: {
          email: true,
        },
      })
      const updateOrderService: EmailOrderService = {
        applicant: result.customers.email,
        date_entry: Intl.DateTimeFormat('pt-Br').format(result.date_entry),
        description: result.description,
        order_number: result.id.toString(),
        solution: result.solution,
        status: `${result.status.name} - ${result.status.description}`,
        technicianEmail: technicianEmail.email,
        userEmail: user.userEmail,
        date_departure: result.departure_date
          ? Intl.DateTimeFormat('pt-Br').format(result.departure_date)
          : null,
        identification_number: result.identification_number,
        serie_number: result.serie_number,
        technical_accompaniments: result.technical_accompaniments as any,
        type: 'Atualização na',
      }
      await this.mailingService.sendUpdateOrderService(updateOrderService)
      return result
    } catch (error) {
      if (error.code) {
        throw new BadGatewayException(error)
      }
      throw new Error(error)
    }
  }

  async remove(id: number, req: any) {
    const user = req.user
    try {
      const userVerify = await this.prisma.user.findUnique({
        where: {
          id: user.sub,
        },
        include: {
          company: true,
          profile: true,
        },
      })
      if (
        userVerify.profile.name !== 'master' &&
        userVerify.profile.name !== 'admin'
      ) {
        throw new ForbiddenException()
      }

      const where: any = {}
      if (userVerify.profile.name !== 'master') {
        where['id'] = id
        where['company'] = { id: { in: userVerify.company.map((r) => r.id) } }
      } else {
        where['id'] = id
      }
      const result = await this.prisma.orderService.delete({
        where,
        include: {
          images: true,
          customers: true,
          status: true,
        },
      })
      const deleteImages: Uploads[] = result.images.map((r) => {
        return {
          fileName: r.filename,
          extension: r.extension,
        }
      })

      const technicianEmail = await this.prisma.user.findUnique({
        where: {
          id: result.technician_id,
        },
        select: {
          email: true,
        },
      })

      const deleteOrderService: EmailOrderService = {
        applicant: result.customers.email,
        date_entry: Intl.DateTimeFormat('pt-Br').format(result.date_entry),
        description: result.description,
        order_number: result.id.toString(),
        solution: result.solution,
        status: `${result.status.name} - ${result.status.description}`,
        technicianEmail: technicianEmail.email,
        userEmail: user.userEmail,
        date_departure: result.departure_date
          ? Intl.DateTimeFormat('pt-Br').format(result.departure_date)
          : null,
        identification_number: result.identification_number,
        serie_number: result.serie_number,
        technical_accompaniments: [],
        type: 'foi excluída',
      }

      await this.uploadsService.deleteImages(deleteImages)
      await this.mailingService.sendDeleteOrderService(deleteOrderService)
      return result
    } catch (error) {
      if (error.code) {
        throw new BadGatewayException(error)
      }
      throw new Error(error)
    }
  }
}
