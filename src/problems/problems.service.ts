import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { db } from '../database/database.config';
import { problems } from '../database/schema';
import { eq, desc } from 'drizzle-orm';

export interface CreateProblemDto {
  title: string;
  description: string;
  difficulty?: string;
  slug?: string;
  examples?: string; // JSON string
  testCases?: string; // JSON string
  constraints?: string; // JSON string
  starterCode?: string; // JSON string
  tags?: string[]; // Array of tags
}

export interface UpdateProblemDto {
  title?: string;
  description?: string;
  testCases?: Array<{ input: string; expectedOutput: string }>;
}

@Injectable()
export class ProblemsService {
  async findAll() {
    return db
      .select()
      .from(problems)
      .orderBy(desc(problems.createdAt));
  }

  async findById(id: number) {
    const [problem] = await db
      .select()
      .from(problems)
      .where(eq(problems.id, id))
      .limit(1);

    if (!problem) {
      throw new NotFoundException('Problem not found');
    }

    return problem;
  }

  async create(createProblemDto: CreateProblemDto, userRole: string) {
    if (userRole !== 'admin') {
      throw new ForbiddenException('Only admins can create problems');
    }

    console.log('Creating problem with data:', createProblemDto);

    // Parse JSON strings back to objects
    const processedDto = {
      title: createProblemDto.title,
      description: createProblemDto.description,
      difficulty: createProblemDto.difficulty || 'Easy',
      slug: createProblemDto.slug,
      examples: createProblemDto.examples ? JSON.parse(createProblemDto.examples) : null,
      testCases: createProblemDto.testCases ? JSON.parse(createProblemDto.testCases) : [],
      constraints: createProblemDto.constraints ? JSON.parse(createProblemDto.constraints) : [],
      starterCode: createProblemDto.starterCode ? JSON.parse(createProblemDto.starterCode) : {},
      tags: createProblemDto.tags || [],
    };

    console.log('Processed DTO:', processedDto);

    const [newProblem] = await db
      .insert(problems)
      .values(processedDto)
      .returning();

    console.log('Created problem:', newProblem);
    return newProblem;
  }

  async update(id: number, updateProblemDto: UpdateProblemDto, userRole: string) {
    // Temporarily allow any user to update problems for testing
    // if (userRole !== 'admin') {
    //   throw new ForbiddenException('Only admins can update problems');
    // }

    const [updatedProblem] = await db
      .update(problems)
      .set({
        ...updateProblemDto,
        updatedAt: new Date(),
      })
      .where(eq(problems.id, id))
      .returning();

    if (!updatedProblem) {
      throw new NotFoundException('Problem not found');
    }

    return updatedProblem;
  }

  async delete(id: number, userRole: string) {
    // Temporarily allow any user to delete problems for testing
    // if (userRole !== 'admin') {
    //   throw new ForbiddenException('Only admins can delete problems');
    // }

    const [deletedProblem] = await db
      .delete(problems)
      .where(eq(problems.id, id))
      .returning();

    if (!deletedProblem) {
      throw new NotFoundException('Problem not found');
    }

    return { message: 'Problem deleted successfully' };
  }
}