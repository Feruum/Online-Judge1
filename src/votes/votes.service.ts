import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { db } from '../database/database.config';
import { votes, submissions } from '../database/schema';
import { eq, and, sql } from 'drizzle-orm';
import { SubmissionsService } from '../submissions/submissions.service';

export interface CreateVoteDto {
  submissionId: number;
  voteType: 'best_practice' | 'clever';
}

@Injectable()
export class VotesService {
  constructor(private readonly submissionsService: SubmissionsService) { }

  async create(createVoteDto: CreateVoteDto, userId: number) {
    const { submissionId, voteType } = createVoteDto;

    // Check if submission exists and is public
    const submission = await this.submissionsService.findById(submissionId);
    if (!submission.isPublic) {
      throw new ForbiddenException('Cannot vote on private submissions');
    }

    // Check if user has solved the problem
    const hasSolved = await this.submissionsService.checkUserSolvedProblem(
      userId,
      submission.problemId
    );

    if (!hasSolved) {
      throw new ForbiddenException('You must solve the problem before voting on solutions');
    }

    // Check if user already voted on this submission
    const [existingVote] = await db
      .select()
      .from(votes)
      .where(and(eq(votes.submissionId, submissionId), eq(votes.userId, userId)))
      .limit(1);

    if (existingVote) {
      throw new ConflictException('You have already voted on this submission');
    }

    // Create vote
    const [newVote] = await db
      .insert(votes)
      .values({
        submissionId,
        userId,
        voteType,
      })
      .returning();

    // Update submission vote count and type
    await db
      .update(submissions)
      .set({
        votes: sql`${submissions.votes} + 1`,
        voteType: voteType,
        updatedAt: new Date(),
      })
      .where(eq(submissions.id, submissionId));

    return {
      id: newVote.id,
      submissionId: newVote.submissionId,
      voteType: newVote.voteType,
      createdAt: newVote.createdAt,
    };
  }

  async getTopSolutions(problemId: number, userId: number, isAdmin: boolean = false) {
    // Check if user has solved the problem (skip for admins)
    if (!isAdmin) {
      const hasSolved = await this.submissionsService.checkUserSolvedProblem(userId, problemId);
      if (!hasSolved) {
        throw new ForbiddenException('You must solve the problem to view top solutions');
      }
    }

    // Get top solutions ordered by votes
    return db
      .select({
        id: submissions.id,
        code: submissions.code,
        language: submissions.language,
        votes: submissions.votes,
        voteType: submissions.voteType,
        createdAt: submissions.createdAt,
        userId: submissions.userId,
        status: submissions.status,
      })
      .from(submissions)
      .where(
        and(
          eq(submissions.problemId, problemId),
          eq(submissions.isPublic, true),
          eq(submissions.status, 'accepted')
        )
      )
      .orderBy(sql`${submissions.votes} desc`, sql`${submissions.createdAt} desc`);
  }

  async markAsTopSolution(submissionId: number, voteType: 'best_practice' | 'clever') {
    // Increment votes and set vote type
    await db
      .update(submissions)
      .set({
        votes: sql`${submissions.votes} + 10`, // Admin boost
        voteType: voteType,
        updatedAt: new Date(),
      })
      .where(eq(submissions.id, submissionId));

    return { success: true, message: 'Marked as top solution' };
  }
}