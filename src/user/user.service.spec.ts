import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { CommonModule } from '../common/common.module';
import { PrismaService } from '../common/prisma/prisma.service';
import { fakeUsers } from './dataMock/fakeUsers';

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
      const result = await service.create(fakeUsers[0]);
      expect(result).toEqual(fakeUsers[0]);
      expect(service['prisma'].user.create).toHaveBeenCalledTimes(1);
      expect(service['prisma'].user.create).toHaveBeenCalledWith({
        data: fakeUsers[0],
      });
    });
  });
});
