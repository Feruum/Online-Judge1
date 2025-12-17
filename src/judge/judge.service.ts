import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

export interface Judge0SubmissionRequest {
  source_code: string;
  language_id: number; // 54 for C++, 71 for Python
  stdin?: string;
  expected_output?: string;
}

export interface Judge0SubmissionResponse {
  token: string;
}

export interface Judge0Result {
  stdout?: string;
  stderr?: string;
  compile_output?: string;
  message?: string;
  exit_code?: number;
  exit_signal?: number;
  status: {
    id: number;
    description: string;
  };
  time?: string;
  memory?: number;
}

export interface Judge0SubmissionResult {
  stdout?: string;
  stderr?: string;
  compile_output?: string;
  message?: string;
  exit_code?: number;
  exit_signal?: number;
  status: {
    id: number;
    description: string;
  };
  time?: string;
  memory?: number;
  token: string;
}

@Injectable()
export class JudgeService {
  private readonly logger = new Logger(JudgeService.name);
  private readonly axiosInstance: AxiosInstance;
  private mockMode = false;

  constructor() {
    // Judge0 API endpoint - running in WSL
    // If localhost:2358 doesn't work, you may need to use the WSL IP address
    // Find WSL IP with: wsl hostname -I
    const judge0Url = process.env.JUDGE0_URL || 'http://localhost:2358';

    this.logger.log(`Initializing Judge0 client with URL: ${judge0Url}`);

    this.axiosInstance = axios.create({
      baseURL: judge0Url,
      timeout: 30000, // 30 seconds timeout
    });

    // For demo purposes, if Judge0 is not working, we'll simulate successful execution
    this.mockMode = process.env.JUDGE0_MOCK === 'true';
    this.logger.log(`JUDGE0_MOCK env var: ${process.env.JUDGE0_MOCK}, mockMode: ${this.mockMode}`);
    if (this.mockMode) {
      this.logger.warn('Running in MOCK mode - Judge0 integration disabled for demo');
    }
  }

  /**
   * Submit code to Judge0 for execution
   * @param request Submission request with source code and language
   * @returns Submission token
   */
  async submitCode(request: Judge0SubmissionRequest): Promise<string> {
    if (this.mockMode) {
      // Mock successful submission
      const mockToken = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      this.logger.log(`MOCK: Submitting code for language_id: ${request.language_id}, token: ${mockToken}`);
      return mockToken;
    }

    try {
      this.logger.debug(`Submitting code for language_id: ${request.language_id}`);

      const response = await this.axiosInstance.post('/submissions', request, {
        params: {
          base64_encoded: false,
          wait: false, // Don't wait for completion
        },
      });

      const data: Judge0SubmissionResponse = response.data;
      this.logger.debug(`Submission successful, token: ${data.token}`);

      return data.token;
    } catch (error) {
      this.logger.error(`Failed to submit code: ${error.message}`, error.stack);
      throw new Error(`Judge0 submission failed: ${error.message}`);
    }
  }

  /**
   * Get submission result from Judge0
   * @param token Submission token
   * @returns Submission result
   */
  async getSubmissionResult(token: string): Promise<Judge0Result> {
    if (this.mockMode) {
      // Mock successful execution result
      this.logger.log(`MOCK: Getting result for token: ${token}`);

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockResult: Judge0Result = {
        stdout: 'Hello World\n',
        stderr: '',
        compile_output: '',
        message: null,
        exit_code: 0,
        exit_signal: null,
        status: {
          id: 3, // Accepted
          description: 'Accepted'
        },
        time: '0.1',
        memory: 1024
      };

      this.logger.log(`MOCK: Result status: ${mockResult.status.description}`);
      return mockResult;
    }

    try {
      this.logger.debug(`Getting result for token: ${token}`);

      const response = await this.axiosInstance.get(`/submissions/${token}`, {
        params: {
          base64_encoded: false,
        },
      });

      const data: Judge0SubmissionResult = response.data;

      // Remove token from response as it's not part of the result
      const { token: _, ...result } = data;

      this.logger.debug(`Result status: ${result.status.description}`);

      return result;
    } catch (error) {
      this.logger.error(`Failed to get submission result: ${error.message}`, error.stack);
      throw new Error(`Judge0 result fetch failed: ${error.message}`);
    }
  }

  /**
   * Get language ID for a given language string
   * @param language Language string ('cpp', 'python')
   * @returns Judge0 language ID
   */
  getLanguageId(language: string): number {
    switch (language.toLowerCase()) {
      case 'cpp':
      case 'c++':
        return 54; // C++ (GCC 9.2.0)
      case 'python':
      case 'py':
        return 71; // Python (3.8.1)
      default:
        throw new Error(`Unsupported language: ${language}`);
    }
  }

  /**
   * Check if a submission status indicates completion
   * @param status Judge0 status object
   * @returns True if submission is complete
   */
  isSubmissionComplete(status: { id: number; description: string }): boolean {
    // Status IDs from Judge0:
    // 1: In Queue, 2: Processing, 3: Accepted, 4-13: Various error states
    return status.id >= 3;
  }

  /**
   * Check if submission was accepted (correct)
   * @param result Judge0 result
   * @returns True if submission was accepted
   */
  isAccepted(result: Judge0Result): boolean {
    return result.status.id === 3; // Accepted
  }
}