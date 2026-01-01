import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from '../components/ThemeToggle';

import { getAllProblems } from '../coding-challenge/services/problemService';
import type { Problem } from '../coding-challenge/types';
import { Code2, LogOut, Search, Loader2, AlertCircle } from 'lucide-react';

export function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadProblems();
  }, []);

  const loadProblems = async () => {
    try {
      setLoading(true);
      const data = await getAllProblems();
      setProblems(data);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load problems');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredProblems = problems.filter((problem) =>
    problem.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-500/20 text-green-300 border-green-500/50';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
      case 'hard':
        return 'bg-red-500/20 text-red-300 border-red-500/50';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <header className="bg-card/50 backdrop-blur-lg border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary/20 rounded-lg">
                <Code2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Online Judge</h1>
                <p className="text-xs text-muted-foreground">Solve. Learn. Compete.</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-foreground">{user?.username}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              {user?.role === 'admin' && (
                <button
                  onClick={() => navigate('/admin/create-problem')}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-all"
                >
                  <Code2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Create Problem</span>
                </button>
              )}
              <ThemeToggle />
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-input rounded-lg leading-5 bg-card/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-colors"
              placeholder="Search problems..."
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading problems...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-destructive/20 border border-destructive/50 rounded-xl p-6 mb-8">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-6 h-6 text-destructive" />
              <div>
                <h3 className="text-destructive font-semibold">Error loading problems</h3>
                <p className="text-destructive/80 text-sm mt-1">{error}</p>
              </div>
            </div>
            <button
              onClick={loadProblems}
              className="mt-4 px-4 py-2 bg-destructive/30 hover:bg-destructive/40 text-destructive-foreground rounded-lg transition-all"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Problems Grid */}
        {!loading && !error && (
          <>
            {filteredProblems.length === 0 ? (
              <div className="text-center py-20">
                <Code2 className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  {searchQuery ? 'No problems found' : 'No problems available'}
                </h2>
                <p className="text-muted-foreground">
                  {searchQuery ? 'Try a different search query' : 'Check back later for new challenges'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProblems.map((problem) => (
                  <div
                    key={problem.id}
                    onClick={() => navigate(`/problems/${problem.id}`)}
                    className="group bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 cursor-pointer hover:bg-card/80 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {problem.id}. {problem.title}
                      </h3>
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full border ${getDifficultyColor(
                          problem.difficulty || 'easy'
                        )}`}
                      >
                        {problem.difficulty || 'Easy'}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {problem.description?.substring(0, 120)}
                      {(problem.description?.length || 0) > 120 ? '...' : ''}
                    </p>

                    {Array.isArray(problem.tags) && problem.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {problem.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 text-xs bg-secondary/50 text-secondary-foreground rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                        {problem.tags.length > 3 && (
                          <span className="px-2 py-1 text-xs text-muted-foreground">
                            +{problem.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Stats Footer */}
            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground text-center">
                Showing {filteredProblems.length} of {problems.length} problems
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
