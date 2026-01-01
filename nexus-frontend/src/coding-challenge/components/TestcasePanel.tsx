import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useCodingChallengeStore } from '../state/store';
import { cn } from '@/lib/utils';

export function TestcasePanel() {
  const {
    testCases,
    activeTestCaseId,
    setActiveTestCase,
    addTestCase,
    updateTestCase
  } = useCodingChallengeStore();


  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'passed':
        return 'text-green-400';
      case 'failed':
        return 'text-red-400';
      case 'running':
        return 'text-yellow-400';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="h-64 border-t border-border bg-card/50 backdrop-blur-sm flex flex-col">
      <Tabs value={activeTestCaseId || '1'} onValueChange={setActiveTestCase} className="flex-1 flex flex-col">
        <div className="flex items-center justify-between px-4 pt-3 border-b border-border">
          <TabsList className="bg-transparent h-auto p-0 gap-1">
            {testCases.map((testCase, idx) => (
              <TabsTrigger
                key={testCase.id}
                value={testCase.id}
                className={cn(
                  'px-3 py-1.5 text-sm data-[state=active]:bg-primary/10 data-[state=active]:text-primary',
                  getStatusColor(testCase.status)
                )}
              >
                Case {idx + 1}
              </TabsTrigger>
            ))}
          </TabsList>
          <Button
            variant="ghost"
            size="sm"
            onClick={addTestCase}
            className="gap-2 text-xs"
          >
            <Plus className="w-4 h-4" />
            Add Testcase
          </Button>
        </div>

        {testCases.map((testCase) => (
          <TabsContent
            key={testCase.id}
            value={testCase.id}
            className="flex-1 flex flex-col m-0 p-4 space-y-4 overflow-y-auto"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Input:
              </label>
              <textarea
                value={testCase.input}
                onChange={(e) =>
                  updateTestCase(testCase.id, { input: e.target.value })
                }
                className="w-full h-20 px-3 py-2 rounded-md border border-input bg-background text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter test case input..."
              />
            </div>

            {testCase.actualOutput && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Output:
                </label>
                <div
                  className={cn(
                    'w-full min-h-16 px-3 py-2 rounded-md border bg-background text-sm font-mono',
                    testCase.status === 'passed'
                      ? 'border-green-500/50 text-green-400'
                      : testCase.status === 'failed'
                      ? 'border-red-500/50 text-red-400'
                      : 'border-input text-foreground'
                  )}
                >
                  {testCase.actualOutput}
                </div>
              </div>
            )}

            {testCase.status === 'running' && (
              <div className="flex items-center gap-2 text-sm text-yellow-400">
                <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                Running...
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

