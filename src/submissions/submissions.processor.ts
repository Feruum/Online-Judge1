import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { JudgeService } from '../judge/judge.service';
import { db } from '../database/database.config';
import { submissions, problems } from '../database/schema';
import { eq } from 'drizzle-orm';

export interface SubmissionJobData {
  submissionId: number;
  sourceCode: string;
  language: string;
  problemId: number;
}

@Injectable()
@Processor('submissions')
export class SubmissionsProcessor extends WorkerHost {
  private readonly logger = new Logger(SubmissionsProcessor.name);

  constructor(private readonly judgeService: JudgeService) {
    super();
  }

  async process(job: Job<SubmissionJobData>): Promise<any> {
    const { submissionId, sourceCode, language, problemId } = job.data;

    this.logger.debug(`Processing submission ${submissionId} for problem ${problemId}`);

    try {
      // Update submission status to running
      await db
        .update(submissions)
        .set({ status: 'running', updatedAt: new Date() })
        .where(eq(submissions.id, submissionId));

      // Get problem test cases
      const [problem] = await db
        .select()
        .from(problems)
        .where(eq(problems.id, problemId))
        .limit(1);

      if (!problem) {
        throw new Error('Problem not found');
      }

      const testCases = problem.testCases as Array<{ input: string; expectedOutput: string }>;
      const languageId = this.judgeService.getLanguageId(language);

      // Run all test cases
      let allPassed = true;
      let finalResult: any = null;
      let finalStatus: typeof submissions.$inferSelect.status = 'accepted';

      for (const testCase of testCases) {
        const submissionRequest = {
          source_code: sourceCode,
          language_id: languageId,
          stdin: testCase.input,
          expected_output: testCase.expectedOutput,
        };

        this.logger.debug(`Running test case with input: ${testCase.input}`);

        // Submit to Judge0
        const token = await this.judgeService.submitCode(submissionRequest);
        this.logger.debug(`Submitted test case, got token: ${token}`);

        // Poll for result (with timeout)
        let result = null;
        const maxAttempts = 30; // 30 seconds max
        let attempts = 0;

        while (attempts < maxAttempts) {
          result = await this.judgeService.getSubmissionResult(token);

          if (this.judgeService.isSubmissionComplete(result.status)) {
            break;
          }

          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
          attempts++;
        }

        if (!result || !this.judgeService.isSubmissionComplete(result.status)) {
          this.logger.error(`Test case timed out for submission ${submissionId}`);
          finalStatus = 'runtime_error';
          allPassed = false;
          finalResult = result;
          break;
        }

        finalResult = result;
        this.logger.debug(`Test case completed with status: ${result.status.description}`);

        // Check if this test case passed
        if (!this.judgeService.isAccepted(result)) {
          allPassed = false;
          finalStatus = this.mapJudge0StatusToOurs(result.status.id);
          this.logger.debug(`Test case failed with status: ${finalStatus}`);
          break; // Stop on first failure
        }
      }

      // Update submission status based on results
      const status = allPassed ? 'accepted' : finalStatus;

      await db
        .update(submissions)
        .set({ status, updatedAt: new Date() })
        .where(eq(submissions.id, submissionId));

      this.logger.log(`Submission ${submissionId} completed with status: ${status}`);

      return { submissionId, status, result: finalResult };
    } catch (error) {
      this.logger.error(`Failed to process submission ${submissionId}: ${error.message}`, error.stack);

      // Update submission status to error
      await db
        .update(submissions)
        .set({ status: 'runtime_error', updatedAt: new Date() })
        .where(eq(submissions.id, submissionId));

      throw error;
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job<SubmissionJobData>) {
    this.logger.log(`Job ${job.id} completed for submission ${job.data.submissionId}`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job<SubmissionJobData>, err: Error) {
    this.logger.error(`Job ${job.id} failed for submission ${job.data.submissionId}: ${err.message}`);
  }

  private mapJudge0StatusToOurs(judge0StatusId: number): typeof submissions.$inferSelect.status {
    switch (judge0StatusId) {
      case 3:
        return 'accepted';
      case 4:
        return 'wrong_answer';
      case 5:
        return 'time_limit_exceeded';
      case 6:
        return 'compilation_error';
      case 7: // Runtime Error (SIGSEGV)
      case 8: // Runtime Error (SIGXFSZ)
      case 9: // Runtime Error (SIGFPE)
      case 10: // Runtime Error (SIGABRT)
      case 11: // Runtime Error (NZEC)
      case 12: // Runtime Error (Other)
        return 'runtime_error';
      case 13:
        return 'memory_limit_exceeded';
      case 14:
        return 'compilation_error'; // Exec Format Error
      default:
        return 'runtime_error';
    }
  }
}


