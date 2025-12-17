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
  sql: jest.fn(),
  set: jest.fn(),
};

jest.mock('../database/database.config', () => ({
  db: mockDb,
}));

import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { VotesService } from './votes.service';

// Mock submissions service
const mockSubmissionsService = {
  findById: jest.fn(),
  checkUserSolvedProblem: jest.fn(),
  findPublicSolutionsForProblem: jest.fn(),
};

describe('VotesService', () => {
  let service: VotesService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VotesService,
        {
          provide: 'SubmissionsService',
          useValue: mockSubmissionsService,
        },
      ],
    }).compile();

    service = module.get<VotesService>(VotesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a vote successfully', async () => {
      const createVoteDto = {
        submissionId: 1,
        voteType: 'best_practice' as const,
      };

      const mockSubmission = {
        id: 1,
        userId: 2,
        isPublic: true,
        problemId: 1,
      };

      const mockVote = {
        id: 1,
        submissionId: 1,
        userId: 1,
        voteType: 'best_practice',
        createdAt: new Date(),
      };

      mockSubmissionsService.findById.mockResolvedValue(mockSubmission);
      mockSubmissionsService.checkUserSolvedProblem.mockResolvedValue(true);

      mockDb.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([]), // No existing vote
          }),
        }),
      });

      mockDb.insert.mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([mockVote]),
        }),
      });

      mockDb.update.mockResolvedValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue(undefined),
        }),
      });

      const result = await service.create(createVoteDto, 1);

      expect(result).toEqual({
        id: 1,
        submissionId: 1,
        voteType: 'best_practice',
        createdAt: mockVote.createdAt,
      });
      expect(mockDb.insert).toHaveBeenCalled();
      expect(mockDb.update).toHaveBeenCalled();
    });

    it('should throw ForbiddenException if submission is not public', async () => {
      const createVoteDto = {
        submissionId: 1,
        voteType: 'best_practice' as const,
      };

      const mockSubmission = {
        id: 1,
        userId: 2,
        isPublic: false, // Not public
        problemId: 1,
      };

      mockSubmissionsService.findById.mockResolvedValue(mockSubmission);

      await expect(service.create(createVoteDto, 1)).rejects.toThrow('Cannot vote on private submissions');
    });

    it('should throw ForbiddenException if user has not solved the problem', async () => {
      const createVoteDto = {
        submissionId: 1,
        voteType: 'best_practice' as const,
      };

      const mockSubmission = {
        id: 1,
        userId: 2,
        isPublic: true,
        problemId: 1,
      };

      mockSubmissionsService.findById.mockResolvedValue(mockSubmission);
      mockSubmissionsService.checkUserSolvedProblem.mockResolvedValue(false);

      await expect(service.create(createVoteDto, 1)).rejects.toThrow('You must solve the problem before voting on solutions');
    });

    it('should throw ConflictException if user already voted', async () => {
      const createVoteDto = {
        submissionId: 1,
        voteType: 'best_practice' as const,
      };

      const mockSubmission = {
        id: 1,
        userId: 2,
        isPublic: true,
        problemId: 1,
      };

      mockSubmissionsService.findById.mockResolvedValue(mockSubmission);
      mockSubmissionsService.checkUserSolvedProblem.mockResolvedValue(true);

      mockDb.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([{ id: 1 }]), // Existing vote
          }),
        }),
      });

      await expect(service.create(createVoteDto, 1)).rejects.toThrow('You have already voted on this submission');
    });
  });

  describe('getTopSolutions', () => {
    it('should return top solutions for solved problem', async () => {
      const mockSolutions = [
        {
          id: 1,
          code: 'print("solution")',
          language: 'python',
          votes: 10,
          voteType: 'best_practice',
          createdAt: new Date(),
          userId: 2,
        },
      ];

      mockSubmissionsService.checkUserSolvedProblem.mockResolvedValue(true);

      mockDb.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            orderBy: jest.fn().mockResolvedValue(mockSolutions),
          }),
        }),
      });

      const result = await service.getTopSolutions(1, 1);

      expect(result).toEqual(mockSolutions);
      expect(mockSubmissionsService.checkUserSolvedProblem).toHaveBeenCalledWith(1, 1);
    });

    it('should throw ForbiddenException if user has not solved the problem', async () => {
      mockSubmissionsService.checkUserSolvedProblem.mockResolvedValue(false);

      await expect(service.getTopSolutions(1, 1)).rejects.toThrow('You must solve the problem to view top solutions');
    });
  });
});
