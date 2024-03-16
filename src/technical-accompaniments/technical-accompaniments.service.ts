import { BadGatewayException, Injectable } from '@nestjs/common'
import { CreateTechnicalAccompanimentDto } from './dto/create-technical-accompaniment.dto'
import { UpdateTechnicalAccompanimentDto } from './dto/update-technical-accompaniment.dto'
import { PrismaService } from '../common/prisma/prisma.service'
import { MailingService } from '../email/mailing.service'
import { OrderService } from '../order/order.service'
import { EmailOrderService } from '../email/model/email-order-service'

@Injectable()
export class TechnicalAccompanimentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailingService: MailingService,
    private readonly orderService: OrderService,
  ) {}

  async create(
    createTechnicalAccompanimentDto: CreateTechnicalAccompanimentDto,
    req: any,
  ) {
    const user = req.user
    try {
      const result = await this.prisma.technicalAccompaniments.create({
        data: {
          description: createTechnicalAccompanimentDto.description,
          order_service_id: Number(
            createTechnicalAccompanimentDto.order_service_id,
          ),
          user_id: user.sub,
        },
      })

      const resultOrderServiceFind = await this.orderService.findOne(
        result.order_service_id,
        user,
      )
      const technicianEmail = await this.prisma.user.findUnique({
        where: { id: resultOrderServiceFind.technician_id },
      })
      const updateOrderService: EmailOrderService = {
        applicant: resultOrderServiceFind.customers.email,
        date_entry: Intl.DateTimeFormat('pt-Br').format(
          resultOrderServiceFind.date_entry,
        ),
        description: resultOrderServiceFind.description,
        order_number: resultOrderServiceFind.id.toString(),
        solution: resultOrderServiceFind.solution,
        status: `${resultOrderServiceFind.status.name} - ${resultOrderServiceFind.status.description}`,
        technicianEmail: technicianEmail.email,
        userEmail: user.userEmail,
        date_departure: resultOrderServiceFind.departure_date
          ? Intl.DateTimeFormat('pt-Br').format(
              resultOrderServiceFind.departure_date,
            )
          : null,
        identification_number: resultOrderServiceFind.identification_number,
        serie_number: resultOrderServiceFind.serie_number,
        technical_accompaniments:
          resultOrderServiceFind.technical_accompaniments.map(
            (r) => r.description,
          ),
        type: 'Atualização na',
        images: resultOrderServiceFind.images.map(
          (r) =>
            `${process.env.UPLOADS_FILE_IMAGES}/${r.filename}${r.extension}`,
        ),
      }
      await this.mailingService.sendUpdateOrderService(updateOrderService)
      return resultOrderServiceFind
    } catch (error) {
      console.log(error)
      if (error.code) {
        throw new BadGatewayException(error)
      } else {
        throw new Error(error)
      }
    }
  }

  // findAll() {
  //   return `This action returns all technicalAccompaniments`
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} technicalAccompaniment`
  // }

  async update(
    id: string,
    updateTechnicalAccompanimentDto: UpdateTechnicalAccompanimentDto,
    req: any,
  ) {
    const user = req.user
    try {
      const result = await this.prisma.technicalAccompaniments.update({
        where: {
          id: id,
        },
        data: {
          description: updateTechnicalAccompanimentDto.description,
        },
      })
      const resultOrderServiceFind = await this.orderService.findOne(
        result.order_service_id,
        user,
      )
      const technicianEmail = await this.prisma.user.findUnique({
        where: { id: resultOrderServiceFind.technician_id },
      })
      const updateOrderService: EmailOrderService = {
        applicant: resultOrderServiceFind.customers.email,
        date_entry: Intl.DateTimeFormat('pt-Br').format(
          resultOrderServiceFind.date_entry,
        ),
        description: resultOrderServiceFind.description,
        order_number: resultOrderServiceFind.id.toString(),
        solution: resultOrderServiceFind.solution,
        status: `${resultOrderServiceFind.status.name} - ${resultOrderServiceFind.status.description}`,
        technicianEmail: technicianEmail.email,
        userEmail: user.userEmail,
        date_departure: resultOrderServiceFind.departure_date
          ? Intl.DateTimeFormat('pt-Br').format(
              resultOrderServiceFind.departure_date,
            )
          : null,
        identification_number: resultOrderServiceFind.identification_number,
        serie_number: resultOrderServiceFind.serie_number,
        technical_accompaniments:
          resultOrderServiceFind.technical_accompaniments.map(
            (r) => r.description,
          ),
        type: 'Atualização na',
        images: resultOrderServiceFind.images.map(
          (r) =>
            `${process.env.UPLOADS_FILE_IMAGES}/${r.filename}${r.extension}`,
        ),
      }
      await this.mailingService.sendUpdateOrderService(updateOrderService)
      return resultOrderServiceFind
    } catch (error) {
      if (error.code) {
        throw new BadGatewayException(error)
      } else {
        throw new Error(error)
      }
    }
  }

  async remove(id: string, req: any) {
    const user = req.user
    try {
      const result = await this.prisma.technicalAccompaniments.delete({
        where: {
          id: id,
        },
      })
      const resultOrderServiceFind = await this.orderService.findOne(
        result.order_service_id,
        user,
      )
      const technicianEmail = await this.prisma.user.findUnique({
        where: { id: resultOrderServiceFind.technician_id },
      })
      const updateOrderService: EmailOrderService = {
        applicant: resultOrderServiceFind.customers.email,
        date_entry: Intl.DateTimeFormat('pt-Br').format(
          resultOrderServiceFind.date_entry,
        ),
        description: resultOrderServiceFind.description,
        order_number: resultOrderServiceFind.id.toString(),
        solution: resultOrderServiceFind.solution,
        status: `${resultOrderServiceFind.status.name} - ${resultOrderServiceFind.status.description}`,
        technicianEmail: technicianEmail.email,
        userEmail: user.userEmail,
        date_departure: resultOrderServiceFind.departure_date
          ? Intl.DateTimeFormat('pt-Br').format(
              resultOrderServiceFind.departure_date,
            )
          : null,
        identification_number: resultOrderServiceFind.identification_number,
        serie_number: resultOrderServiceFind.serie_number,
        technical_accompaniments:
          resultOrderServiceFind.technical_accompaniments.map(
            (r) => r.description,
          ),
        type: 'Atualização na',
        images: resultOrderServiceFind.images.map(
          (r) =>
            `${process.env.UPLOADS_FILE_IMAGES}/${r.filename}${r.extension}`,
        ),
      }
      await this.mailingService.sendUpdateOrderService(updateOrderService)
      return resultOrderServiceFind
    } catch (error) {
      if (error.code) {
        throw new BadGatewayException(error)
      } else {
        throw new Error(error)
      }
    }
  }
}
