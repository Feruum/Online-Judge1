import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCodingChallengeStore } from '../state/store';
import type { Language } from '../types';
import { executeCode, submitSolution } from '../services/executionService';
import { Toast } from '@/components/ui/toast';

interface CodeEditorPanelProps {
  onExecute?: () => void;
  onSubmit?: () => void;
}

export function CodeEditorPanel({ onExecute, onSubmit }: CodeEditorPanelProps) {
  const {
    language,
    code,
    setLanguage,
    setCode,
    isExecuting,
    isSubmitting,
    setIsExecuting,
    setIsSubmitting,
    problem,
  } = useCodingChallengeStore();

  const [toast, setToast] = React.useState<{ message: string; type: 'success' | 'error' } | null>(
    null
  );
  const editorRef = useRef<any>(null);

  const languageOptions: { value: Language; label: string }[] = [
    { value: 'python', label: 'Python' },
    { value: 'cpp', label: 'C++' },
  ];

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    if (problem) {
      setCode(problem.starterCode[newLanguage] || '');
    }
  };

  const handleRun = async () => {
    if (!code.trim() || !problem) return;

    const activeTestCase = useCodingChallengeStore
      .getState()
      .testCases.find((tc) => tc.id === useCodingChallengeStore.getState().activeTestCaseId);

    if (!activeTestCase) return;

    setIsExecuting(true);
    onExecute?.();

    try {
      const result = await executeCode(code, language, activeTestCase.input, problem.id);

      useCodingChallengeStore.getState().updateTestCase(activeTestCase.id, {
        actualOutput: result?.output || result?.error || 'Unknown error',
        status: result?.success ? 'passed' : 'failed',
      });

      setToast({
        message: result.success ? 'Execution successful!' : 'Execution failed',
        type: result.success ? 'success' : 'error',
      });
    } catch (error) {
      setToast({
        message: 'Execution error occurred',
        type: 'error',
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSubmit = async () => {
    if (!code.trim() || !problem) return;

    setIsSubmitting(true);
    onSubmit?.();

    try {
      const result = await submitSolution(code, language, problem.id);

      setToast({
        message: result.success
          ? `Accepted! ${result.passedTestCases}/${result.totalTestCases} test cases passed`
          : `Wrong Answer. ${result.passedTestCases}/${result.totalTestCases} test cases passed`,
        type: result.success ? 'success' : 'error',
      });
    } catch (error) {
      setToast({
        message: 'Submission error occurred',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/50 backdrop-blur-sm">
        <Select value={language} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {languageOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRun}
            disabled={isExecuting || isSubmitting}
            className="gap-2"
          >
            <Play className="w-4 h-4" />
            {isExecuting ? 'Running...' : 'Run'}
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={isExecuting || isSubmitting}
            className="gap-2 bg-green-600 hover:bg-green-700"
          >
            <Send className="w-4 h-4" />
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 relative">
        <Editor
          height="100%"
          language={language === 'python' ? 'python' : 'cpp'}
          value={code}
          onChange={(value) => setCode(value || '')}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            wordWrap: 'on',
            padding: { top: 16, bottom: 16 },
          }}
        />
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-border bg-card/50 backdrop-blur-sm flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>Ln 14, Col 36</span>
          <span>Spaces: 4</span>
          <span>UTF-8</span>
        </div>
        <button className="hover:text-foreground transition-colors">Feedback</button>
      </div>

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
