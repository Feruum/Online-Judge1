import type { ExecutionResult, SubmissionResult } from '../types';

export async function executeCode(
  _code: string,
  _language: string,
  _input: string
): Promise<ExecutionResult> {
  await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

  const shouldSucceed = Math.random() > 0.3;

  if (shouldSucceed) {
    return {
      success: true,
      output: 'true',
      executionTime: Math.floor(Math.random() * 100) + 10
    };
  } else {
    return {
      success: false,
      error: 'Runtime Error: Time limit exceeded',
      executionTime: Math.floor(Math.random() * 100) + 10
    };
  }
}

export async function submitSolution(
  _code: string,
  _language: string
): Promise<SubmissionResult> {
  await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000));

  const shouldSucceed = Math.random() > 0.4;

  if (shouldSucceed) {
    return {
      success: true,
      message: 'Accepted',
      passedTestCases: 3,
      totalTestCases: 3
    };
  } else {
    const passed = Math.floor(Math.random() * 2) + 1;
    return {
      success: false,
      message: 'Wrong Answer',
      passedTestCases: passed,
      totalTestCases: 3
    };
  }
}

