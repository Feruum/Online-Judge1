import { apiClient } from './apiClient';
import { getBackendLanguage } from './problemService';
import type { ExecutionResult, SubmissionResult, Language } from '../types';

// Poll submission status until completion
async function pollSubmissionStatus(
  submissionId: number,
  maxAttempts: number = 30,
  intervalMs: number = 1000
): Promise<any> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const submission = await apiClient.getSubmission(submissionId);
      
      // Check if submission is complete
      const status = submission.status;
      if (
        status !== 'pending' &&
        status !== 'running'
      ) {
        return submission;
      }

      // Wait before next poll
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    } catch (error) {
      console.error('Error polling submission:', error);
      throw error;
    }
  }

  throw new Error('Submission polling timeout');
}

export async function executeCode(
  code: string,
  language: Language,
  _input: string,
  problemId: number
): Promise<ExecutionResult> {
  try {
    const backendLanguage = getBackendLanguage(language);
    
    // Create a temporary submission for testing
    // Note: Backend expects problemId, but for testing we might need to handle this differently
    // For now, we'll create a submission and poll it
    
    const submission = await apiClient.createSubmission({
      problemId,
      code,
      language: backendLanguage,
    });

    // Poll for result
    const result = await pollSubmissionStatus(submission.id, 30, 1000);

    const status = result.status;
    const isSuccess = status === 'accepted';

    return {
      success: isSuccess,
      output: isSuccess ? 'Test passed' : getStatusMessage(status),
      error: !isSuccess ? getStatusMessage(status) : undefined,
      executionTime: undefined,
    };
  } catch (error: any) {
    console.error('Execution error:', error);
    return {
      success: false,
      error: error.message || 'Execution failed',
    };
  }
}

export async function submitSolution(
  code: string,
  language: Language,
  problemId: number
): Promise<SubmissionResult> {
  try {
    const backendLanguage = getBackendLanguage(language);

    const submission = await apiClient.createSubmission({
      problemId,
      code,
      language: backendLanguage,
    });

    // Poll for final result
    const result = await pollSubmissionStatus(submission.id, 60, 2000);

    const status = result.status;
    const isAccepted = status === 'accepted';

    // Get test cases count from problem (we'll need to fetch it)
    // For now, we'll use a default value
    const totalTestCases = 3; // This should come from the problem

    return {
      success: isAccepted,
      message: isAccepted ? 'Accepted' : getStatusMessage(status),
      passedTestCases: isAccepted ? totalTestCases : 0,
      totalTestCases,
    };
  } catch (error: any) {
    console.error('Submission error:', error);
    return {
      success: false,
      message: error.message || 'Submission failed',
    };
  }
}

function getStatusMessage(status: string): string {
  const statusMap: Record<string, string> = {
    accepted: 'Accepted',
    wrong_answer: 'Wrong Answer',
    time_limit_exceeded: 'Time Limit Exceeded',
    memory_limit_exceeded: 'Memory Limit Exceeded',
    compilation_error: 'Compilation Error',
    runtime_error: 'Runtime Error',
    pending: 'Pending',
    running: 'Running',
  };

  return statusMap[status] || 'Unknown Error';
}

