import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EmailValidator } from '../utils/email-validator';
import { PasswordHasher } from '../utils/password-hasher';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const emailValidator = new EmailValidator();
    if (createUserDto.name === '' || createUserDto.name === null) {
      throw new HttpException('name cannot be empty!', HttpStatus.FORBIDDEN);
    }
    if (createUserDto.email === '' || createUserDto.email === null) {
      throw new HttpException('email cannot be empty!', HttpStatus.FORBIDDEN);
    }

    if (!emailValidator.validate(createUserDto.email)) {
      throw new HttpException('Invalid Email!', HttpStatus.FORBIDDEN);
    }

    if (createUserDto.password === '' || createUserDto.password === null) {
      throw new HttpException(
        'password cannot be empty!',
        HttpStatus.FORBIDDEN,
      );
    }

    if (createUserDto.password.length < 6) {
      throw new HttpException(
        'Password must be greater than or equal to 6 characters',
        HttpStatus.FORBIDDEN,
      );
    }

    if (createUserDto.profile_id === '' || createUserDto.profile_id === null) {
      throw new HttpException(
        'profile_id cannot be empty!',
        HttpStatus.FORBIDDEN,
      );
    }

    const passwordHash = await PasswordHasher.hashPassword(
      createUserDto.password,
    );
    try {
      return await this.prisma.user.create({
        data: {
          ...createUserDto,
          password: passwordHash,
        },
      });
    } catch (error) {
      // console.error(error);
      if (
        error.code === 'P2003' &&
        error.meta.field_name.includes('users_profile_id_fkey')
      ) {
        throw new HttpException(
          'profile_id does not exist!',
          HttpStatus.FORBIDDEN,
        );
      }
    }
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: {
        id: id,
      },
      data: updateUserDto,
    });
  }

  remove(id: string) {
    return this.prisma.user.delete({ where: { id: id } });
  }
}
