// Mock the database before any imports
const mockDb = {
  select: jest.fn(),
  insert: jest.fn(),
  from: jest.fn(),
  where: jest.fn(),
  values: jest.fn(),
  returning: jest.fn(),
  limit: jest.fn(),
};

jest.mock('../database/database.config', () => ({
  db: mockDb,
}));

import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        passwordHash: 'hashedpassword',
        role: 'user' as const,
      };

      // Mock database calls - no existing user
      mockDb.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([]), // No existing user
          }),
        }),
      });

      mockDb.insert.mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([mockUser]),
        }),
      });

      (jwtService.sign as jest.Mock).mockReturnValue('mock-jwt-token');

      const result = await service.register({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(result.user.username).toBe('testuser');
    });

    it('should throw error if username already exists', async () => {
      // Mock database calls - existing user found
      mockDb.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([{ id: 1 }]), // Existing user
          }),
        }),
      });

      await expect(
        service.register({
          username: 'existinguser',
          email: 'test@example.com',
          password: 'password123',
        })
      ).rejects.toThrow('Username already exists');
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        passwordHash: '$2b$10$hashedpassword',
        role: 'user' as const,
      };

      // Mock database calls - user found
      mockDb.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([mockUser]),
          }),
        }),
      });

      (jwtService.sign as jest.Mock).mockReturnValue('mock-jwt-token');

      const result = await service.login({
        username: 'testuser',
        password: 'password123',
      });

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
    });

    it('should throw error for invalid credentials', async () => {
      // Mock database calls - no user found
      mockDb.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([]), // No user found
          }),
        }),
      });

      await expect(
        service.login({
          username: 'nonexistent',
          password: 'password123',
        })
      ).rejects.toThrow('Invalid credentials');
    });
  });
});
