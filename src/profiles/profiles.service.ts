import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createProfileDto: Prisma.ProfileCreateInput) {
    try {
      return await this.prisma.profile.create({
        data: {
          ...createProfileDto,
        },
      });
    } catch (error) {
      console.log(error.code);
      if ((error.code = 'P2002')) {
        throw new HttpException(
          `name ${createProfileDto.name} already exists in the database!`,
          HttpStatus.UNAUTHORIZED,
        );
      }
    }
  }

  findAll() {
    try {
      return this.prisma.profile.findMany();
    } catch (error) {
      console.error(error);
    }
  }

  async findOne(id: string) {
    try {
      return await this.prisma.profile.findUnique({
        where: { id },
      });
    } catch (error) {
      console.error(error);
    }
  }

  async update(id: string, updateProfileDto: Prisma.ProfileUpdateInput) {
    const date = new Date();
    try {
      return await this.prisma.profile.update({
        where: { id },
        data: {
          ...updateProfileDto,
          updated_at: date,
        },
      });
    } catch (error) {
      console.error('Update Error', error);
      throw new HttpException(error.meta.cause, HttpStatus.FOUND);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} profile`;
  }
}
