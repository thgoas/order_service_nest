import { Test, TestingModule } from '@nestjs/testing'
import { CompaniesController } from './companies.controller'
import { CompaniesService } from './companies.service'
import { PrismaService } from '../common/prisma/prisma.service'

describe('CompaniesController', () => {
  let controller: CompaniesController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompaniesController],
      providers: [CompaniesService, PrismaService],
    }).compile()

    controller = module.get<CompaniesController>(CompaniesController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
