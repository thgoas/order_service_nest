import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { CommonModule } from '../common/common.module';
import { PrismaService } from '../common/prisma/prisma.service';
import { fakeUsers } from './dataMock/fakeUsers';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user-dto';
import { PasswordHasher } from '../utils/password-hasher';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CommonModule],
      providers: [UserService, PrismaService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('user findAll', () => {
    it('should return all users', async () => {
      jest
        .spyOn(service['prisma'].user, 'findMany')
        .mockResolvedValue(fakeUsers);
      const result = await service.findAll();
      expect(service['prisma'].user.findMany).toHaveBeenCalledTimes(1);
      expect(service['prisma'].user.findMany).toHaveBeenCalledWith();
      expect(result).toEqual(fakeUsers);
    });
  });
  describe('user findOne', () => {
    it('should return a single user', async () => {
      jest
        .spyOn(service['prisma'].user, 'findUnique')
        .mockResolvedValue(fakeUsers[0]);
      const result = await service.findOne('1');

      expect(service['prisma'].user.findUnique).toHaveBeenCalledTimes(1);
      expect(service['prisma'].user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(fakeUsers[0]);
    });
    it('should return nothing when profile is not found', async () => {
      jest
        .spyOn(service['prisma'].user, 'findUnique')
        .mockReturnValue(undefined);

      const result = await service.findOne('99');
      expect(result).toBeUndefined();
    });
  });
  describe('user create', () => {
    it('should create a new user and return', async () => {
      jest
        .spyOn(service['prisma'].user, 'create')
        .mockResolvedValue(fakeUsers[0]);

      jest
        .spyOn(PasswordHasher, 'hashPassword')
        .mockResolvedValue('hashedpassword');

      const result = await service.create(fakeUsers[0]);
      expect(result).toEqual({
        ...fakeUsers[0],
      });
      expect(service['prisma'].user.create).toHaveBeenCalledTimes(1);
      expect(service['prisma'].user.create).toHaveBeenCalledWith({
        data: { ...fakeUsers[0], password: 'hashedpassword' },
      });
    });
    it('should handle HttpException for empty name', async () => {
      const createUserDto: CreateUserDto = {
        name: '',
        email: 'user@email.com',
        password: '123456',
        profile_id: '1',
      };
      jest
        .spyOn(service['prisma'].user, 'create')
        .mockRejectedValueOnce(
          new HttpException('name cannot be empty!', HttpStatus.FORBIDDEN),
        );
      await expect(service.create(createUserDto)).rejects.toThrow(
        new HttpException('name cannot be empty!', HttpStatus.FORBIDDEN),
      );
      expect(service['prisma'].user.create).toHaveBeenCalledTimes(0);
      expect(service['prisma'].user.create).not.toHaveBeenCalledWith();
    });
    it('should handle HttpException for empty email', async () => {
      const createUserDto: CreateUserDto = {
        name: 'user1',
        email: '',
        password: '123456',
        profile_id: '1',
      };
      jest
        .spyOn(service['prisma'].user, 'create')
        .mockRejectedValueOnce(
          new HttpException('email cannot be empty!', HttpStatus.FORBIDDEN),
        );
      await expect(service.create(createUserDto)).rejects.toThrow(
        new HttpException('email cannot be empty!', HttpStatus.FORBIDDEN),
      );
      expect(service['prisma'].user.create).toHaveBeenCalledTimes(0);
      expect(service['prisma'].user.create).not.toHaveBeenCalledWith();
    });
    it('should handle HttpException for invalid email', async () => {
      const createUserDto: CreateUserDto = {
        name: 'user1',
        email: 'user1.com',
        password: '123456',
        profile_id: '1',
      };
      jest
        .spyOn(service['prisma'].user, 'create')
        .mockRejectedValueOnce(
          new HttpException('Invalid Email!', HttpStatus.FORBIDDEN),
        );
      await expect(service.create(createUserDto)).rejects.toThrow(
        new HttpException('Invalid Email!', HttpStatus.FORBIDDEN),
      );
      expect(service['prisma'].user.create).toHaveBeenCalledTimes(0);
      expect(service['prisma'].user.create).not.toHaveBeenCalledWith();
    });

    it('should handle HttpException for empty password', async () => {
      const createUserDto: CreateUserDto = {
        name: 'user1',
        email: 'user1@email.com',
        password: '',
        profile_id: '1',
      };
      jest
        .spyOn(service['prisma'].user, 'create')
        .mockRejectedValueOnce(
          new HttpException('password cannot be empty!', HttpStatus.FORBIDDEN),
        );
      await expect(service.create(createUserDto)).rejects.toThrow(
        new HttpException('password cannot be empty!', HttpStatus.FORBIDDEN),
      );
      expect(service['prisma'].user.create).toHaveBeenCalledTimes(0);
      expect(service['prisma'].user.create).not.toHaveBeenCalledWith();
    });

    it('should handle HttpException for password less than 6 characters', async () => {
      const createUserDto: CreateUserDto = {
        name: 'user1',
        email: 'user1@email.com',
        password: '12345',
        profile_id: '1',
      };
      jest
        .spyOn(service['prisma'].user, 'create')
        .mockRejectedValueOnce(
          new HttpException(
            'Password must be greater than or equal to 6 characters',
            HttpStatus.FORBIDDEN,
          ),
        );
      await expect(service.create(createUserDto)).rejects.toThrow(
        new HttpException(
          'Password must be greater than or equal to 6 characters',
          HttpStatus.FORBIDDEN,
        ),
      );
      expect(service['prisma'].user.create).toHaveBeenCalledTimes(0);
      expect(service['prisma'].user.create).not.toHaveBeenCalledWith();
    });
    it('should handle HttpException for empty profile_id', async () => {
      const createUserDto: CreateUserDto = {
        name: 'user1',
        email: 'user1@email.com',
        password: '123456',
        profile_id: '',
      };
      jest
        .spyOn(service['prisma'].user, 'create')
        .mockRejectedValueOnce(
          new HttpException(
            'profile_id cannot be empty!',
            HttpStatus.FORBIDDEN,
          ),
        );
      await expect(service.create(createUserDto)).rejects.toThrow(
        new HttpException('profile_id cannot be empty!', HttpStatus.FORBIDDEN),
      );
      expect(service['prisma'].user.create).toHaveBeenCalledTimes(0);
      expect(service['prisma'].user.create).not.toHaveBeenCalledWith();
    });
    it('should handle HttpException for invalid profile_id', async () => {
      const createUserDto: CreateUserDto = {
        name: 'user1',
        email: 'user1@email.com',
        password: '123456',
        profile_id: '9',
      };
      jest.spyOn(service['prisma'].user, 'create').mockImplementation(() => {
        throw { code: 'P2003', meta: { field_name: 'users_profile_id_fkey' } };
      });

      try {
        await service.create(createUserDto);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toEqual('profile_id does not exist!');
        expect(error.getStatus()).toEqual(HttpStatus.FORBIDDEN);
      }
    });
  });
});
