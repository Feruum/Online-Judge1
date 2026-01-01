import { pgTable, serial, text, timestamp, integer, jsonb, boolean, pgEnum } from 'drizzle-orm/pg-core';

// Enums
export const userRoleEnum = pgEnum('user_role', ['user', 'admin']);
export const submissionStatusEnum = pgEnum('submission_status', ['pending', 'running', 'accepted', 'wrong_answer', 'time_limit_exceeded', 'memory_limit_exceeded', 'compilation_error', 'runtime_error']);
export const voteTypeEnum = pgEnum('vote_type', ['best_practice', 'clever']);

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: userRoleEnum('role').notNull().default('user'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Problems table
export const problems = pgTable('problems', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  difficulty: text('difficulty').default('Easy'),
  slug: text('slug'),
  examples: jsonb('examples'), // Array of examples
  testCases: jsonb('test_cases'), // Array of {input: string, expectedOutput: string}
  constraints: jsonb('constraints'), // Array of constraints
  starterCode: jsonb('starter_code'), // Object with language keys
  tags: jsonb('tags'), // Array of tags
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Submissions table
export const submissions = pgTable('submissions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  problemId: integer('problem_id').notNull().references(() => problems.id, { onDelete: 'cascade' }),
  code: text('code').notNull(),
  language: text('language').notNull(), // 'cpp', 'python'
  status: submissionStatusEnum('status').notNull().default('pending'),
  isPublic: boolean('is_public').notNull().default(false),
  votes: integer('votes').notNull().default(0),
  voteType: voteTypeEnum('vote_type'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Votes table
export const votes = pgTable('votes', {
  id: serial('id').primaryKey(),
  submissionId: integer('submission_id').notNull().references(() => submissions.id, { onDelete: 'cascade' }),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  voteType: voteTypeEnum('vote_type').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Types for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Problem = typeof problems.$inferSelect;
export type NewProblem = typeof problems.$inferInsert;

export type Submission = typeof submissions.$inferSelect;
export type NewSubmission = typeof submissions.$inferInsert;

export type Vote = typeof votes.$inferSelect;
export type NewVote = typeof votes.$inferInsert;

// Discussions table
export const discussions = pgTable('discussions', {
  id: serial('id').primaryKey(),
  problemId: integer('problem_id').notNull().references(() => problems.id, { onDelete: 'cascade' }),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  content: text('content').notNull(),
  parentId: integer('parent_id').references(() => discussions.id, { onDelete: 'cascade' }),
  votes: integer('votes').notNull().default(0),
  isAnswer: boolean('is_answer').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Discussion Votes table
export const discussionVotes = pgTable('discussion_votes', {
  id: serial('id').primaryKey(),
  discussionId: integer('discussion_id').notNull().references(() => discussions.id, { onDelete: 'cascade' }),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  voteType: integer('vote_type').notNull(), // 1 for upvote, -1 for downvote
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type Discussion = typeof discussions.$inferSelect;
export type NewDiscussion = typeof discussions.$inferInsert;

export type DiscussionVote = typeof discussionVotes.$inferSelect;
export type NewDiscussionVote = typeof discussionVotes.$inferInsert;
