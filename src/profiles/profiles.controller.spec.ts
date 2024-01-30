import { Test, TestingModule } from '@nestjs/testing';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { CommonModule } from '../common/common.module';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('ProfilesController', () => {
  let controller: ProfilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CommonModule],
      controllers: [ProfilesController],
      providers: [ProfilesService],
    }).compile();

    controller = module.get<ProfilesController>(ProfilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should throw HttpException for empty string', () => {
    const data = {
      description: '',
      name: '',
    };
    expect(() => controller.create(data)).toThrow(
      new HttpException('cannot be empty!', HttpStatus.FORBIDDEN),
    );
  });
  it('should not throw HttpException for non-empty string', () => {
    const data = {
      description: 'exist',
      name: 'exist',
    };
    expect(() => controller.create(data)).not.toThrow();
  });
});
