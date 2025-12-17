import { Test, TestingModule } from '@nestjs/testing';
import { JudgeService } from './judge.service';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('JudgeService', () => {
  let service: JudgeService;

  beforeEach(async () => {
    // Clear all mocks
    jest.clearAllMocks();

    // Mock axios before creating the module
    const mockAxiosInstance = {
      post: jest.fn(),
      get: jest.fn(),
    };

    mockedAxios.create.mockReturnValue(mockAxiosInstance as any);

    const module: TestingModule = await Test.createTestingModule({
      providers: [JudgeService],
    }).compile();

    service = module.get<JudgeService>(JudgeService);

    // Mock environment variable
    process.env.JUDGE0_URL = 'http://localhost:2358';
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('submitCode', () => {
    it('should submit code successfully', async () => {
      const mockResponse = {
        data: { token: 'test-token-123' },
      };

      (mockedAxios.create().post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await service.submitCode({
        source_code: 'print("Hello World")',
        language_id: 71,
      });

      expect(result).toBe('test-token-123');
      expect(mockedAxios.create().post).toHaveBeenCalledWith('/submissions', {
        source_code: 'print("Hello World")',
        language_id: 71,
      }, {
        params: {
          base64_encoded: false,
          wait: false,
        },
      });
    });

    it('should handle submission errors', async () => {
      const mockError = new Error('Network error');
      (mockedAxios.create().post as jest.Mock).mockRejectedValue(mockError);

      await expect(
        service.submitCode({
          source_code: 'invalid code',
          language_id: 71,
        }),
      ).rejects.toThrow('Judge0 submission failed');
    });
  });

  describe('getSubmissionResult', () => {
    it('should get submission result successfully', async () => {
      const mockResponse = {
        data: {
          stdout: 'Hello World\n',
          stderr: '',
          status: { id: 3, description: 'Accepted' },
          time: '0.1',
          memory: 1234,
          token: 'test-token-123',
        },
      };

      (mockedAxios.create().get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await service.getSubmissionResult('test-token-123');

      expect(result.stdout).toBe('Hello World\n');
      expect(result.status.id).toBe(3);
      expect(result).not.toHaveProperty('token');
      expect(mockedAxios.create().get).toHaveBeenCalledWith('/submissions/test-token-123', {
        params: {
          base64_encoded: false,
        },
      });
    });
  });

  describe('getLanguageId', () => {
    it('should return correct language IDs', () => {
      expect(service.getLanguageId('cpp')).toBe(54);
      expect(service.getLanguageId('python')).toBe(71);
      expect(service.getLanguageId('C++')).toBe(54);
      expect(service.getLanguageId('Python')).toBe(71);
    });

    it('should throw error for unsupported language', () => {
      expect(() => service.getLanguageId('javascript')).toThrow('Unsupported language');
    });
  });

  describe('isSubmissionComplete', () => {
    it('should check completion status correctly', () => {
      expect(service.isSubmissionComplete({ id: 1, description: 'In Queue' })).toBe(false);
      expect(service.isSubmissionComplete({ id: 2, description: 'Processing' })).toBe(false);
      expect(service.isSubmissionComplete({ id: 3, description: 'Accepted' })).toBe(true);
      expect(service.isSubmissionComplete({ id: 4, description: 'Wrong Answer' })).toBe(true);
    });
  });

  describe('isAccepted', () => {
    it('should check acceptance correctly', () => {
      expect(service.isAccepted({ status: { id: 3 } } as any)).toBe(true);
      expect(service.isAccepted({ status: { id: 4 } } as any)).toBe(false);
    });
  });
});
