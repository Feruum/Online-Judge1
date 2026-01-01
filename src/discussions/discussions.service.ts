import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { db } from '../database/database.config';
import { discussions, discussionVotes } from '../database/schema';
import { eq, and, desc, sql } from 'drizzle-orm';

export interface CreateDiscussionDto {
  problemId: number;
  title: string;
  content: string;
  parentId?: number;
}

export interface CreateDiscussionVoteDto {
  discussionId: number;
  voteType: number; // 1 for upvote, -1 for downvote
}

@Injectable()
export class DiscussionsService {
  async create(createDiscussionDto: CreateDiscussionDto, userId: number) {
    const { problemId, title, content, parentId } = createDiscussionDto;

    const [newDiscussion] = await db
      .insert(discussions)
      .values({
        problemId,
        userId,
        title,
        content,
        parentId: parentId || null,
      })
      .returning();

    return newDiscussion;
  }

  async findByProblemId(problemId: number) {
    return db
      .select({
        id: discussions.id,
        title: discussions.title,
        content: discussions.content,
        parentId: discussions.parentId,
        votes: discussions.votes,
        isAnswer: discussions.isAnswer,
        createdAt: discussions.createdAt,
        userId: discussions.userId,
        // Note: In production, you might want to join with users table to get username
      })
      .from(discussions)
      .where(eq(discussions.problemId, problemId))
      .orderBy(desc(discussions.createdAt));
  }

  async findById(id: number) {
    const [discussion] = await db
      .select()
      .from(discussions)
      .where(eq(discussions.id, id))
      .limit(1);

    if (!discussion) {
      throw new NotFoundException('Discussion not found');
    }

    return discussion;
  }

  async vote(createVoteDto: CreateDiscussionVoteDto, userId: number) {
    const { discussionId, voteType } = createVoteDto;

    // Check if discussion exists
    await this.findById(discussionId);

    // Check if user already voted
    const [existingVote] = await db
      .select()
      .from(discussionVotes)
      .where(and(eq(discussionVotes.discussionId, discussionId), eq(discussionVotes.userId, userId)))
      .limit(1);

    if (existingVote) {
      // Update existing vote
      await db
        .update(discussionVotes)
        .set({
          voteType,
          createdAt: new Date(),
        })
        .where(eq(discussionVotes.id, existingVote.id));

      // Update discussion votes count
      const voteDifference = voteType - existingVote.voteType;
      await db
        .update(discussions)
        .set({
          votes: sql`${discussions.votes} + ${voteDifference}`,
          updatedAt: new Date(),
        })
        .where(eq(discussions.id, discussionId));
    } else {
      // Create new vote
      await db.insert(discussionVotes).values({
        discussionId,
        userId,
        voteType,
      });

      // Update discussion votes count
      await db
        .update(discussions)
        .set({
          votes: sql`${discussions.votes} + ${voteType}`,
          updatedAt: new Date(),
        })
        .where(eq(discussions.id, discussionId));
    }

    return { success: true };
  }

  async markAsAnswer(discussionId: number, adminUserId: number) {
    // Check if user is admin (you might want to add role checking)
    const discussion = await this.findById(discussionId);

    await db
      .update(discussions)
      .set({
        isAnswer: true,
        updatedAt: new Date(),
      })
      .where(eq(discussions.id, discussionId));

    return { success: true };
  }
}
