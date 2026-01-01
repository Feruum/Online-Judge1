import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 15000, // 15 second timeout to prevent infinite loading
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.code === 'ECONNABORTED') {
          console.error('Request timeout - server may be unreachable');
          throw new Error('Request timeout. Please check your connection.');
        }
        if (!error.response) {
          console.error('Network error - no response received');
          throw new Error('Network error. Server may be down.');
        }
        throw error;
      }
    );

    // Load token from localStorage on init
    this.loadToken();
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  loadToken() {
    const stored = localStorage.getItem('auth_token');
    if (stored) {
      this.token = stored;
    }
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  // Problems API
  async getProblems() {
    const response = await this.client.get('/problems');
    return response.data;
  }

  async getProblem(id: number) {
    const response = await this.client.get(`/problems/${id}`);
    return response.data;
  }

  async createProblem(data: any) {
    const response = await this.client.post('/problems', data);
    return response.data;
  }

  // Submissions API
  async createSubmission(data: { problemId: number; code: string; language: string }) {
    const response = await this.client.post('/submissions', data);
    return response.data;
  }

  async getSubmissions() {
    const response = await this.client.get('/submissions');
    return response.data;
  }

  async getSubmission(id: number) {
    const response = await this.client.get(`/submissions/${id}`);
    return response.data;
  }

  // Auth API (if needed)
  async login(username: string, password: string) {
    const response = await this.client.post('/auth/login', {
      username,
      password,
    });
    if (response.data.token) {
      this.setToken(response.data.token);
    }
    return response.data;
  }

  async register(username: string, email: string, password: string) {
    const response = await this.client.post('/auth/register', {
      username,
      email,
      password,
    });
    if (response.data.token) {
      this.setToken(response.data.token);
    }
    return response.data;
  }

  // Discussions API
  async getDiscussions(problemId: number) {
    const response = await this.client.get(`/discussions/problems/${problemId}`);
    return response.data;
  }

  async createDiscussion(data: {
    problemId: number;
    title: string;
    content: string;
    parentId?: number;
  }) {
    const response = await this.client.post('/discussions', data);
    return response.data;
  }

  async voteOnDiscussion(discussionId: number, voteType: number) {
    const response = await this.client.post(`/discussions/${discussionId}/vote`, { voteType });
    return response.data;
  }

  async markDiscussionAsAnswer(discussionId: number) {
    const response = await this.client.put(`/discussions/${discussionId}/mark-answer`);
    return response.data;
  }

  // Votes API
  async voteOnSolution(data: { submissionId: number; voteType: 'best_practice' | 'clever' }) {
    const response = await this.client.post('/votes', data);
    return response.data;
  }

  async getTopSolutions(problemId: number) {
    const response = await this.client.get(`/votes/problems/${problemId}/top-solutions`);
    return response.data;
  }

  async markAsTopSolution(submissionId: number, voteType: 'best_practice' | 'clever') {
    const response = await this.client.post('/votes/mark-top-solution', { submissionId, voteType });
    return response.data;
  }
}

export const apiClient = new ApiClient();
