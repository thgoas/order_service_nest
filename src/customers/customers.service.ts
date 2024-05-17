import {
  BadGatewayException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { CreateCustomerDto } from './dto/create-customer.dto'
import { UpdateCustomerDto } from './dto/update-customer.dto'
import { PrismaService } from '../common/prisma/prisma.service'
import { UploadsService } from '../uploads/uploads.service'
import { cnpj, cpf } from 'cpf-cnpj-validator'

@Injectable()
export class CustomersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadsService: UploadsService,
  ) {}
  async create(
    createCustomerDto: CreateCustomerDto,
    image: Express.Multer.File,
    req: any,
  ) {
    const user = req.userProfile
    const legal_person =
      createCustomerDto.legal_person === 'true' ? true : false
    const imageName = image
      ? await this.uploadsService.saveUserImage(image)
      : {
          fileName: null,
          extension: null,
        }
    if (
      !legal_person &&
      createCustomerDto.identification_number.length !== 11
    ) {
      throw new BadGatewayException(
        'Invalid identification number other than 11',
      )
    }

    if (
      !legal_person &&
      !cpf.isValid(createCustomerDto.identification_number)
    ) {
      throw new BadGatewayException('Invalid identification number')
    }

    if (legal_person && createCustomerDto.identification_number.length !== 14) {
      throw new BadGatewayException(
        'Invalid identification number other than 14',
      )
    }

    if (
      legal_person &&
      !cnpj.isValid(createCustomerDto.identification_number)
    ) {
      throw new BadGatewayException('Invalid identification number')
    }
    try {
      const companies = await this.prisma.company.findMany({
        where: {
          user: {
            some: {
              id: user.id,
            },
          },
        },
      })
      if (companies.length === 0) {
        throw new UnauthorizedException()
      }
      const findCompany = companies.filter(
        (f) => f.id === createCustomerDto.company_id,
      )
      if (findCompany.length === 0) {
        throw new UnauthorizedException()
      }
      const result = await this.prisma.customers.create({
        data: {
          name: createCustomerDto.name,
          fantasy_name: createCustomerDto.fantasy_name,
          identification_number: createCustomerDto.identification_number,
          email: createCustomerDto.email,
          company_id: createCustomerDto.company_id,
          image_url: imageName
            ? `${process.env.IMAGES_USER_URL}/${imageName.fileName}${imageName.extension}`
            : null,
          filename: imageName ? imageName.fileName : null,
          extension: imageName ? imageName.extension : null,

          legal_person,
        },
      })
      return result
    } catch (error) {
      if (imageName.fileName) {
        await this.uploadsService.deleteUserImage(imageName)
      }
      if (error.code) {
        throw new BadGatewayException(error)
      } else if (error.response && error.response.message === 'Unauthorized') {
        throw new UnauthorizedException()
      } else {
        throw new Error(error)
      }
    }
  }

  async findAll(req: any) {
    const user = req.userProfile
    try {
      if (user.profile.name === 'master') {
        return await this.prisma.customers.findMany()
      } else {
        return await this.prisma.customers.findMany({
          where: {
            company_id: {
              in: user.company.map((r) => r.id),
            },
          },
        })
      }
    } catch (error) {
      if (error.code) {
        throw new BadGatewayException(error)
      } else {
        throw new Error(error)
      }
    }
  }

  async findOne(id: string, req: any) {
    const user = req.userProfile
    try {
      return await this.prisma.customers.findUnique({
        where: {
          id,
          company_id: {
            in: user.company.map((r) => r.id),
          },
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

  async update(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
    image: Express.Multer.File,
    req: any,
  ) {
    console.log(updateCustomerDto, id)
    const user = req.userProfile
    const legal_person =
      updateCustomerDto.legal_person === 'true' ? true : false
    const imageName = image
      ? await this.uploadsService.saveUserImage(image)
      : null
    if (
      !legal_person &&
      updateCustomerDto.identification_number.length !== 11
    ) {
      throw new BadGatewayException(
        'Invalid identification number other than 11',
      )
    }

    if (
      !legal_person &&
      !cpf.isValid(updateCustomerDto.identification_number)
    ) {
      throw new BadGatewayException('Invalid identification number')
    }

    if (legal_person && updateCustomerDto.identification_number.length !== 14) {
      throw new BadGatewayException(
        'Invalid identification number other than 14',
      )
    }

    if (
      legal_person &&
      !cnpj.isValid(updateCustomerDto.identification_number)
    ) {
      throw new BadGatewayException('Invalid identification number')
    }
    try {
      const companies = await this.prisma.company.findMany({
        where: {
          user: {
            some: {
              id: user.id,
            },
          },
        },
      })
      if (companies.length === 0) {
        throw new UnauthorizedException()
      }
      const findCompany = companies.filter(
        (f) => f.id === updateCustomerDto.company_id,
      )
      if (findCompany.length === 0) {
        throw new UnauthorizedException()
      }

      const beforeCustomers = await this.findOne(id, req)
      if (imageName && beforeCustomers && beforeCustomers.filename) {
        await this.uploadsService.deleteUserImage({
          fileName: beforeCustomers.filename,
          extension: beforeCustomers.extension,
        })
      }

      const result = await this.prisma.customers.update({
        where: {
          id,
        },
        data: {
          name: updateCustomerDto.name,
          fantasy_name: updateCustomerDto.fantasy_name,
          identification_number: updateCustomerDto.identification_number,
          email: updateCustomerDto.email,
          company_id: updateCustomerDto.company_id,
          image_url: imageName
            ? `${process.env.IMAGES_USER_URL}/${imageName.fileName}${imageName.extension}`
            : `${process.env.IMAGES_USER_URL}/${beforeCustomers.filename}${beforeCustomers.extension}`,
          filename: imageName ? imageName.fileName : beforeCustomers.filename,
          extension: imageName
            ? imageName.extension
            : beforeCustomers.extension,

          legal_person: legal_person,
        },
      })
      return result
    } catch (error) {
      if (imageName) {
        await this.uploadsService.deleteUserImage(imageName)
      }
      console.log(error)
      if (error.code) {
        throw new BadGatewayException(error)
      } else if (error.response && error.response.message === 'Unauthorized') {
        throw new UnauthorizedException()
      } else {
        throw new Error(error)
      }
    }
  }

  async remove(id: string, req: any) {
    const user = req.userProfile

    try {
      const companies = await this.prisma.company.findMany({
        where: {
          user: {
            some: {
              id: user.id,
            },
          },
        },
      })
      if (companies.length === 0) {
        throw new UnauthorizedException()
      }

      const result = await this.prisma.customers.delete({
        where: {
          id,
          company_id: {
            in: companies.map((r) => r.id),
          },
        },
      })
      if (result.filename) {
        await this.uploadsService.deleteUserImage({
          fileName: result.filename,
          extension: result.extension,
        })
      }
      return result
    } catch (error) {
      if (error.code) {
        throw new BadGatewayException(error)
      } else if (error.response && error.response.message === 'Unauthorized') {
        throw new UnauthorizedException()
      } else {
        throw new Error(error)
      }
    }
  }
}
