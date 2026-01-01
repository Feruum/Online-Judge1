// Mock the database before any imports
const mockDb = {
  select: jest.fn(),
  insert: jest.fn(),
  from: jest.fn(),
  where: jest.fn(),
  eq: jest.fn(),
  limit: jest.fn(),
  values: jest.fn(),
  returning: jest.fn(),
};

jest.mock('../database/database.config', () => ({
  db: mockDb,
}));

import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProblemsService } from './problems.service';

describe('ProblemsService', () => {
  let service: ProblemsService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [ProblemsService],
    }).compile();

    service = module.get<ProblemsService>(ProblemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all problems', async () => {
      const mockProblems = [
        {
          id: 1,
          title: 'Two Sum',
          description: 'Find two numbers that add up to target',
          createdAt: new Date(),
        },
        {
          id: 2,
          title: 'Reverse String',
          description: 'Reverse a given string',
          createdAt: new Date(),
        },
      ];

      mockDb.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          orderBy: jest.fn().mockResolvedValue(mockProblems),
        }),
      });

      const result = await service.findAll();

      expect(result).toEqual(mockProblems);
      expect(mockDb.select).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return problem by id', async () => {
      const mockProblem = {
        id: 1,
        title: 'Two Sum',
        description: 'Find two numbers that add up to target',
        testCases: [
          { input: '[2,7,11,15]\n9', expectedOutput: '[0,1]' },
        ],
        createdAt: new Date(),
      };

      mockDb.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([mockProblem]),
          }),
        }),
      });

      const result = await service.findById(1);

      expect(result).toEqual(mockProblem);
      expect(mockDb.select).toHaveBeenCalled();
    });

    it('should throw NotFoundException if problem not found', async () => {
      mockDb.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([]),
          }),
        }),
      });

      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new problem', async () => {
      const createProblemDto = {
        title: 'New Problem',
        description: 'Description of new problem',
        testCases: JSON.stringify([
          { input: 'input', output: 'output' },
        ]),
      };

      const mockCreatedProblem = {
        id: 1,
        title: 'New Problem',
        description: 'Description of new problem',
        testCases: [{ input: 'input', output: 'output' }],
        createdAt: new Date(),
      };

      mockDb.insert.mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([mockCreatedProblem]),
        }),
      });

      const result = await service.create(createProblemDto, 'admin');

      expect(result).toEqual(mockCreatedProblem);
      expect(mockDb.insert).toHaveBeenCalled();
    });

    it('should throw ForbiddenException if user is not admin', async () => {
      const createProblemDto = {
        title: 'New Problem',
        description: 'Description',
        testCases: JSON.stringify([]),
      };

      await expect(service.create(createProblemDto, 'user')).rejects.toThrow('Only admins can create problems');
    });
  });
});
