// Mock the database before any imports
const mockDb = {
  select: jest.fn(),
  insert: jest.fn(),
  update: jest.fn(),
  from: jest.fn(),
  where: jest.fn(),
  values: jest.fn(),
  returning: jest.fn(),
  eq: jest.fn(),
  and: jest.fn(),
  desc: jest.fn(),
  set: jest.fn(),
  orderBy: jest.fn(),
};

jest.mock('../database/database.config', () => ({
  db: mockDb,
}));

// Mock the queue
const mockQueue = {
  add: jest.fn(),
};

import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';

describe('SubmissionsService', () => {
  let service: SubmissionsService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubmissionsService,
        {
          provide: 'BullQueue_submissions',
          useValue: mockQueue,
        },
      ],
    }).compile();

    service = module.get<SubmissionsService>(SubmissionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new submission and add to queue', async () => {
      const createSubmissionDto = {
        problemId: 1,
        code: 'print("Hello World")',
        language: 'python',
      };

      const mockSubmission = {
        id: 1,
        userId: 1,
        problemId: 1,
        code: 'print("Hello World")',
        language: 'python',
        status: 'pending',
        createdAt: new Date(),
      };

      mockDb.insert.mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([mockSubmission]),
        }),
      });

      mockQueue.add.mockResolvedValue(undefined);

      const result = await service.create(createSubmissionDto, 1);

      expect(result).toEqual({
        id: 1,
        status: 'pending',
        createdAt: mockSubmission.createdAt,
      });
      expect(mockDb.insert).toHaveBeenCalled();
      expect(mockQueue.add).toHaveBeenCalledWith('judge-submission', {
        submissionId: 1,
        sourceCode: 'print("Hello World")',
        language: 'python',
        problemId: 1,
      });
    });

    it('should throw error for unsupported language', async () => {
      const createSubmissionDto = {
        problemId: 1,
        code: 'console.log("Hello");',
        language: 'javascript',
      };

      await expect(service.create(createSubmissionDto, 1)).rejects.toThrow('Unsupported language');
    });
  });

  describe('findUserSubmissions', () => {
    it('should return user submissions ordered by creation date', async () => {
      const mockSubmissions = [
        {
          id: 1,
          problemId: 1,
          code: 'print("test")',
          language: 'python',
          status: 'accepted',
          isPublic: false,
          votes: 0,
          voteType: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockDb.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            orderBy: jest.fn().mockResolvedValue(mockSubmissions),
          }),
        }),
      });

      const result = await service.findUserSubmissions(1);

      expect(result).toEqual(mockSubmissions);
      expect(mockDb.select).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return submission if user owns it', async () => {
      const mockSubmission = {
        id: 1,
        userId: 1,
        code: 'print("test")',
        status: 'accepted',
        isPublic: false,
      };

      mockDb.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([mockSubmission]),
          }),
        }),
      });

      const result = await service.findById(1, 1);

      expect(result).toEqual(mockSubmission);
    });

    it('should return public submission for other users', async () => {
      const mockSubmission = {
        id: 1,
        userId: 2,
        code: 'print("test")',
        status: 'accepted',
        isPublic: true,
      };

      mockDb.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([mockSubmission]),
          }),
        }),
      });

      const result = await service.findById(1, 1);

      expect(result).toEqual(mockSubmission);
    });

    it('should throw ForbiddenException for private submission of other user', async () => {
      const mockSubmission = {
        id: 1,
        userId: 2,
        code: 'print("test")',
        status: 'accepted',
        isPublic: false,
      };

      mockDb.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([mockSubmission]),
          }),
        }),
      });

      await expect(service.findById(1, 1)).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException if submission not found', async () => {
      mockDb.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([]),
          }),
        }),
      });

      await expect(service.findById(999, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('makePublic', () => {
    it('should make accepted submission public', async () => {
      const mockSubmission = {
        id: 1,
        userId: 1,
        status: 'accepted',
        isPublic: false,
      };

      mockDb.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([mockSubmission]),
          }),
        }),
      });

      mockDb.update.mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            and: jest.fn().mockReturnValue({
              returning: jest.fn().mockResolvedValue([{
                id: 1,
                isPublic: true,
              }]),
            }),
          }),
        }),
      });

      const result = await service.makePublic(1, 1);

      expect(result).toEqual({
        id: 1,
        isPublic: true,
      });
    });

    it('should throw ForbiddenException if submission is not accepted', async () => {
      const mockSubmission = {
        id: 1,
        userId: 1,
        status: 'wrong_answer',
        isPublic: false,
      };

      mockDb.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([mockSubmission]),
          }),
        }),
      });

      await expect(service.makePublic(1, 1)).rejects.toThrow('Only accepted submissions can be made public');
    });
  });
});
