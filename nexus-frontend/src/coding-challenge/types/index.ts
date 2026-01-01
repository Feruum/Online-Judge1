export interface Problem {
  id: number;
  title: string;
  difficulty: string;
  description: string;
  slug?: string;
  examples?:
    | {
        input: string;
        output: string;
        explanation?: string;
      }[]
    | null;
  testCases?: any;
  constraints?: string[] | null;
  starterCode?: any;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Submission {
  id: number;
  problemId: number;
  userId: number;
  code: string;
  language: string;
  status:
    | 'pending'
    | 'running'
    | 'accepted'
    | 'wrong_answer'
    | 'time_limit_exceeded'
    | 'memory_limit_exceeded'
    | 'compilation_error'
    | 'runtime_error';
  executionTime?: number;
  memoryUsage?: number;
  testCasesPassed?: number;
  totalTestCases?: number;
  submittedAt: string;
  errorMessage?: string;
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput?: string;
  isHidden?: boolean;
  status?: 'pending' | 'running' | 'passed' | 'failed';
  actualOutput?: string;
}

export interface ExecutionResult {
  success: boolean;
  output?: string;
  error?: string;
  executionTime?: number;
}

export interface SubmissionResult {
  success: boolean;
  message: string;
  passedTestCases?: number;
  totalTestCases?: number;
}

export type Language = 'python' | 'cpp';
