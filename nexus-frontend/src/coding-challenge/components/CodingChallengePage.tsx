import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { LeftSidebar } from './LeftSidebar';
import { ProblemPanel } from './ProblemPanel';
import { CodeEditorPanel } from './CodeEditorPanel';
import { TestcasePanel } from './TestcasePanel';
import { useCodingChallengeStore } from '../state/store';
import { getProblem } from '../services/problemService';

export function CodingChallengePage() {
  const { id } = useParams<{ id: string }>();
  const { problem, setProblem } = useCodingChallengeStore();

  useEffect(() => {
    if (id) {
      getProblem(parseInt(id)).then(setProblem);
    }
  }, [id, setProblem]);

  if (!problem) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading problem...</div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex bg-background text-foreground overflow-hidden">
      {/* Left Sidebar */}
      <LeftSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex overflow-hidden">
          {/* Problem Panel */}
          <div className="w-1/3 border-r border-border overflow-hidden">
            <ProblemPanel problem={problem} />
          </div>

          {/* Code Editor Panel */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <CodeEditorPanel />
          </div>
        </div>

        {/* Testcase Panel */}
        <TestcasePanel />
      </div>
    </div>
  );
}
