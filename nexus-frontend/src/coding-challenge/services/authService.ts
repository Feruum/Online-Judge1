import { apiClient } from './apiClient';

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  role: 'user' | 'admin';
}

export async function login(username: string, password: string): Promise<{ token: string; user: AuthUser }> {
  try {
    const response = await apiClient.login(username, password);
    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    throw new Error(error.response?.data?.message || 'Login failed');
  }
}

export async function register(
  username: string,
  email: string,
  password: string
): Promise<{ token: string; user: AuthUser }> {
  try {
    const response = await apiClient.register(username, email, password);
    return response;
  } catch (error: any) {
    console.error('Registration error:', error);
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
}

export function logout() {
  apiClient.clearToken();
}

export function isAuthenticated(): boolean {
  return !!apiClient['token'] || !!localStorage.getItem('auth_token');
}







