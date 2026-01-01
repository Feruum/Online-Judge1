import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../coding-challenge/services/apiClient';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
    User,
    Bookmark,
    Heart,
    Code2,
    CheckCircle,
    XCircle,
    Clock,
    ArrowLeft
} from 'lucide-react';

interface Submission {
    id: number;
    problemId: number;
    status: string;
    language: string;
    createdAt: string;
}

export function ProfilePage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [savedProblems, setSavedProblems] = useState<number[]>([]);
    const [likedProblems, setLikedProblems] = useState<number[]>([]);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            // Load user submissions
            const subs = await apiClient.getSubmissions();
            setSubmissions(subs);

            // Load saved/liked from localStorage (temporary until backend supports it)
            const saved = JSON.parse(localStorage.getItem('savedProblems') || '[]');
            const liked = JSON.parse(localStorage.getItem('likedProblems') || '[]');
            setSavedProblems(saved);
            setLikedProblems(liked);
        } catch (error) {
            console.error('Failed to load user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'accepted':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'wrong_answer':
                return <XCircle className="w-4 h-4 text-red-500" />;
            case 'pending':
            case 'running':
                return <Clock className="w-4 h-4 text-yellow-500" />;
            default:
                return <XCircle className="w-4 h-4 text-red-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'accepted':
                return 'bg-green-500/20 text-green-400 border-green-500/50';
            case 'wrong_answer':
                return 'bg-red-500/20 text-red-400 border-red-500/50';
            case 'pending':
            case 'running':
                return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
            default:
                return 'bg-red-500/20 text-red-400 border-red-500/50';
        }
    };

    // Stats
    const acceptedCount = submissions.filter(s => s.status === 'accepted').length;
    const totalSubmissions = submissions.length;
    const uniqueProblemsCount = new Set(submissions.filter(s => s.status === 'accepted').map(s => s.problemId)).size;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="text-muted-foreground">Loading profile...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Header */}
            <div className="border-b border-border bg-card">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" onClick={() => navigate('/problems')}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                        <h1 className="text-2xl font-bold">My Profile</h1>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8 max-w-4xl">
                {/* User Info Card */}
                <Card className="mb-8">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                                <User className="w-10 h-10 text-primary" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold">{user?.username || 'Guest'}</h2>
                                <Badge variant="outline" className="mt-1">
                                    {user?.role === 'admin' ? 'Admin' : 'Member'}
                                </Badge>
                            </div>
                            <div className="flex gap-8 text-center">
                                <div>
                                    <div className="text-3xl font-bold text-primary">{uniqueProblemsCount}</div>
                                    <div className="text-sm text-muted-foreground">Problems Solved</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-green-500">{acceptedCount}</div>
                                    <div className="text-sm text-muted-foreground">Accepted</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-muted-foreground">{totalSubmissions}</div>
                                    <div className="text-sm text-muted-foreground">Submissions</div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabs */}
                <Tabs defaultValue="submissions" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="submissions" className="flex items-center gap-2">
                            <Code2 className="w-4 h-4" />
                            Submissions
                        </TabsTrigger>
                        <TabsTrigger value="saved" className="flex items-center gap-2">
                            <Bookmark className="w-4 h-4" />
                            Saved ({savedProblems.length})
                        </TabsTrigger>
                        <TabsTrigger value="liked" className="flex items-center gap-2">
                            <Heart className="w-4 h-4" />
                            Liked ({likedProblems.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="submissions" className="mt-6">
                        {submissions.length === 0 ? (
                            <Card>
                                <CardContent className="p-8 text-center text-muted-foreground">
                                    <Code2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>No submissions yet. Start solving problems!</p>
                                    <Button className="mt-4" onClick={() => navigate('/problems')}>
                                        Browse Problems
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-3">
                                {submissions.map(submission => (
                                    <Card
                                        key={submission.id}
                                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                                        onClick={() => navigate(`/problems/${submission.problemId}`)}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    {getStatusIcon(submission.status)}
                                                    <span className="font-medium">Problem #{submission.problemId}</span>
                                                    <Badge className={getStatusColor(submission.status)}>
                                                        {submission.status.replace('_', ' ')}
                                                    </Badge>
                                                    <Badge variant="outline">{submission.language}</Badge>
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {new Date(submission.createdAt).toLocaleString()}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="saved" className="mt-6">
                        {savedProblems.length === 0 ? (
                            <Card>
                                <CardContent className="p-8 text-center text-muted-foreground">
                                    <Bookmark className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>No saved problems yet.</p>
                                    <p className="text-sm mt-2">Click the bookmark icon on any problem to save it!</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-3">
                                {savedProblems.map(problemId => (
                                    <Card
                                        key={problemId}
                                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                                        onClick={() => navigate(`/problems/${problemId}`)}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-3">
                                                <Bookmark className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                                <span className="font-medium">Problem #{problemId}</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="liked" className="mt-6">
                        {likedProblems.length === 0 ? (
                            <Card>
                                <CardContent className="p-8 text-center text-muted-foreground">
                                    <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>No liked problems yet.</p>
                                    <p className="text-sm mt-2">Click the heart icon on any problem to like it!</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-3">
                                {likedProblems.map(problemId => (
                                    <Card
                                        key={problemId}
                                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                                        onClick={() => navigate(`/problems/${problemId}`)}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-3">
                                                <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                                                <span className="font-medium">Problem #{problemId}</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
