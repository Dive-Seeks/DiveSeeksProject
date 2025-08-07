import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PosService } from './pos.service';

describe('PosService', () => {
  let service: PosService;
  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    count: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PosService,
        {
          provide: getRepositoryToken(Object),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PosService>(PosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
