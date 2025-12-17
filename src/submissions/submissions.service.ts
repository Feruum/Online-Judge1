import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { db } from '../database/database.config';
import { submissions } from '../database/schema';
import { eq, and, desc } from 'drizzle-orm';

export interface CreateSubmissionDto {
  problemId: number;
  code: string;
  language: string;
}

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectQueue('submissions') private submissionsQueue: Queue,
  ) {}

  async create(createSubmissionDto: CreateSubmissionDto, userId: number) {
    const { problemId, code, language } = createSubmissionDto;

    // Validate language
    if (!['cpp', 'python'].includes(language.toLowerCase())) {
      throw new Error('Unsupported language. Supported languages: cpp, python');
    }

    // Create submission record
    const [newSubmission] = await db
      .insert(submissions)
      .values({
        userId,
        problemId,
        code,
        language: language.toLowerCase(),
        status: 'pending',
      })
      .returning();

    // Add to queue for processing
    await this.submissionsQueue.add('judge-submission', {
      submissionId: newSubmission.id,
      sourceCode: code,
      language: language.toLowerCase(),
      problemId,
    });

    return {
      id: newSubmission.id,
      status: newSubmission.status,
      createdAt: newSubmission.createdAt,
    };
  }

  async findUserSubmissions(userId: number) {
    return db
      .select({
        id: submissions.id,
        problemId: submissions.problemId,
        code: submissions.code,
        language: submissions.language,
        status: submissions.status,
        isPublic: submissions.isPublic,
        votes: submissions.votes,
        voteType: submissions.voteType,
        createdAt: submissions.createdAt,
        updatedAt: submissions.updatedAt,
      })
      .from(submissions)
      .where(eq(submissions.userId, userId))
      .orderBy(desc(submissions.createdAt));
  }

  async findById(id: number, userId?: number) {
    const [submission] = await db
      .select()
      .from(submissions)
      .where(eq(submissions.id, id))
      .limit(1);

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    // If userId is provided, check ownership for private submissions
    if (userId && submission.userId !== userId && !submission.isPublic) {
      throw new ForbiddenException('Access denied');
    }

    return submission;
  }

  async makePublic(submissionId: number, userId: number) {
    // Check if submission exists and belongs to user
    const submission = await this.findById(submissionId, userId);

    if (submission.userId !== userId) {
      throw new ForbiddenException('Can only make your own submissions public');
    }

    if (submission.status !== 'accepted') {
      throw new ForbiddenException('Only accepted submissions can be made public');
    }

    // Update to public
    const [updatedSubmission] = await db
      .update(submissions)
      .set({ isPublic: true, updatedAt: new Date() })
      .where(and(eq(submissions.id, submissionId), eq(submissions.userId, userId)))
      .returning();

    return {
      id: updatedSubmission.id,
      isPublic: updatedSubmission.isPublic,
    };
  }

  async checkUserSolvedProblem(userId: number, problemId: number): Promise<boolean> {
    const [acceptedSubmission] = await db
      .select()
      .from(submissions)
      .where(
        and(
          eq(submissions.userId, userId),
          eq(submissions.problemId, problemId),
          eq(submissions.status, 'accepted')
        )
      )
      .limit(1);

    return !!acceptedSubmission;
  }
}