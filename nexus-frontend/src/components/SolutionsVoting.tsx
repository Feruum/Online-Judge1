import { useState, useEffect } from 'react';
import { apiClient } from '../coding-challenge/services/apiClient';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ThumbsUp, Code, Trophy, Star, Clock, Zap } from 'lucide-react';

interface Solution {
  id: number;
  code: string;
  language: string;
  votes: number;
  voteType: 'best_practice' | 'clever' | null;
  createdAt: string;
  userId: number;
  status: string;
}

interface SolutionsVotingProps {
  problemId: number;
}

export function SolutionsVoting({ problemId }: SolutionsVotingProps) {
  const { user } = useAuth();
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState<number | null>(null);
  const [expandedCode, setExpandedCode] = useState<number | null>(null);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    loadTopSolutions();
  }, [problemId]);

  const loadTopSolutions = async () => {
    try {
      const data = await apiClient.getTopSolutions(problemId);
      setSolutions(data);
    } catch (error) {
      console.error('Failed to load top solutions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (submissionId: number, voteType: 'best_practice' | 'clever') => {
    setVoting(submissionId);
    try {
      await apiClient.voteOnSolution({ submissionId, voteType });
      loadTopSolutions();
    } catch (error) {
      console.error('Failed to vote on solution:', error);
    } finally {
      setVoting(null);
    }
  };

  const handleMarkAsTop = async (submissionId: number, voteType: 'best_practice' | 'clever') => {
    setVoting(submissionId);
    try {
      await apiClient.markAsTopSolution(submissionId, voteType);
      loadTopSolutions();
    } catch (error) {
      console.error('Failed to mark as top solution:', error);
    } finally {
      setVoting(null);
    }
  };

  const getLanguageColor = (language: string) => {
    switch (language.toLowerCase()) {
      case 'python': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'cpp':
      case 'c++': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'javascript': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) {
    return <div className="text-center p-4 text-muted-foreground">Loading top solutions...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Trophy className="w-5 h-5 text-yellow-500" />
        <h2 className="text-xl font-semibold">Top Solutions</h2>
        {isAdmin && (
          <Badge variant="outline" className="ml-2 text-primary border-primary">
            Admin View
          </Badge>
        )}
      </div>

      {solutions.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            No solutions available yet. Solve the problem first to see top solutions!
          </CardContent>
        </Card>
      ) : (
        solutions.map((solution, index) => (
          <Card key={solution.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500/20 text-yellow-500 font-bold">
                    {index + 1}
                  </div>
                  <Badge className={getLanguageColor(solution.language)}>
                    {solution.language}
                  </Badge>
                  {solution.voteType && (
                    <Badge variant="secondary" className="ml-2">
                      <Star className="w-3 h-3 mr-1" />
                      {solution.voteType === 'best_practice' ? 'Best Practice' : 'Clever'}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <ThumbsUp className="w-4 h-4 text-muted-foreground" />
                  <span className="font-semibold">{solution.votes}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Code block with dark mode support */}
              <div
                className="bg-muted/50 p-4 rounded-lg mb-4 cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => setExpandedCode(expandedCode === solution.id ? null : solution.id)}
              >
                <pre className="text-sm overflow-x-auto">
                  <code className="text-foreground">
                    {expandedCode === solution.id
                      ? solution.code
                      : solution.code.length > 200
                        ? solution.code.substring(0, 200) + '...'
                        : solution.code}
                  </code>
                </pre>
                {solution.code.length > 200 && (
                  <div className="text-xs text-muted-foreground mt-2 text-center">
                    {expandedCode === solution.id ? 'Click to collapse' : 'Click to expand'}
                  </div>
                )}
              </div>

              {/* Stats row */}
              <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(solution.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="w-4 h-4 text-green-500" />
                  <span className="text-green-500">{solution.status}</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  By User #{solution.userId}
                </div>

                <div className="flex gap-2 flex-wrap">
                  {/* Regular user voting */}
                  {!isAdmin && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVote(solution.id, 'best_practice')}
                        disabled={voting === solution.id}
                        className="flex items-center gap-1"
                      >
                        <ThumbsUp className="w-3 h-3" />
                        Best Practice
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVote(solution.id, 'clever')}
                        disabled={voting === solution.id}
                        className="flex items-center gap-1"
                      >
                        <Code className="w-3 h-3" />
                        Clever
                      </Button>
                    </>
                  )}

                  {/* Admin actions */}
                  {isAdmin && (
                    <>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleMarkAsTop(solution.id, 'best_practice')}
                        disabled={voting === solution.id}
                        className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
                      >
                        <Star className="w-3 h-3" />
                        Mark Best Practice
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleMarkAsTop(solution.id, 'clever')}
                        disabled={voting === solution.id}
                        className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700"
                      >
                        <Zap className="w-3 h-3" />
                        Mark Clever
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
