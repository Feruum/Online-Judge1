import { apiClient } from './apiClient';
import type { Problem, Language } from '../types';

// Функция для нормализации данных проблемы
function normalizeProblem(problem: any): Problem {
  return {
    ...problem,
    examples: Array.isArray(problem.examples) ? problem.examples : [],
    constraints: Array.isArray(problem.constraints) ? problem.constraints : [],
    tags: Array.isArray(problem.tags) ? problem.tags : [],
    testCases: problem.testCases
      ? typeof problem.testCases === 'string'
        ? JSON.parse(problem.testCases)
        : problem.testCases
      : [],
    starterCode: problem.starterCode || {
      python: '# Your code here',
      cpp: '// Your code here',
    },
  };
}

export async function getAllProblems(): Promise<Problem[]> {
  try {
    const response = await apiClient.getProblems();
    // Нормализуем каждую проблему
    return response.map(normalizeProblem);
  } catch (error) {
    console.error('Failed to fetch problems:', error);
    throw new Error('Failed to load problems from server');
  }
}

export async function getProblem(id: number): Promise<Problem> {
  try {
    const response = await apiClient.getProblem(id);
    return normalizeProblem(response);
  } catch (error) {
    console.error('Failed to fetch problem:', error);
    throw new Error('Failed to load problem from server');
  }
}

export function getBackendLanguage(language: Language): string {
  const languageMap: Record<Language, string> = {
    python: 'python',
    cpp: 'cpp',
  };

  return languageMap[language] || language;
}
