import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UploadsService } from './uploads.service';

describe('UploadsService', () => {
  let service: UploadsService;
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
        UploadsService,
        {
          provide: getRepositoryToken(Object),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UploadsService>(UploadsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
