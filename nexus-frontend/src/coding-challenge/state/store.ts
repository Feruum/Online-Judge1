import { create } from 'zustand';
import type { Language, TestCase, Problem } from '../types';

interface CodingChallengeState {
  language: Language;
  code: string;
  activeTestCaseId: string | null;
  testCases: TestCase[];
  problem: Problem | null;
  isExecuting: boolean;
  isSubmitting: boolean;
  setLanguage: (language: Language) => void;
  setCode: (code: string) => void;
  setActiveTestCase: (id: string) => void;
  addTestCase: () => void;
  updateTestCase: (id: string, updates: Partial<TestCase>) => void;
  setProblem: (problem: Problem) => void;
  setIsExecuting: (isExecuting: boolean) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  reset: () => void;
}

const defaultTestCases: TestCase[] = [
  { id: '1', input: '[1,2,2,1]', status: 'pending', expectedOutput: 'true', isHidden: false },
  { id: '2', input: '[1,2]', status: 'pending', expectedOutput: 'false', isHidden: false },
  { id: '3', input: '[1]', status: 'pending', expectedOutput: 'true', isHidden: false },
];

export const useCodingChallengeStore = create<CodingChallengeState>((set) => ({
  language: 'python',
  code: '',
  activeTestCaseId: '1',
  testCases: defaultTestCases,
  problem: null,
  isExecuting: false,
  isSubmitting: false,
  setLanguage: (language) => {
    set({ language });
    // Update code when language changes if problem is loaded
    const state = useCodingChallengeStore.getState();
    if (state.problem) {
      const starterCode = state.problem.starterCode[language] || '';
      set({ code: starterCode });
    }
  },
  setCode: (code) => set({ code }),
  setActiveTestCase: (id) => set({ activeTestCaseId: id }),
  addTestCase: () => {
    const newId = String(Date.now());
    set((state) => ({
      testCases: [
        ...state.testCases,
        {
          id: newId,
          input: '',
          status: 'pending',
          expectedOutput: '',
          isHidden: false,
        },
      ],
      activeTestCaseId: newId,
    }));
  },
  updateTestCase: (id, updates) =>
    set((state) => ({
      testCases: state.testCases.map((tc) => (tc.id === id ? { ...tc, ...updates } : tc)),
    })),
  setProblem: (problem) => {
    set((state) => {
      const starterCode =
        problem.starterCode[state.language] ||
        problem.starterCode.python ||
        problem.starterCode.cpp ||
        '';

      // Load test cases from problem data
      const problemTestCases: TestCase[] = (problem.testCases || []).map((tc: any, index: number) => ({
        id: String(index + 1),
        input: tc.input || '',
        expectedOutput: tc.expectedOutput || tc.output || '',
        status: 'pending' as const,
        isHidden: tc.isHidden || false,
      }));

      // Use problem test cases if available, otherwise use defaults
      const testCases = problemTestCases.length > 0 ? problemTestCases : defaultTestCases;

      return {
        problem,
        code: starterCode,
        testCases,
        activeTestCaseId: testCases[0]?.id || '1',
      };
    });
  },
  setIsExecuting: (isExecuting) => set({ isExecuting }),
  setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
  reset: () =>
    set({
      language: 'python',
      code: '',
      activeTestCaseId: '1',
      testCases: defaultTestCases,
      isExecuting: false,
      isSubmitting: false,
    }),
}));
