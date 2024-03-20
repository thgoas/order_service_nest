import { BadGatewayException, Injectable } from '@nestjs/common'
import { CreateImageDto } from './dto/create-image.dto'
import { PrismaService } from '../common/prisma/prisma.service'
import { UploadsService } from '../uploads/uploads.service'
import { MailingService } from '../email/mailing.service'
import { OrderService } from '../order/order.service'
import { EmailOrderService } from '../email/model/email-order-service'

@Injectable()
export class ImagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadsService: UploadsService,
    private readonly mailingService: MailingService,
    private readonly orderService: OrderService,
  ) {}
  async create(
    createImageDto: CreateImageDto,
    images: Express.Multer.File[] | any,
    req: any,
  ) {
    if (images['image'] === undefined) {
      throw new BadGatewayException('no images added')
    }
    const user = req.user
    const imagesNames = images
      ? await this.uploadsService.saveImages(images)
      : null
    try {
      for (const i in imagesNames) {
        await this.prisma.image.create({
          data: {
            order_id: Number(createImageDto.order_id),
            filename: imagesNames[i].fileName,
            extension: imagesNames[i].extension,
            url: `${process.env.IMAGES_URL}/${imagesNames[i].fileName}${imagesNames[i].extension}`,
          },
        })
      }

      const resultOrderServiceFind = await this.orderService.findOne(
        Number(createImageDto.order_id),
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
      const result = await this.prisma.image.delete({
        where: {
          id: id,
        },
      })
      const resultOrderServiceFind = await this.orderService.findOne(
        result.order_id,
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
