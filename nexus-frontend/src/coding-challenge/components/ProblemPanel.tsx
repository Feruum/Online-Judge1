import { useState, useEffect } from 'react';
import { Heart, Bookmark, Share2, Lightbulb, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Problem } from '../types';
import { cn } from '@/lib/utils';

interface ProblemPanelProps {
  problem: Problem;
}

export function ProblemPanel({ problem }: ProblemPanelProps) {
  const [showHint, setShowHint] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(12400);

  // Load like/save state from localStorage
  useEffect(() => {
    const likedProblems = JSON.parse(localStorage.getItem('likedProblems') || '[]');
    const savedProblems = JSON.parse(localStorage.getItem('savedProblems') || '[]');
    setIsLiked(likedProblems.includes(problem.id));
    setIsSaved(savedProblems.includes(problem.id));
  }, [problem.id]);

  const handleLike = () => {
    const likedProblems = JSON.parse(localStorage.getItem('likedProblems') || '[]');
    if (isLiked) {
      const updated = likedProblems.filter((id: number) => id !== problem.id);
      localStorage.setItem('likedProblems', JSON.stringify(updated));
      setLikeCount(prev => prev - 1);
    } else {
      likedProblems.push(problem.id);
      localStorage.setItem('likedProblems', JSON.stringify(likedProblems));
      setLikeCount(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleSave = () => {
    const savedProblems = JSON.parse(localStorage.getItem('savedProblems') || '[]');
    if (isSaved) {
      const updated = savedProblems.filter((id: number) => id !== problem.id);
      localStorage.setItem('savedProblems', JSON.stringify(updated));
    } else {
      savedProblems.push(problem.id);
      localStorage.setItem('savedProblems', JSON.stringify(savedProblems));
    }
    setIsSaved(!isSaved);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  const difficultyColors: Record<string, string> = {
    Easy: 'bg-green-500/20 text-green-400 border-green-500/50',
    Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    Hard: 'bg-red-500/20 text-red-400 border-red-500/50',
  };

  return (
    <div className="h-screen overflow-y-auto bg-background">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">
                {problem.id}. {problem.title}
              </h1>
              <Badge
                variant="outline"
                className={cn(
                  'w-fit',
                  difficultyColors[problem.difficulty] || difficultyColors.Easy
                )}
              >
                {problem.difficulty}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLike}
                className={cn(
                  "transition-colors",
                  isLiked ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-red-500"
                )}
              >
                <Heart className={cn("w-5 h-5", isLiked && "fill-current")} />
              </Button>
              <span className="text-sm text-muted-foreground">
                {likeCount >= 1000 ? `${(likeCount / 1000).toFixed(1)}K` : likeCount}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSave}
                className={cn(
                  "transition-colors",
                  isSaved ? "text-yellow-500 hover:text-yellow-600" : "text-muted-foreground hover:text-yellow-500"
                )}
              >
                <Bookmark className={cn("w-5 h-5", isSaved && "fill-current")} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleShare}
                className="text-muted-foreground hover:text-foreground"
              >
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="prose prose-invert max-w-none">
          <p className="text-foreground leading-relaxed">{problem.description}</p>
        </div>

        {/* Examples */}
        <div className="space-y-4">
          {/* ИСПРАВЛЕНИЕ 2: Используем опциональную цепочку (?.) или фоллбэк (|| []) */}
          {(problem.examples && Array.isArray(problem.examples) ? problem.examples : []).map(
            (example, idx) => (
              <Card key={idx} className="bg-card/50 backdrop-blur-sm">
                <CardContent className="p-4 space-y-3">
                  <div className="font-semibold text-sm">Example {idx + 1}:</div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Input: </span>
                      <code className="px-2 py-1 rounded bg-muted text-foreground">
                        {example.input}
                      </code>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Output: </span>
                      <code className="px-2 py-1 rounded bg-muted text-foreground">
                        {example.output}
                      </code>
                    </div>
                    {example.explanation && (
                      <div className="text-muted-foreground text-xs mt-2">
                        {example.explanation}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          )}
        </div>

        {/* Constraints */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm">Constraints:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            {/* ИСПРАВЛЕНИЕ 3: Аналогично для constraints */}
            {(problem.constraints && Array.isArray(problem.constraints)
              ? problem.constraints
              : []
            ).map((constraint, idx) => (
              <li key={idx}>{constraint}</li>
            ))}
          </ul>
        </div>

        {/* Related Topics */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm">Related Topics:</h3>
          <div className="flex flex-wrap gap-2">
            {(problem.tags && Array.isArray(problem.tags) ? problem.tags : [])
              .filter((topic) => topic != null)
              .map((topic, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {topic}
                </Badge>
              ))}
          </div>
        </div>

        {/* Hint */}
        <div className="pt-4 border-t border-border">
          <Button
            variant="ghost"
            onClick={() => setShowHint(!showHint)}
            className="w-full justify-start gap-2"
          >
            <Lightbulb className="w-4 h-4" />
            {showHint ? 'Hide Hint' : 'Show Hint'}
          </Button>
          {showHint && (
            <div className="mt-3 p-4 rounded-lg bg-muted/50 text-sm">
              <p className="text-muted-foreground">
                Try using two pointers approach. Reverse the second half of the linked list and
                compare with the first half.
              </p>
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="flex items-center gap-4 pt-4 border-t border-border">
          <Button variant="ghost" size="sm" className="gap-2">
            <Bookmark className="w-4 h-4" />
            Saved
          </Button>
          <Button variant="ghost" size="sm" className="gap-2">
            <FileText className="w-4 h-4" />
            History
          </Button>
        </div>
      </div>
    </div>
  );
}
