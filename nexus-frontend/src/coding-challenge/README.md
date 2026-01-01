# Coding Challenge Module

A LeetCode-style coding challenge interface built with React, TypeScript, and Monaco Editor.

## Features

- **Left Sidebar**: Navigation, user profile, and status indicators
- **Problem Panel**: Problem description, examples, constraints, and related topics
- **Code Editor**: Monaco Editor with syntax highlighting, multiple language support (JavaScript, Python, Java)
- **Testcase Panel**: Multiple test cases with input/output display and execution results

## Usage

```tsx
import { CodingChallengePage } from '@/coding-challenge';

function App() {
  return <CodingChallengePage />;
}
```

## Architecture

- **Types**: Domain models and TypeScript interfaces (`types/index.ts`)
- **Services**: Mock services for problem fetching, code execution, and submission
- **State**: Zustand store for managing application state
- **Components**: Modular React components for each section

## State Management

The module uses Zustand for state management. Access the store:

```tsx
import { useCodingChallengeStore } from '@/coding-challenge';

const { language, code, setLanguage, setCode } = useCodingChallengeStore();
```

## Mock Services

All backend interactions are mocked:
- `getProblem(id)`: Fetches problem data
- `executeCode(code, language, input)`: Simulates code execution
- `submitSolution(code, language)`: Simulates solution submission

Replace these with real API calls when integrating with a backend.







