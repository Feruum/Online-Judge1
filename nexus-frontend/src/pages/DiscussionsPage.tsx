import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../coding-challenge/services/apiClient';
import { useAuth } from '../context/AuthContext';
import { SolutionsVoting } from '../components/SolutionsVoting';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ArrowUp, ArrowDown, MessageSquare, CheckCircle, Trophy } from 'lucide-react';

interface Discussion {
  id: number;
  title: string;
  content: string;
  parentId?: number;
  votes: number;
  isAnswer: boolean;
  createdAt: string;
  userId: number;
}

export function DiscussionsPage() {
  const { problemId } = useParams<{ problemId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewDiscussion, setShowNewDiscussion] = useState(false);
  const [newDiscussion, setNewDiscussion] = useState({ title: '', content: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!problemId) return;
    loadDiscussions();
  }, [problemId]);

  const loadDiscussions = async () => {
    try {
      const data = await apiClient.getDiscussions(parseInt(problemId!));
      setDiscussions(data);
    } catch (error) {
      console.error('Failed to load discussions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDiscussion = async () => {
    if (!newDiscussion.title.trim() || !newDiscussion.content.trim()) return;

    setSubmitting(true);
    try {
      await apiClient.createDiscussion({
        problemId: parseInt(problemId!),
        title: newDiscussion.title,
        content: newDiscussion.content,
      });
      setNewDiscussion({ title: '', content: '' });
      setShowNewDiscussion(false);
      loadDiscussions();
    } catch (error) {
      console.error('Failed to create discussion:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async (discussionId: number, voteType: number) => {
    try {
      await apiClient.voteOnDiscussion(discussionId, voteType);
      loadDiscussions();
    } catch (error) {
      console.error('Failed to vote:', error);
    }
  };

  const handleMarkAsAnswer = async (discussionId: number) => {
    try {
      await apiClient.markDiscussionAsAnswer(discussionId);
      loadDiscussions();
    } catch (error) {
      console.error('Failed to mark as answer:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading discussions...</div>;
  }

  const mainDiscussions = discussions.filter(d => !d.parentId);
  const replies = discussions.filter(d => d.parentId);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Problem #{problemId} - Discuss</h1>
        <Button onClick={() => navigate(`/problems/${problemId}`)}>
          Back to Problem
        </Button>
      </div>

      <Tabs defaultValue="discussions" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="discussions" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Discussions
          </TabsTrigger>
          <TabsTrigger value="solutions" className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Top Solutions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="discussions" className="space-y-6">
          <div className="mb-6">
            {!showNewDiscussion ? (
              <Button onClick={() => setShowNewDiscussion(true)}>
                <MessageSquare className="w-4 h-4 mr-2" />
                Start New Discussion
              </Button>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>New Discussion</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Discussion title..."
                    value={newDiscussion.title}
                    onChange={(e) => setNewDiscussion(prev => ({ ...prev, title: e.target.value }))}
                  />
                  <Textarea
                    placeholder="What would you like to discuss?"
                    value={newDiscussion.content}
                    onChange={(e) => setNewDiscussion(prev => ({ ...prev, content: e.target.value }))}
                    rows={4}
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleCreateDiscussion}
                      disabled={submitting || !newDiscussion.title.trim() || !newDiscussion.content.trim()}
                    >
                      {submitting ? 'Posting...' : 'Post Discussion'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowNewDiscussion(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-4">
            {mainDiscussions.map(discussion => (
              <Card key={discussion.id} className={discussion.isAnswer ? 'border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/20' : ''}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Voting buttons */}
                    <div className="flex flex-col items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVote(discussion.id, 1)}
                        className="p-1"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <span className="font-semibold">{discussion.votes}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVote(discussion.id, -1)}
                        className="p-1"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Discussion content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{discussion.title}</h3>
                        {discussion.isAnswer && (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        )}
                      </div>
                      <p className="text-foreground/80 mb-2">{discussion.content}</p>
                      <div className="text-sm text-muted-foreground">
                        Posted by User #{discussion.userId} on {new Date(discussion.createdAt).toLocaleDateString()}
                      </div>
                      {user?.role === 'admin' && !discussion.isAnswer && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkAsAnswer(discussion.id)}
                          className="mt-2"
                        >
                          Mark as Answer
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {mainDiscussions.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  No discussions yet. Be the first to start a conversation!
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="solutions">
          <SolutionsVoting problemId={parseInt(problemId!)} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
